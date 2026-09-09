import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resume } from "@/lib/models";
import {
  deductUserTokens,
  getSessionUser,
  unauthorizedResponse,
} from "@/lib/server-auth";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface FitAnalysisResult {
  fitScore: number;
  verdict: {
    decision:
      | "strongly_recommended"
      | "recommended"
      | "proceed_with_caution"
      | "not_recommended";
    badge: string;
    rationale: string;
  };
  scoreBreakdown: {
    skillsMatch: number;
    experienceMatch: number;
    requirementsMatch: number;
  };
  executiveSummary: string;
  strengths: string[];
  missingSkills: string[];
  resumeAdjustments: Array<{
    section: string;
    issue: string;
    suggestion: string;
    impact: "high" | "medium" | "low";
  }>;
  interviewTips: string[];
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    const FIT_TOKEN_COST = 10;
    const currentTokens = typeof user?.tokens === "number" ? user.tokens : 50;

    if (currentTokens < FIT_TOKEN_COST) {
      return NextResponse.json(
        {
          error: `Insufficient tokens. Job Fit Analysis requires ${FIT_TOKEN_COST} tokens, but your balance is ${currentTokens}.`,
          code: "INSUFFICIENT_TOKENS",
          requiredTokens: FIT_TOKEN_COST,
          currentTokens,
          redirect: "/pricing",
        },
        { status: 402 },
      );
    }

    await connectDB();

    const body = await request.json();
    const { job, resume } = body;

    if (!job) {
      return NextResponse.json(
        { error: "Job information is required" },
        { status: 400 },
      );
    }

    let jobDescription = job.description || "";
    const jobTitle = job.title || "Target Role";
    const company = job.company || "Target Company";

    // If job mode is URL and no description provided, try to fetch it
    if (job.mode === "url" && job.url && !jobDescription) {
      try {
        const fetchRes = await fetch(job.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        if (fetchRes.ok) {
          const html = await fetchRes.text();
          jobDescription = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 15000);
        }
      } catch (err) {
        console.warn("Could not fetch job URL in fit-analysis:", err);
      }
    }

    if (!jobDescription || jobDescription.length < 20) {
      return NextResponse.json(
        {
          error:
            "Job description is required (minimum 20 characters) or URL could not be accessed.",
        },
        { status: 400 },
      );
    }

    // Resolve Resume
    let resumeText = "";
    let inlinePdfData: { mimeType: string; data: string } | null = null;
    let savedResumeId: string | undefined;

    if (resume?.mode === "saved") {
      if (!resume.resumeId) {
        return NextResponse.json(
          { error: "Please select a saved resume" },
          { status: 400 },
        );
      }
      const savedDoc = await Resume.findOne({
        _id: resume.resumeId,
        userId,
      });
      if (!savedDoc) {
        return NextResponse.json(
          { error: "Selected resume not found" },
          { status: 404 },
        );
      }

      savedResumeId = savedDoc._id.toString();
      if (savedDoc.rawText && savedDoc.rawText.length > 20) {
        resumeText = savedDoc.rawText;
      } else if (savedDoc.fileUrl) {
        // If fileUrl is a data URL (e.g. data:application/pdf;base64,...)
        if (savedDoc.fileUrl.startsWith("data:application/pdf;base64,")) {
          inlinePdfData = {
            mimeType: "application/pdf",
            data: savedDoc.fileUrl.replace("data:application/pdf;base64,", ""),
          };
        } else {
          // Fallback text with resume title/name
          resumeText = `Resume Name: ${savedDoc.name}\nFile: ${savedDoc.fileName}\n(Content reference: ${savedDoc.fileUrl})`;
        }
      }
    } else if (resume?.mode === "upload") {
      if (!resume.fileBase64) {
        return NextResponse.json(
          { error: "Please upload a resume file" },
          { status: 400 },
        );
      }

      const mimeType = resume.mimeType || "application/pdf";
      const cleanBase64 = resume.fileBase64.replace(/^data:[^;]+;base64,/, "");

      if (mimeType.includes("pdf")) {
        inlinePdfData = {
          mimeType: "application/pdf",
          data: cleanBase64,
        };
      } else {
        // Decode base64 text file
        try {
          resumeText = Buffer.from(cleanBase64, "base64").toString("utf-8");
        } catch {
          resumeText = cleanBase64;
        }
      }

      // If user chose to save this resume to their account
      if (resume.saveToAccount) {
        try {
          const newDoc = new Resume({
            userId,
            name: resume.resumeName || resume.fileName || "Uploaded Resume",
            fileName: resume.fileName || "resume.pdf",
            fileUrl: resume.fileBase64.startsWith("data:")
              ? resume.fileBase64
              : `data:${mimeType};base64,${cleanBase64}`,
            uploadedAt: new Date(),
            isDefault: false,
          });
          await newDoc.save();
          savedResumeId = newDoc._id.toString();
        } catch (saveErr) {
          console.error("Failed to auto-save resume:", saveErr);
        }
      }
    } else if (resume?.mode === "text") {
      if (!resume.text || resume.text.trim().length < 20) {
        return NextResponse.json(
          { error: "Resume text must be at least 20 characters long" },
          { status: 400 },
        );
      }
      resumeText = resume.text.trim();
    } else {
      return NextResponse.json(
        { error: "Invalid resume input method" },
        { status: 400 },
      );
    }

    // Build Gemini prompt
    const systemPrompt = `You are a world-class Executive Career Strategist and ATS Resume Auditor.
Your task is to conduct a meticulous, realistic Fit Analysis comparing a Candidate's Resume against a specific Job Posting.

JOB INFORMATION:
Job Title: ${jobTitle}
Company: ${company}

JOB DESCRIPTION:
"""
${jobDescription}
"""

${resumeText ? `CANDIDATE RESUME:\n"""\n${resumeText}\n"""\n` : "The candidate's resume is provided as an attached document."}

EVALUATION CRITERIA:
1. "fitScore": A realistic integer from 0 to 100 based on core qualifications, required skills, and seniority.
2. "verdict":
   - "decision": exactly one of "strongly_recommended" (score >= 78), "recommended" (score 60-77), "proceed_with_caution" (score 45-59), or "not_recommended" (score < 45).
   - "badge": Short punchy badge text (e.g. "Strong Match - Apply Now", "Good Fit - Minor Tweaks Needed", "Reach Opportunity", "Significant Skills Gap").
   - "rationale": Clear, direct answer to "Should I apply?" explaining whether they should apply right now and why.
3. "scoreBreakdown":
   - "skillsMatch": 0-100 (Hard and technical skills match)
   - "experienceMatch": 0-100 (Years of experience and seniority level alignment)
   - "requirementsMatch": 0-100 (Education, certifications, and non-negotiable requirements)
4. "executiveSummary": A 2-3 sentence strategic synthesis of how well this candidate fits the role.
5. "strengths": 3-6 concrete qualifications from the resume that directly match key JD requirements.
6. "missingSkills": 3-8 essential skills, tools, frameworks, or keywords found in the JD that are absent or unclear in the resume.
7. "resumeAdjustments": 3-7 specific, actionable changes to tailor the candidate's resume for this exact job. For each adjustment specify:
   - "section": "Professional Summary" | "Experience / Work History" | "Core Skills" | "Projects" | "Education & Certifications"
   - "issue": What is currently missing or weak in the resume regarding this job.
   - "suggestion": Exact, actionable rewrite or addition (e.g., specific bullet point phrasing, keywords to incorporate, metrics to highlight).
   - "impact": "high" | "medium" | "low"
8. "interviewTips": 2-4 strategic pointers to help them ace the interview if they apply.

Return ONLY valid JSON strictly matching this structure without any markdown wrap.`;

    type GeminiPart = {
      text?: string;
      inlineData?: { mimeType: string; data: string };
    };

    const parts: GeminiPart[] = [{ text: systemPrompt }];

    // If PDF inlineData exists, attach it as multi-modal input
    if (inlinePdfData) {
      parts.unshift({
        inlineData: inlinePdfData,
      });
    }

    const MODELS = [
      "gemini-2.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash-lite",
      "gemini-3.5-flash",
    ];

    let rawOutput = "";
    let lastError = "";

    for (const modelName of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
        const geminiRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          rawOutput =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (rawOutput) break;
        } else {
          lastError = await geminiRes.text();
          console.warn(
            `[Fit Analysis] ${modelName} returned status ${geminiRes.status}:`,
            lastError,
          );
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
        console.warn(`[Fit Analysis] ${modelName} threw:`, lastError);
      }
    }

    if (!rawOutput) {
      return NextResponse.json(
        {
          error: `AI analysis service temporarily unavailable (${lastError.slice(0, 100)}). Please try again.`,
        },
        { status: 502 },
      );
    }

    let result: FitAnalysisResult;
    try {
      result = JSON.parse(rawOutput);
    } catch (_parseError) {
      console.error("Failed to parse Gemini output:", rawOutput);
      return NextResponse.json(
        { error: "AI returned invalid analysis format. Please try again." },
        { status: 500 },
      );
    }

    // Sanitize & normalize fields
    const fitScore = Math.max(
      0,
      Math.min(100, Math.round(Number(result.fitScore) || 0)),
    );

    let decision = result.verdict?.decision;
    if (
      ![
        "strongly_recommended",
        "recommended",
        "proceed_with_caution",
        "not_recommended",
      ].includes(decision)
    ) {
      if (fitScore >= 78) decision = "strongly_recommended";
      else if (fitScore >= 60) decision = "recommended";
      else if (fitScore >= 45) decision = "proceed_with_caution";
      else decision = "not_recommended";
    }

    const normalizedResult: FitAnalysisResult = {
      fitScore,
      verdict: {
        decision,
        badge:
          result.verdict?.badge ||
          (fitScore >= 78
            ? "Strong Match - High Priority Apply"
            : fitScore >= 60
              ? "Good Fit - Apply with Resume Tweaks"
              : fitScore >= 45
                ? "Reach Role - Needs Significant Tailoring"
                : "High Skill Gap - Consider Building Skills First"),
        rationale:
          result.verdict?.rationale ||
          `Your resume demonstrates a ${fitScore}% match with this position.`,
      },
      scoreBreakdown: {
        skillsMatch: Math.max(
          0,
          Math.min(100, Number(result.scoreBreakdown?.skillsMatch) || fitScore),
        ),
        experienceMatch: Math.max(
          0,
          Math.min(
            100,
            Number(result.scoreBreakdown?.experienceMatch) || fitScore,
          ),
        ),
        requirementsMatch: Math.max(
          0,
          Math.min(
            100,
            Number(result.scoreBreakdown?.requirementsMatch) || fitScore,
          ),
        ),
      },
      executiveSummary:
        result.executiveSummary ||
        `Overall fit score is ${fitScore}%. Review key strengths and targeted adjustments below.`,
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      missingSkills: Array.isArray(result.missingSkills)
        ? result.missingSkills
        : [],
      resumeAdjustments: Array.isArray(result.resumeAdjustments)
        ? result.resumeAdjustments.map((item) => ({
            section: item.section || "Experience",
            issue: item.issue || "Opportunity to align keywords",
            suggestion: item.suggestion || "Highlight relevant experience",
            impact: ["high", "medium", "low"].includes(item.impact)
              ? item.impact
              : "medium",
          }))
        : [],
      interviewTips: Array.isArray(result.interviewTips)
        ? result.interviewTips
        : [],
    };

    // Deduct Fit Analysis tokens (10 tokens)
    const deduction = await deductUserTokens({
      userId,
      amount: FIT_TOKEN_COST,
      type: "fit_analysis",
      description: `Job Fit Analysis (${jobTitle} at ${company})`,
      metadata: {
        score: normalizedResult.fitScore,
        decision: normalizedResult.verdict.decision,
      },
    });

    return NextResponse.json({
      success: true,
      data: normalizedResult,
      tokensDeducted: FIT_TOKEN_COST,
      remainingTokens: deduction.newBalance,
      meta: {
        jobTitle,
        company,
        savedResumeId,
      },
    });
  } catch (error) {
    console.error("Error in fit-analysis route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during fit analysis.",
      },
      { status: 500 },
    );
  }
}
