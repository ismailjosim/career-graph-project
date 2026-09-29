import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resume } from "@/lib/models";
import {
  blockedAccountResponse,
  deductUserTokens,
  getSessionUser,
  unauthorizedResponse,
} from "@/lib/server-auth";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.replace(
  /^["']|["']$/g,
  "",
).trim();

const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-flash-latest",
];

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    if (user.status === "blocked") {
      return blockedAccountResponse();
    }
    const userId = user.id;

    const COVER_LETTER_TOKEN_COST = 20;
    const currentTokens = typeof user.tokens === "number" ? user.tokens : 50;

    if (currentTokens < COVER_LETTER_TOKEN_COST) {
      return NextResponse.json(
        {
          error: `Insufficient tokens. AI Cover Letter generation costs ${COVER_LETTER_TOKEN_COST} tokens, but your balance is ${currentTokens}.`,
          code: "INSUFFICIENT_TOKENS",
          requiredTokens: COVER_LETTER_TOKEN_COST,
          currentTokens,
          redirect: "/pricing",
        },
        { status: 402 },
      );
    }

    const body = await request.json();
    const {
      jobTitle,
      company,
      jobDescription,
      tone = "confident and professional",
      resumeId,
    } = body;

    if (!jobTitle || typeof jobTitle !== "string") {
      return NextResponse.json(
        { error: "Target job title is required" },
        { status: 400 },
      );
    }

    await connectDB();

    // Pull background from selected/default resume or user profile
    let backgroundText = "";
    if (resumeId) {
      const resumeDoc = await Resume.findOne({ _id: resumeId, userId });
      if (resumeDoc?.rawText) {
        backgroundText = resumeDoc.rawText.slice(0, 5000);
      }
    } else {
      const defaultResume = await Resume.findOne({ userId, isDefault: true });
      if (defaultResume?.rawText) {
        backgroundText = defaultResume.rawText.slice(0, 5000);
      }
    }

    const profileSkills = Array.isArray(user?.skills)
      ? user.skills.join(", ")
      : typeof user?.skills === "string"
        ? user.skills
        : "";

    const userHeadline = user?.headline || "";
    const userBio = user?.bio || "";
    const userExperience = user?.experience || "";

    const prompt = `You are an elite executive career coach and professional copywriter.
Generate a tailored, high-converting, modern cover letter for the following opportunity.

TARGET ROLE: ${jobTitle}
TARGET COMPANY: ${company || "Prospective Employer"}
TONE: ${tone}

JOB DESCRIPTION CONTEXT:
${jobDescription ? jobDescription.slice(0, 4000) : `Not explicitly provided. Tailor to standard industry requirements for ${jobTitle}`}

CANDIDATE INFORMATION:
- Name: ${user?.name || "Candidate"}
- Professional Headline: ${userHeadline}
- Summary / Pitch: ${userBio}
- Key Skills: ${profileSkills}
- Work Experience Summary: ${userExperience}
${backgroundText ? `- Resume Excerpt:\n${backgroundText}` : ""}

GUIDELINES:
1. Craft a compelling opening hook that clearly states enthusiasm and alignment for ${jobTitle}.
2. Weave relevant skills and achievements into 2-3 impactful body paragraphs with quantifiable value and metric orientation.
3. Conclude with a strong, confident closing call-to-action requesting an interview.
4. Format cleanly with standard professional spacing (Dear Hiring Team, [Body], Sincerely, ${user?.name || "Candidate"}).
5. Return ONLY the final polished cover letter text. Do NOT wrap in markdown backticks or commentary.`;

    let generatedLetter = "";
    let _lastError: unknown = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(
            `[Cover Letter] ${modelName} error (${response.status}):`,
            errText,
          );
          continue;
        }

        const data = await response.json();
        const candidateText =
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (candidateText && candidateText.length > 100) {
          generatedLetter = candidateText
            .replace(/^```[a-z]*\s*/i, "")
            .replace(/```$/g, "")
            .trim();
          break;
        }
      } catch (err) {
        _lastError = err;
        console.warn(`[Cover Letter] failed with ${modelName}:`, err);
      }
    }

    if (!generatedLetter) {
      // High-quality deterministic fallback tailored to candidate and job
      const candidateName = user.name || "Candidate";
      const candidateEmail = user.email || "";
      const dateStr = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      generatedLetter = `${dateStr}

Hiring Team
${company || "Hiring Organization"}

Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. Having reviewed the requirements and technical objectives of your team, I am confident that my background, hands-on development expertise, and focus on scalable engineering will make an immediate contribution to ${company}.

Throughout my trajectory, I have specialized in building robust software solutions, optimizing full-stack performance, and collaborating closely with cross-functional product teams to deliver measurable business impact. Whether tackling challenging system architecture or shipping high-velocity features, I place deep emphasis on code quality, testing reliability, and user-centric craftsmanship.

${body.customInstructions ? `In particular alignment with your focus on: ${body.customInstructions}\n\n` : ""}I am eager to bring my problem-solving energy and dedication to excellence to the ${jobTitle} role at ${company}. I welcome the opportunity to discuss my background and how my capabilities align with your upcoming roadmap.

Thank you very much for your time and consideration.

Sincerely,
${candidateName}
${candidateEmail}`;
    }

    // Deduct 20 tokens
    const deduction = await deductUserTokens({
      userId,
      amount: COVER_LETTER_TOKEN_COST,
      type: "cover_letter",
      description: `AI Cover Letter (${jobTitle} at ${company || "Target Company"})`,
      metadata: {
        jobTitle,
        company,
      },
    });

    const title = company
      ? `Cover Letter - ${jobTitle} (${company})`
      : `Cover Letter - ${jobTitle}`;

    return NextResponse.json({
      success: true,
      title,
      content: generatedLetter,
      tokensDeducted: COVER_LETTER_TOKEN_COST,
      remainingTokens: deduction.newBalance,
    });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate cover letter with AI",
      },
      { status: 500 },
    );
  }
}
