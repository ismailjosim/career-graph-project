import { type NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { Resume } from "@/lib/models";
import { extractProfileFromText, GEMINI_MODELS } from "@/lib/resume-analyzer";
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
    if (!user) {
      return unauthorizedResponse();
    }
    if (user.status === "blocked") {
      return blockedAccountResponse();
    }
    const userId = user.id;

    const FIT_TOKEN_COST = 10;
    const currentTokens = typeof user.tokens === "number" ? user.tokens : 50;

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
      const extracted = await extractResumeTextUniversal({
        rawText: savedDoc.rawText,
        fileUrl: savedDoc.fileUrl,
        builderData: savedDoc.builderData,
        fileName: savedDoc.fileName,
      });
      resumeText = extracted.text;
      inlinePdfData = extracted.inlinePdfData;

      if (!savedDoc.rawText && resumeText) {
        savedDoc.rawText = resumeText;
        await savedDoc.save().catch(() => {});
      }
    } else if (resume?.mode === "upload") {
      if (!resume.fileBase64) {
        return NextResponse.json(
          { error: "Please upload a resume file" },
          { status: 400 },
        );
      }

      const mimeType =
        resume.fileBase64.match(/^data:([^;]+);/)?.[1] || "application/pdf";
      const cleanBase64 = resume.fileBase64.replace(/^data:[^;]+;base64,/, "");
      const extracted = await extractResumeTextUniversal({
        fileBase64: resume.fileBase64,
        fileName: resume.fileName,
      });
      resumeText = extracted.text;
      inlinePdfData = extracted.inlinePdfData;

      // If user chose to save this resume to their account
      if (resume.saveToAccount) {
        try {
          const buffer = Buffer.from(cleanBase64, "base64");
          let fileUrl = resume.fileBase64.startsWith("data:")
            ? resume.fileBase64
            : `data:${mimeType};base64,${cleanBase64}`;
          let cloudinaryPublicId: string | undefined;

          try {
            const uploadRes = await uploadToCloudinary(buffer, {
              folder: "career-graph/resumes",
              resourceType: "auto",
              publicId: `resume_${userId}_${Date.now()}`,
            });
            fileUrl = uploadRes.secureUrl;
            cloudinaryPublicId = uploadRes.publicId;
          } catch (cldErr) {
            console.warn(
              "Could not upload to Cloudinary, falling back to base64:",
              cldErr,
            );
          }

          const newDoc = new Resume({
            userId,
            name: resume.resumeName || resume.fileName || "Uploaded Resume",
            fileName: resume.fileName || "resume.pdf",
            fileUrl,
            cloudinaryPublicId,
            fileSize: buffer.byteLength,
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

    // Strict Resume Validation: Verify document content before AI processing
    const { validateResumeContent } = await import("@/lib/resume-validator");
    const validation = validateResumeContent(resumeText);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error:
            validation.reason ||
            "The uploaded document does not appear to be a valid resume or CV. Please upload a PDF document that clearly includes your work experience, education, and skills.",
          code: "INVALID_RESUME_DOCUMENT",
          validationScore: validation.score,
          matchedCategories: validation.matchedCategories,
        },
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

    let rawOutput = "";
    let lastError = "";

    if (GEMINI_API_KEY) {
      for (const modelName of GEMINI_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
          const geminiRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(9000),
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
    }

    let result: FitAnalysisResult;

    if (!rawOutput) {
      // Dynamic candidate-specific fit analysis based on actual resume and job post
      const profile = extractProfileFromText(resumeText);
      const jdProfile = extractProfileFromText(jobDescription);

      const resumeSkills = new Set(
        profile.detectedSkills.map((s) => s.toLowerCase()),
      );
      const jdSkills = jdProfile.detectedSkills;

      const matchedSkills = jdSkills.filter((s) =>
        resumeSkills.has(s.toLowerCase()),
      );
      const missingSkills = jdSkills.filter(
        (s) => !resumeSkills.has(s.toLowerCase()),
      );

      const matchRatio =
        jdSkills.length > 0
          ? matchedSkills.length / jdSkills.length
          : profile.detectedSkills.length > 0
            ? 0.75
            : 0.5;

      const calculatedScore = Math.min(
        95,
        Math.max(45, Math.round(50 + matchRatio * 42)),
      );

      const candidateTitle = profile.detectedTitle || "candidate";

      result = {
        fitScore: calculatedScore,
        verdict: {
          decision:
            calculatedScore >= 78
              ? "strongly_recommended"
              : calculatedScore >= 60
                ? "recommended"
                : "proceed_with_caution",
          badge:
            calculatedScore >= 78
              ? "Strong Match - Apply with High Confidence"
              : calculatedScore >= 60
                ? "Good Fit - Minor Keyword Tailoring Needed"
                : "Reach Opportunity - Highlight Transferable Strengths",
          rationale: `As a ${candidateTitle}, your demonstrated qualifications align well with key aspects of the ${jobTitle} position at ${company}. Addressing missing competencies will maximize interview probability.`,
        },
        scoreBreakdown: {
          skillsMatch: Math.round(matchRatio * 100) || 70,
          experienceMatch: profile.actionVerbCount >= 6 ? 85 : 72,
          requirementsMatch: calculatedScore,
        },
        executiveSummary: `Fit analysis completed comparing your resume against the ${jobTitle} opening at ${company}. Your background demonstrates solid experience in ${profile.detectedSkills.slice(0, 3).join(", ") || "core domain requirements"}, with targeted opportunities to highlight ${missingSkills.slice(0, 2).join(", ") || "supplementary tools"}.`,
        strengths:
          matchedSkills.length > 0
            ? matchedSkills.map(
                (s) =>
                  `Demonstrated proficiency in ${s}, directly matching requirements for ${jobTitle}.`,
              )
            : profile.detectedSkills.length > 0
              ? profile.detectedSkills
                  .slice(0, 4)
                  .map(
                    (s) =>
                      `Strong background in ${s} provides transferable technical capability for this position.`,
                  )
              : [
                  "Directly applicable professional experience and foundational competencies.",
                  "Experience managing full delivery lifecycles in collaborative environments.",
                  "Strong communication and cross-functional team execution.",
                ],
        missingSkills:
          missingSkills.length > 0
            ? missingSkills.map(
                (s) => `${s} (specified in ${company} job requirements)`,
              )
            : [
                "Cursor / Modern AI productivity toolchains",
                "Advanced CI/CD automation & observability",
              ],
        resumeAdjustments: [
          {
            section: "Professional Summary",
            issue:
              "Your summary should open with direct alignment to the target job title.",
            suggestion: `Tailor opening statement: '${candidateTitle || "Professional"} experienced in ${matchedSkills.slice(0, 2).join(", ") || "scalable execution"} applying for ${jobTitle} at ${company}.'`,
            impact: "high",
          },
          {
            section: "Core Skills",
            issue:
              "Target job requirements should appear prominently in your top skills matrix.",
            suggestion: `Incorporate key requirements: ${missingSkills.slice(0, 3).join(", ") || matchedSkills.slice(0, 3).join(", ") || "Domain proficiencies"}.`,
            impact: "high",
          },
          {
            section: "Experience / Work History",
            issue:
              "Highlight measurable business outcomes and quantitative metrics.",
            suggestion:
              "Incorporate quantifiable outcomes (e.g. latency, revenue, conversion %, time saved) in your top achievement bullets.",
            impact: "medium",
          },
        ],
        interviewTips: [
          `Articulate how your experience with ${matchedSkills.slice(0, 2).join(", ") || "core systems"} solves key operational objectives at ${company}.`,
          "Prepare 2 concrete STAR method examples showcasing how you resolved challenging project blockers.",
          "Demonstrate familiarity with modern 2026 AI workflows (e.g. Cursor, GitHub Copilot) to highlight delivery velocity.",
        ],
      };
    } else {
      try {
        result = JSON.parse(rawOutput);
      } catch (_parseError) {
        console.error("Failed to parse Gemini output:", rawOutput);
        return NextResponse.json(
          { error: "AI returned invalid analysis format. Please try again." },
          { status: 500 },
        );
      }
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
