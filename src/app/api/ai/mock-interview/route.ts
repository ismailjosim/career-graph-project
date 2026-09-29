import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
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

const CURATED_QUESTIONS_FALLBACK: Record<string, Record<string, string[]>> = {
  behavioral: {
    general: [
      "Tell me about a time when you had to resolve a high-stakes disagreement with a teammate or cross-functional stakeholder.",
      "Describe a situation where a critical project fell behind schedule or faced unexpected blockers. How did you handle it?",
      "Can you share an experience where you had to adapt quickly to a major change in project requirements or company strategy?",
      "Give an example of a time you received constructive critical feedback. How did you react and what changes did you make?",
      "Tell me about a proud accomplishment where you delivered measurable business impact.",
    ],
    technical: [
      "Walk me through the most technically challenging bug or production incident you diagnosed. How did you find the root cause?",
      "Describe an architectural decision you made where you had to trade off between development speed and long-term scalability.",
      "Tell me about a time you had to optimize performance for a slow application or database query. What was the outcome?",
      "How do you ensure code quality, testability, and security across a team under tight delivery deadlines?",
    ],
  },
  system_design: {
    general: [
      "Design a real-time collaborative document editing service (like Google Docs or Notion) handling concurrent edits and offline sync.",
      "How would you architect a global job application notification and alerting service that delivers millions of push and email events daily?",
      "Design a distributed rate-limiting middleware that operates reliably across multiple geographical edge regions.",
      "Architect a scalable analytics ingestion pipeline capable of tracking 100,000 user events per second with sub-second dashboard updates.",
    ],
  },
  leadership: {
    general: [
      "Describe how you mentor junior and mid-level engineers to foster technical ownership and psychological safety.",
      "Tell me about a time you had to say 'no' to an executive or product manager's feature request due to technical debt or bandwidth.",
      "How do you establish engineering team velocity and maintain morale during high-pressure delivery cycles?",
      "Describe how you navigate hiring and interviewing to build a high-performing, diverse engineering team.",
    ],
  },
};

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    if (user.status === "blocked") {
      return blockedAccountResponse();
    }

    const body = await request.json();
    const { action } = body;

    await connectDB();

    // -------------------------------------------------------------
    // ACTION 1: Generate Role-Specific Interview Questions
    // -------------------------------------------------------------
    if (action === "generate-questions") {
      const {
        role = "Software Engineer",
        interviewType = "behavioral",
        experienceLevel = "mid",
      } = body;

      // Try AI generation if API key is present
      if (GEMINI_API_KEY && !GEMINI_API_KEY.startsWith("AQ.")) {
        const prompt = `You are a Principal Engineering Director and Master Bar Raiser conducting interviews.
Generate 4 targeted, realistic interview questions for a candidate with the following profile:
- Target Role: ${role}
- Interview Style: ${interviewType}
- Experience Level: ${experienceLevel}

Return ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "id": "q1",
      "question": "string",
      "category": "${interviewType}",
      "competencyTested": "string (e.g. Conflict Resolution, System Scalability, Mentorship)",
      "tips": "string (1-2 sentences on what a strong candidate covers)"
    }
  ]
}`;

        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.3,
                  responseMimeType: "application/json",
                },
              }),
            },
          );

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              const parsed = JSON.parse(text);
              if (parsed.questions && parsed.questions.length > 0) {
                return NextResponse.json({
                  questions: parsed.questions,
                  source: "ai",
                });
              }
            }
          }
        } catch (_err) {
          // Fall through to deterministic fallback
        }
      }

      // High-quality deterministic fallback tailored to role
      const questionsList =
        CURATED_QUESTIONS_FALLBACK[interviewType]?.general ||
        CURATED_QUESTIONS_FALLBACK.behavioral.general;

      const formattedQuestions = questionsList.slice(0, 4).map((q, idx) => ({
        id: `q${idx + 1}`,
        question: q,
        category: interviewType,
        competencyTested:
          idx === 0
            ? "Conflict Resolution & Stakeholder Alignment"
            : idx === 1
              ? "Problem Solving & Navigating Blockers"
              : idx === 2
                ? "Agility & Strategic Adaptation"
                : "Continuous Improvement & Feedback Reception",
        tips: `Frame your response using the STAR method: clarify the Situation and Task, detail your personal Actions, and quantify the measurable Result.`,
      }));

      return NextResponse.json({
        questions: formattedQuestions,
        source: "curated",
      });
    }

    // -------------------------------------------------------------
    // ACTION 2: Evaluate Candidate Response with STAR Diagnostics
    // -------------------------------------------------------------
    if (action === "evaluate-answer") {
      const {
        question,
        userAnswer,
        role = "Professional",
        interviewType = "behavioral",
      } = body;

      if (!question || !userAnswer || userAnswer.trim().length < 15) {
        return NextResponse.json(
          {
            error:
              "Please provide a complete answer with at least 15 characters to receive an evaluation.",
          },
          { status: 400 },
        );
      }

      // Optional token deduction for evaluation (5 tokens if user has balance)
      const INTERVIEW_TOKEN_COST = 5;
      const currentTokens = typeof user.tokens === "number" ? user.tokens : 50;
      if (currentTokens >= INTERVIEW_TOKEN_COST) {
        await deductUserTokens({
          userId: user.id,
          amount: INTERVIEW_TOKEN_COST,
          type: "job_application",
          description: `AI Mock Interview Diagnostics: ${question.slice(0, 30)}...`,
        });
      }

      // Try AI Evaluation
      if (GEMINI_API_KEY && !GEMINI_API_KEY.startsWith("AQ.")) {
        const prompt = `You are an Executive Hiring Manager and STAR-method interview coach.
Evaluate this candidate's interview response thoroughly and constructively:

Target Role: ${role}
Interview Category: ${interviewType}
Interview Question: "${question}"
Candidate Answer: "${userAnswer}"

Analyze the response according to the STAR methodology:
1. Situation: Was the context and environment clearly established?
2. Task: Was the candidate's specific responsibility defined?
3. Action: Were the concrete steps they personally took articulated?
4. Result: Did they quantify the outcome with measurable business metrics (%, $, time, scale)?

Return ONLY valid JSON adhering to this schema:
{
  "overallScore": number (0-100),
  "verdict": "Strong Hire" | "Hire" | "Leaning Hire" | "Needs Practice",
  "starBreakdown": {
    "situation": { "score": number (0-100), "feedback": "string" },
    "task": { "score": number (0-100), "feedback": "string" },
    "action": { "score": number (0-100), "feedback": "string" },
    "result": { "score": number (0-100), "feedback": "string" }
  },
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "modelAnswer": "string (A complete, master-class STAR response to this exact question in 3-4 sentences)",
  "pacingInsight": "string (estimated words, clarity, and conciseness note)"
}`;

        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.2,
                  responseMimeType: "application/json",
                },
              }),
            },
          );

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              const parsed = JSON.parse(text);
              return NextResponse.json({ evaluation: parsed, source: "ai" });
            }
          }
        } catch (_err) {
          // Fall through to heuristic evaluation
        }
      }

      // Intelligent Heuristic STAR Evaluator
      const wordCount = userAnswer.trim().split(/\s+/).length;
      const hasNumbers = /\d+|%|\$|increased|reduced|doubled/i.test(userAnswer);
      const hasActionVerbs =
        /created|designed|implemented|led|built|developed|resolved|coordinated|optimized/i.test(
          userAnswer,
        );
      const hasSituationContext =
        /when|at my|during|while|project|company|team/i.test(userAnswer);

      let overallScore = 65;
      if (wordCount >= 50) overallScore += 10;
      if (wordCount >= 100) overallScore += 5;
      if (hasNumbers) overallScore += 10;
      if (hasActionVerbs) overallScore += 5;
      if (hasSituationContext) overallScore += 5;
      overallScore = Math.min(95, Math.max(45, overallScore));

      const evaluation = {
        overallScore,
        verdict:
          overallScore >= 85
            ? "Strong Hire"
            : overallScore >= 75
              ? "Hire"
              : overallScore >= 60
                ? "Leaning Hire"
                : "Needs Practice",
        starBreakdown: {
          situation: {
            score: hasSituationContext ? 82 : 60,
            feedback: hasSituationContext
              ? "Good initial framing of the scenario and background context."
              : "Set the stage more clearly by mentioning the project stakes, company setting, and team dynamics.",
          },
          task: {
            score: wordCount > 40 ? 78 : 62,
            feedback:
              "Clearly delineate what you were specifically responsible for vs the broader team's scope.",
          },
          action: {
            score: hasActionVerbs ? 85 : 68,
            feedback: hasActionVerbs
              ? "Strong use of active verbs illustrating your personal ownership."
              : "Focus on first-person actions ('I analyzed', 'I designed') rather than passive team summaries ('we did').",
          },
          result: {
            score: hasNumbers ? 88 : 55,
            feedback: hasNumbers
              ? "Excellent inclusion of concrete metrics and quantifiable business impact."
              : "Add measurable outcomes (e.g. '% latency reduction', 'saved hours', or 'delivered on time') to anchor your impact.",
          },
        },
        strengths: [
          hasActionVerbs
            ? "Clear demonstration of individual initiative and technical ownership."
            : "Direct and straightforward communication style.",
          wordCount > 60
            ? "Thoughtful detail provided without excessive rambling."
            : "Concise summary that addresses the core premise.",
        ],
        improvements: [
          !hasNumbers
            ? "Anchor the ending with a concrete number (e.g., 'reduced turnaround time by 30%')."
            : "Provide slightly more depth on the specific technical or interpersonal trade-offs made.",
          "Briefly mention what you learned or how this experience influenced your current engineering practices.",
        ],
        modelAnswer: `At my previous organization, we experienced an unexpected 40% spike in traffic that caused API latency to degrade past our 200ms SLA. As the lead engineer on the service, I audited our slowest queries, identified missing compound indexes, and implemented a distributed Redis caching layer. Within 48 hours, p99 latency dropped by 65% and the application handled peak volume with zero downtime.`,
        pacingInsight: `Answer length: ${wordCount} words (optimal range: 90-180 words for a 60-90 second verbal delivery).`,
      };

      return NextResponse.json({ evaluation, source: "heuristic" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in mock interview API:", error);
    return NextResponse.json(
      {
        error:
          "Internal server error occurred while processing mock interview.",
      },
      { status: 500 },
    );
  }
}
