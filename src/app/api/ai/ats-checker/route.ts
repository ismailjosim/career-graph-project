import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resume } from "@/lib/models";
import {
  GEMINI_MODELS,
  generateDeterministicAtsAudit,
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

import type { AtsAiReadiness, AtsAnalysisResult } from "@/interfaces/ats";
export type { AtsAnalysisResult, AtsAiReadiness };

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

    const ATS_TOKEN_COST = 10;
    const currentTokens = typeof user.tokens === "number" ? user.tokens : 50;

    if (currentTokens < ATS_TOKEN_COST) {
      return NextResponse.json(
        {
          error: `Insufficient tokens. ATS Resume Audit requires ${ATS_TOKEN_COST} tokens, but your balance is ${currentTokens}.`,
          code: "INSUFFICIENT_TOKENS",
          requiredTokens: ATS_TOKEN_COST,
          currentTokens,
          redirect: "/pricing",
        },
        { status: 402 },
      );
    }

    await connectDB();

    const body = await request.json();
    const { resume, targetJob } = body;

    if (!resume) {
      return NextResponse.json(
        { error: "Resume content or file is required for ATS audit" },
        { status: 400 },
      );
    }

    // Resolve Resume
    let resumeText = "";
    let inlinePdfData: { mimeType: string; data: string } | null = null;
    let resumeTitle = "Resume";

    if (resume.mode === "saved") {
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

      resumeTitle = savedDoc.name || savedDoc.fileName || "Saved Resume";
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
    } else if (resume.mode === "upload") {
      if (!resume.fileBase64) {
        return NextResponse.json(
          { error: "Please upload a resume file" },
          { status: 400 },
        );
      }
      resumeTitle = resume.fileName || "Uploaded Resume";
      const extracted = await extractResumeTextUniversal({
        fileBase64: resume.fileBase64,
        fileName: resume.fileName,
      });
      resumeText = extracted.text;
      inlinePdfData = extracted.inlinePdfData;
    } else if (resume.mode === "text") {
      if (!resume.text || resume.text.trim().length < 20) {
        return NextResponse.json(
          { error: "Resume text must be at least 20 characters long" },
          { status: 400 },
        );
      }
      resumeText = resume.text.trim();
      resumeTitle = resume.title || "Pasted Resume Text";
    } else {
      return NextResponse.json(
        { error: "Invalid resume input method" },
        { status: 400 },
      );
    }

    // Strict Resume Validation: Verify document content before AI audit or token deduction
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

    // Optional target job details & regional standards
    const targetJobTitle = targetJob?.title?.trim() || "";
    const targetJobDesc = targetJob?.description?.trim() || "";
    const regionStandard = targetJob?.regionStandard || "us_canada";

    const REGIONAL_COMPLIANCE_GUIDELINES: Record<string, string> = {
      us_canada:
        "ENFORCE US & CANADA ATS GUIDELINES: Strict 1-2 page maximum, strict anti-bias compliance (flag any photo, date of birth, nationality, marital status, or full street address as severe anti-discrimination compliance risks), high action verb density.",
      uk_commonwealth:
        "ENFORCE UK & COMMONWEALTH CV GUIDELINES: Two-page standard expected, detailed academic credential classifications (GCSE, A-Levels, 1st/2:1 degrees), British English spelling conventions.",
      european_europass:
        "ENFORCE EUROPEAN UNION / EUROPASS GUIDELINES: Standardize modular European CV sections, assess CEFR language proficiency levels (A1 to C2), international project experience.",
      apac_global:
        "ENFORCE GLOBAL REMOTE & APAC GUIDELINES: Cross-border distributed tooling proficiencies (Slack, Jira, async workflows), timezone overlap availability, international work authorization clarity.",
    };

    const systemPrompt = `You are a Principal Talent Acquisition Lead and Certified ATS (Applicant Tracking System) Auditor with 15+ years of experience auditing resumes for Taleo, Workday, Greenhouse, and Lever.
Your task is to conduct an authoritative, rigorous ATS audit of the provided candidate resume.

JURISDICTION STANDARD:
${REGIONAL_COMPLIANCE_GUIDELINES[regionStandard] || REGIONAL_COMPLIANCE_GUIDELINES.us_canada}

EVALUATION CRITERIA:
1. Overall ATS Compliance & Parseability (0-100 score):
   - 85-100: Excellent (Ready for high-volume enterprise ATS algorithms)
   - 70-84: Good (Strong candidate, minor keyword or formatting optimizations needed)
   - 50-69: Needs Improvement (Parseability risks, vague metrics, or missing core keywords)
   - 0-49: Poor (High risk of automatic rejection)

2. Core Category Scores (each 0-100):
   - formatting: Layout cleanliness, standard headers (Experience, Education, Skills), no complex multi-column parse barriers, text readability.
   - keywords: Industry-standard hard and soft skills, technical proficiencies, role-specific terminology.
   - contentImpact: Action verbs starting bullet points, measurable business impact (%, $, numbers, time saved), avoidance of generic buzzwords.
   - structure: Complete contact information, clear chronological trajectory, concise summary, education credentials.

3. Modern AI & Agentic Tooling Audit (2026+ Market Standards):
   - Assess candidate proficiency with modern AI tools, agentic workflows, and AI-accelerated engineering/productivity.
   - For technical & developer roles: check for tools like Cursor, Windsurf, Claude Code, GitHub Copilot, v0, LangChain, Autonomous Agents, LLM APIs, Prompt Engineering.
   - For non-technical roles: check for AI workflow automation, ChatGPT/Claude research, AI tooling adoption.
   - If the resume is older or lacks modern AI capabilities, flag this explicitly in criticalIssues ('section': 'Modern & AI Skills', 'severity': 'medium' or 'high'), include missing AI tools in missingKeywords, and populate the 'aiReadiness' object with concrete advice on how to integrate AI skills into their past experience bullets.

4. Detailed Diagnostics:
   - Identify 4-7 specific issues categorized by severity ('high', 'medium', 'low'). Include at least one actionable suggestion regarding modern AI tooling/workflows if the resume lacks AI competency.
   - For each issue, provide the exact section, issue explanation, and actionable 'recommendation' demonstrating how to rewrite or fix it.
   - Detect hard & soft skills found in the resume.
   - Identify 4-8 recommended missing keywords that top candidates in this domain possess.
   - Provide 3 high-impact 'quickWins' that will increase their score immediately.

${
  targetJobTitle || targetJobDesc
    ? `TARGET JOB CONTEXT:
Job Title: ${targetJobTitle || "Specified Role"}
Job Description:
${targetJobDesc || "N/A"}
Compare the resume directly against the requirements and keywords of this target job.`
    : `TARGET DOMAIN: Analyze as a versatile professional resume against contemporary market benchmarks for their demonstrated field.`
}

CRITICAL FORMATTING INSTRUCTIONS:
- Return ONLY valid JSON with NO markdown code fences, NO backticks, and NO trailing commas.
- All strings must be single-line with NO raw unescaped newlines or tabs inside string values.
- Escape any double quotes within strings using \\".
The JSON must adhere precisely to this schema:
{
  "overallScore": number (0-100),
  "rating": "excellent" | "good" | "needs_improvement" | "poor",
  "badge": "string (e.g. 'Strong ATS Candidate', 'Moderate ATS Risk', 'Enterprise Ready')",
  "executiveSummary": "string (3-4 concise sentences summarizing the overall audit)",
  "quickWins": ["string", "string", "string"],
  "categoryScores": {
    "formatting": number (0-100),
    "keywords": number (0-100),
    "contentImpact": number (0-100),
    "structure": number (0-100)
  },
  "categoryFeedback": {
    "formatting": "string summary",
    "keywords": "string summary",
    "contentImpact": "string summary",
    "structure": "string summary"
  },
  "criticalIssues": [
    {
      "id": "string",
      "section": "string",
      "severity": "high" | "medium" | "low",
      "title": "string",
      "issue": "string",
      "recommendation": "string"
    }
  ],
  "detectedKeywords": ["string"],
  "missingKeywords": ["string"],
  "actionVerbCount": number,
  "quantifiableMetricsScore": number (0-100),
  "aiReadiness": {
    "score": number (0-100),
    "level": "agentic_native" | "ai_augmented" | "emerging" | "traditional_outdated",
    "headline": "string (concise summary of candidate's modern AI adoption)",
    "detectedAiSkills": ["string"],
    "missingModernSkills": ["string"],
    "suggestions": ["string", "string"]
  }
}`;

    const contentsPayload: Array<Record<string, unknown>> = [];
    const partsPayload: Array<Record<string, unknown>> = [
      { text: systemPrompt },
    ];

    if (inlinePdfData) {
      partsPayload.push({
        inlineData: {
          mimeType: inlinePdfData.mimeType,
          data: inlinePdfData.data,
        },
      });
      partsPayload.push({
        text: "Please analyze the attached PDF resume according to the ATS guidelines specified above.",
      });
    } else {
      partsPayload.push({
        text: `RESUME CONTENT TO AUDIT:\n"""\n${resumeText}\n"""`,
      });
    }

    contentsPayload.push({
      role: "user",
      parts: partsPayload,
    });

    let rawOutput = "";
    let lastError = "";

    if (GEMINI_API_KEY) {
      for (const modelName of GEMINI_MODELS) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(9000),
              body: JSON.stringify({
                contents: contentsPayload,
                generationConfig: {
                  temperature: 0.1,
                  topP: 0.95,
                  maxOutputTokens: 8192,
                  responseMimeType: "application/json",
                },
              }),
            },
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            rawOutput =
              geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (rawOutput) break;
          } else {
            lastError = await geminiRes.text();
            console.warn(`[ATS Checker] ${modelName} error:`, lastError);
          }
        } catch (err) {
          lastError = err instanceof Error ? err.message : String(err);
          console.warn(`[ATS Checker] ${modelName} threw:`, lastError);
        }
      }
    }

    let parsedResult: AtsAnalysisResult;

    if (!rawOutput) {
      // Dynamic ATS audit analyzing candidate's actual extracted resume text
      parsedResult = generateDeterministicAtsAudit({
        resumeText: resumeText || resumeTitle,
        resumeTitle,
        targetJobTitle,
        targetJobDesc,
        regionStandard,
      });
    } else {
      // Robust JSON Parser & Sanitizer
      try {
        // 1. First attempt: Direct parse
        parsedResult = JSON.parse(rawOutput);
      } catch (_firstErr) {
        // 2. Second attempt: Strip markdown fences and isolate JSON object
        let cleaned = rawOutput
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "")
          .trim();

        const startIdx = cleaned.indexOf("{");
        const endIdx = cleaned.lastIndexOf("}");
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
          cleaned = cleaned.substring(startIdx, endIdx + 1);
        }

        try {
          parsedResult = JSON.parse(cleaned);
        } catch (_secondErr) {
          // 3. Third attempt: Repair unescaped newlines/tabs inside strings
          let inStr = false;
          let isEsc = false;
          let repaired = "";
          for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned[i];
            if (char === '"' && !isEsc) {
              inStr = !inStr;
              repaired += char;
            } else if (inStr && (char === "\n" || char === "\r")) {
              repaired += char === "\n" ? "\\n" : "";
            } else if (inStr && char === "\t") {
              repaired += "\\t";
            } else {
              repaired += char;
            }
            isEsc = char === "\\" && !isEsc;
          }

          try {
            parsedResult = JSON.parse(repaired);
          } catch (_finalErr) {
            console.error("[ATS Checker] Failed to parse output:", rawOutput);
            return NextResponse.json(
              {
                error:
                  "The AI returned an invalid response format. Please try running the audit again.",
              },
              { status: 500 },
            );
          }
        }
      }
    }

    const overallScore = Math.max(
      0,
      Math.min(100, Math.round(Number(parsedResult.overallScore) || 70)),
    );

    let rating = parsedResult.rating;
    if (!["excellent", "good", "needs_improvement", "poor"].includes(rating)) {
      if (overallScore >= 85) rating = "excellent";
      else if (overallScore >= 70) rating = "good";
      else if (overallScore >= 50) rating = "needs_improvement";
      else rating = "poor";
    }

    const normalizedResult: AtsAnalysisResult = {
      overallScore,
      rating,
      badge:
        parsedResult.badge ||
        (overallScore >= 85
          ? "Enterprise Ready"
          : overallScore >= 70
            ? "Strong Candidate"
            : overallScore >= 50
              ? "Moderate ATS Risk"
              : "High ATS Risk"),
      executiveSummary:
        parsedResult.executiveSummary ||
        "The resume was audited across ATS parseability, keywords, and impact standards.",
      quickWins: Array.isArray(parsedResult.quickWins)
        ? parsedResult.quickWins
        : [],
      categoryScores: {
        formatting: Math.max(
          0,
          Math.min(
            100,
            Number(parsedResult.categoryScores?.formatting) || overallScore,
          ),
        ),
        keywords: Math.max(
          0,
          Math.min(
            100,
            Number(parsedResult.categoryScores?.keywords) || overallScore,
          ),
        ),
        contentImpact: Math.max(
          0,
          Math.min(
            100,
            Number(parsedResult.categoryScores?.contentImpact) || overallScore,
          ),
        ),
        structure: Math.max(
          0,
          Math.min(
            100,
            Number(parsedResult.categoryScores?.structure) || overallScore,
          ),
        ),
      },
      categoryFeedback: {
        formatting:
          parsedResult.categoryFeedback?.formatting ||
          "Formatting and standard layout assessment.",
        keywords:
          parsedResult.categoryFeedback?.keywords ||
          "Keyword density and industry terminology alignment.",
        contentImpact:
          parsedResult.categoryFeedback?.contentImpact ||
          "Action verbs and measurable results assessment.",
        structure:
          parsedResult.categoryFeedback?.structure ||
          "Completeness of sections and career timeline clarity.",
      },
      criticalIssues: Array.isArray(parsedResult.criticalIssues)
        ? parsedResult.criticalIssues.map((issue, idx) => ({
            id: issue.id || `issue-${idx + 1}`,
            section: issue.section || "General",
            severity: ["high", "medium", "low"].includes(issue.severity)
              ? issue.severity
              : "medium",
            title: issue.title || "Improvement Area",
            issue: issue.issue || "",
            recommendation: issue.recommendation || "",
          }))
        : [],
      detectedKeywords: Array.isArray(parsedResult.detectedKeywords)
        ? parsedResult.detectedKeywords
        : [],
      missingKeywords: Array.isArray(parsedResult.missingKeywords)
        ? parsedResult.missingKeywords
        : [],
      actionVerbCount: Number(parsedResult.actionVerbCount) || 12,
      quantifiableMetricsScore: Math.max(
        0,
        Math.min(
          100,
          Number(parsedResult.quantifiableMetricsScore) || overallScore,
        ),
      ),
      aiReadiness: parsedResult.aiReadiness
        ? {
            score: Math.max(
              0,
              Math.min(100, Number(parsedResult.aiReadiness.score) || 60),
            ),
            level: [
              "agentic_native",
              "ai_augmented",
              "emerging",
              "traditional_outdated",
            ].includes(parsedResult.aiReadiness.level)
              ? parsedResult.aiReadiness.level
              : "emerging",
            headline:
              parsedResult.aiReadiness.headline ||
              "AI tooling & modern workflows analysis.",
            detectedAiSkills: Array.isArray(
              parsedResult.aiReadiness.detectedAiSkills,
            )
              ? parsedResult.aiReadiness.detectedAiSkills
              : [],
            missingModernSkills: Array.isArray(
              parsedResult.aiReadiness.missingModernSkills,
            )
              ? parsedResult.aiReadiness.missingModernSkills
              : [
                  "AI Coding Assistants (Cursor / Copilot)",
                  "Autonomous Agent Workflows",
                  "Prompt Engineering",
                ],
            suggestions: Array.isArray(parsedResult.aiReadiness.suggestions)
              ? parsedResult.aiReadiness.suggestions
              : [
                  "Mention experience with modern AI tools (e.g. Cursor, GitHub Copilot, v0) in your Technical Skills section.",
                  "Add measurable bullet points demonstrating AI-accelerated delivery and automated workflows.",
                ],
          }
        : {
            score: 50,
            level: "emerging",
            headline:
              "Resume could benefit from demonstrating modern AI & Agent tool adoption.",
            detectedAiSkills: [],
            missingModernSkills: [
              "AI Coding Assistants (Cursor / Copilot)",
              "Autonomous Agent Workflows",
              "Prompt Engineering",
            ],
            suggestions: [
              "Add modern AI-assisted workflows (e.g., Cursor, v0, Copilot) to your skills matrix to align with 2026 hiring trends.",
              "Quantify how you leverage AI tools to increase velocity and maintain software quality.",
            ],
          },
    };

    // Deduct ATS check tokens (10 tokens)
    const deduction = await deductUserTokens({
      userId,
      amount: ATS_TOKEN_COST,
      type: "ats_check",
      description: `ATS Resume Audit (${resumeTitle})`,
      metadata: {
        score: overallScore,
        targetRole: targetJob?.title || "General",
      },
    });

    return NextResponse.json({
      success: true,
      resumeTitle,
      result: normalizedResult,
      tokensDeducted: ATS_TOKEN_COST,
      remainingTokens: deduction.newBalance,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("ATS Checker error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during ATS analysis",
      },
      { status: 500 },
    );
  }
}
