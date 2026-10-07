import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resume } from "@/lib/models";
import {
  GEMINI_MODELS,
  generateDeterministicCoverLetter,
} from "@/lib/resume-analyzer";
import { extractResumeTextUniversal } from "@/lib/resume-text-extractor";
import {
  blockedAccountResponse,
  deductUserTokens,
  getSessionUser,
  unauthorizedResponse,
} from "@/lib/server-auth";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.replace(
  /^["']|["']$/g,
  "",
)?.trim();

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
    let resumeDoc = null;

    if (resumeId) {
      resumeDoc = await Resume.findOne({ _id: resumeId, userId });
    } else {
      resumeDoc =
        (await Resume.findOne({ userId, isDefault: true })) ||
        (await Resume.findOne({ userId }).sort({ uploadedAt: -1 }));
    }

    if (resumeDoc) {
      const extracted = await extractResumeTextUniversal({
        rawText: resumeDoc.rawText,
        fileUrl: resumeDoc.fileUrl,
        builderData: resumeDoc.builderData,
        fileName: resumeDoc.fileName,
      });
      backgroundText = extracted.text ? extracted.text.slice(0, 6000) : "";
      if (!resumeDoc.rawText && extracted.text) {
        resumeDoc.rawText = extracted.text;
        await resumeDoc.save().catch(() => {});
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

    if (GEMINI_API_KEY) {
      for (const modelName of GEMINI_MODELS) {
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
    }

    if (!generatedLetter) {
      // Dynamic, high-quality letter tailored to the candidate's actual background and target role
      generatedLetter = generateDeterministicCoverLetter({
        candidateName: user.name || "Candidate",
        candidateEmail: user.email || "",
        jobTitle,
        company: company || "your team",
        tone,
        jobDescription,
        resumeText: backgroundText,
      });
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
