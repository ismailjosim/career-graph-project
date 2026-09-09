import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resume } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface AtsAnalysisResult {
  overallScore: number;
  rating: "excellent" | "good" | "needs_improvement" | "poor";
  badge: string;
  executiveSummary: string;
  quickWins: string[];
  categoryScores: {
    formatting: number;
    keywords: number;
    contentImpact: number;
    structure: number;
  };
  categoryFeedback: {
    formatting: string;
    keywords: string;
    contentImpact: string;
    structure: string;
  };
  criticalIssues: Array<{
    id: string;
    section: string;
    severity: "high" | "medium" | "low";
    title: string;
    issue: string;
    recommendation: string;
  }>;
  detectedKeywords: string[];
  missingKeywords: string[];
  actionVerbCount: number;
  quantifiableMetricsScore: number;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
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
      if (savedDoc.rawText && savedDoc.rawText.length > 20) {
        resumeText = savedDoc.rawText;
      } else if (savedDoc.fileUrl) {
        if (savedDoc.fileUrl.startsWith("data:application/pdf;base64,")) {
          inlinePdfData = {
            mimeType: "application/pdf",
            data: savedDoc.fileUrl.replace("data:application/pdf;base64,", ""),
          };
        } else {
          resumeText = `Resume Title: ${savedDoc.name}\nFile: ${savedDoc.fileName}\n(Content reference: ${savedDoc.fileUrl})`;
        }
      }
    } else if (resume.mode === "upload") {
      if (!resume.fileBase64) {
        return NextResponse.json(
          { error: "Please upload a resume file" },
          { status: 400 },
        );
      }

      const mimeType = resume.mimeType || "application/pdf";
      const cleanBase64 = resume.fileBase64.replace(/^data:[^;]+;base64,/, "");
      resumeTitle = resume.fileName || "Uploaded Resume";

      if (mimeType.includes("pdf")) {
        inlinePdfData = {
          mimeType: "application/pdf",
          data: cleanBase64,
        };
      } else {
        try {
          resumeText = Buffer.from(cleanBase64, "base64").toString("utf-8");
        } catch {
          resumeText = cleanBase64;
        }
      }
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

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment.",
        },
        { status: 503 },
      );
    }

    // Optional target job details
    const targetJobTitle = targetJob?.title?.trim() || "";
    const targetJobDesc = targetJob?.description?.trim() || "";

    const systemPrompt = `You are a Principal Talent Acquisition Lead and Certified ATS (Applicant Tracking System) Auditor with 15+ years of experience auditing resumes for Taleo, Workday, Greenhouse, and Lever.
Your task is to conduct an authoritative, rigorous ATS audit of the provided candidate resume.

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

3. Detailed Diagnostics:
   - Identify 4-7 specific issues categorized by severity ('high', 'medium', 'low').
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
  "quantifiableMetricsScore": number (0-100)
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

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-3.6-flash",
      "gemini-flash-latest",
      "gemini-2.5-pro",
    ];

    let rawOutput = "";
    let lastError = "";

    for (const modelName of modelsToTry) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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

    if (!rawOutput) {
      return NextResponse.json(
        {
          error: `AI analysis service temporarily unavailable. Please try again. (${lastError.slice(0, 80)})`,
        },
        { status: 502 },
      );
    }

    // Robust JSON Parser & Sanitizer
    let parsedResult: AtsAnalysisResult;
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
    };

    return NextResponse.json({
      success: true,
      resumeTitle,
      result: normalizedResult,
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
