import { type NextRequest, NextResponse } from "next/server";
import {
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
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { type = "bullet", text, role, company, targetJob } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text content to enhance is required" },
        { status: 400 },
      );
    }

    const TOKEN_COST = type === "summary" ? 15 : 10;
    const currentTokens = typeof user?.tokens === "number" ? user.tokens : 50;

    if (currentTokens < TOKEN_COST) {
      return NextResponse.json(
        {
          error: `Insufficient tokens. AI Resume Polish (${type}) requires ${TOKEN_COST} tokens, but your balance is ${currentTokens}.`,
          code: "INSUFFICIENT_TOKENS",
          requiredTokens: TOKEN_COST,
          currentTokens,
          redirect: "/pricing",
        },
        { status: 402 },
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 },
      );
    }

    let prompt = "";
    if (type === "summary") {
      prompt = `You are a world-class executive resume writer and career strategist.
Enhance and rewrite the following professional summary for a candidate targeting ${role || "their next senior role"}${company ? ` at ${company}` : ""}.
Target Job or Focus: ${targetJob || "Industry best practice"}

CURRENT DRAFT:
"""
${text}
"""

GUIDELINES:
1. Craft a punchy, 3-4 sentence high-impact summary.
2. Highlight proven leadership, technical mastery, and tangible business outcomes.
3. Use strong active verbs and industry-standard keywords.
4. Do NOT use buzzwords without substance.
5. Return ONLY the final polished summary text. No markdown backticks, no quotes, no explanations.`;
    } else {
      prompt = `You are an expert resume editor specialized in ATS optimization and Google XYZ formula (Accomplished [X] as measured by [Y] by doing [Z]).
Rewrite and strengthen the following resume bullet point(s) or job responsibility description for the role: ${role || "Professional"}${company ? ` at ${company}` : ""}.

ORIGINAL CONTENT:
"""
${text}
"""

GUIDELINES:
1. Transform the input into 1 to 3 distinct, punchy, high-impact bullet points.
2. Start each bullet point with a powerful past-tense action verb (e.g., Engineered, Spearheaded, Architected, Accelerated, Reduced, Orchestrated).
3. Where appropriate, include realistic quantifiable metrics, percentages, or scale indicators.
4. Optimize for ATS keyword scanning.
5. Format output with each bullet point on its own line starting with "• ".
6. Return ONLY the bullet points. No conversational filler, no greetings, no markdown backtick blocks.`;
    }

    let resultText = "";
    let lastError: unknown = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(
            `[Resume Polish] ${modelName} error (${response.status}):`,
            errText,
          );
          continue;
        }

        const data = await response.json();
        const candidate =
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (candidate && candidate.length > 10) {
          resultText = candidate
            .replace(/^```[a-z]*\s*/i, "")
            .replace(/```$/g, "")
            .trim();
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Resume Polish] ${modelName} call failed:`, err);
      }
    }

    if (!resultText) {
      throw new Error(
        lastError instanceof Error
          ? lastError.message
          : "AI Resume Polish generation failed across available Gemini models.",
      );
    }

    // Deduct tokens on successful AI generation
    const deduction = await deductUserTokens({
      userId,
      amount: TOKEN_COST,
      type: "resume_builder",
      description: `AI Resume Polish (${type === "summary" ? "Summary" : "Bullet Point"})`,
    });

    return NextResponse.json({
      success: true,
      enhancedText: resultText,
      tokensDeducted: TOKEN_COST,
      newBalance: deduction.newBalance,
    });
  } catch (error) {
    console.error("Error in AI resume polish:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to enhance text",
      },
      { status: 500 },
    );
  }
}
