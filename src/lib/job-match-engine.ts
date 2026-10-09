import { connectDB } from "@/lib/db";
import { JobMatchSuggestion, Resume, ScrapedJob } from "@/lib/models";
import type { JobMatchSuggestion as IJobMatchSuggestion } from "@/lib/validation";

/**
 * Extracts skills from user's resume or builder data.
 */
function extractUserSkills(
  resumeDoc:
    | {
        builderData?: { skills?: { skills?: string[] }[] };
        name?: string;
        rawText?: string;
      }
    | null
    | undefined,
): string[] {
  const skillsSet = new Set<string>();

  if (resumeDoc?.builderData?.skills) {
    for (const group of resumeDoc.builderData.skills) {
      if (Array.isArray(group.skills)) {
        for (const s of group.skills) {
          if (typeof s === "string" && s.trim())
            skillsSet.add(s.trim().toLowerCase());
        }
      }
    }
  }

  // Also check rawText for common industry keywords if skills set is small
  const textToScan =
    `${resumeDoc?.name || ""} ${resumeDoc?.rawText || ""}`.toLowerCase();
  const commonTech = [
    "react",
    "next.js",
    "typescript",
    "javascript",
    "node.js",
    "python",
    "tailwind css",
    "mongodb",
    "postgresql",
    "docker",
    "aws",
    "git",
    "express",
    "rest apis",
    "ui/ux",
    "figma",
    "redux",
    "graphql",
    "sql",
  ];

  for (const tech of commonTech) {
    if (textToScan.includes(tech)) {
      skillsSet.add(tech);
    }
  }

  // Default baseline if resume is empty
  if (skillsSet.size === 0) {
    return ["react", "javascript", "typescript", "next.js", "node.js", "git"];
  }

  return Array.from(skillsSet);
}

/**
 * Generates and saves 10 to 15 top AI-matched jobs for a specific user based on their resume.
 */
export async function generateUserDailyMatches(
  userId: string,
): Promise<IJobMatchSuggestion[]> {
  await connectDB();

  // 1. Fetch user's default resume or latest uploaded resume
  const resume =
    (await Resume.findOne({ userId, isDefault: true }).lean()) ||
    (await Resume.findOne({ userId }).sort({ createdAt: -1 }).lean());

  const userSkills = extractUserSkills(resume);

  // 2. Fetch all active scraped jobs whose application deadline has not passed
  const now = new Date();
  const scrapedJobs = await ScrapedJob.find({
    isActive: true,
    $or: [
      { deadline: { $exists: false } },
      { deadline: null },
      { deadline: { $gte: now } },
    ],
  }).lean();

  if (!scrapedJobs || scrapedJobs.length === 0) {
    return [];
  }

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // 3. Pre-score and rank jobs by skill overlap
  const preScored = scrapedJobs.map((job) => {
    const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
    const matched: string[] = [];
    const missing: string[] = [];

    for (const js of jobSkills) {
      const isMatched = userSkills.some(
        (us) => us.includes(js) || js.includes(us),
      );
      if (isMatched) {
        matched.push(js);
      } else {
        missing.push(js);
      }
    }

    let score = 65;
    if (jobSkills.length > 0) {
      const matchRatio = matched.length / jobSkills.length;
      score = Math.round(60 + matchRatio * 38);
    } else {
      score = 75;
    }
    score = Math.min(98, Math.max(65, score));

    return {
      job,
      matched,
      missing,
      initialScore: score,
    };
  });

  // Sort by initial relevance and take top 15 candidate pool for evaluation
  preScored.sort((a, b) => b.initialScore - a.initialScore);
  const candidatePool = preScored.slice(0, 15);

  // 4. Lightweight AI Evaluation (Gemini Flash) if API key is present
  const geminiApiKey = process.env.GEMINI_API_KEY?.replace(
    /^["']|["']$/g,
    "",
  )?.trim();
  const aiEvaluations: Record<
    string,
    {
      score: number;
      reason: string;
      matchedSkills?: string[];
      missingSkills?: string[];
    }
  > = {};

  if (geminiApiKey) {
    try {
      const promptPayload = {
        candidate: {
          targetRole: resume?.name || "Software Engineer",
          skills: userSkills.slice(0, 15),
        },
        jobs: candidatePool.slice(0, 10).map((c) => ({
          id: String(c.job._id),
          title: c.job.title,
          company: c.job.company,
          skills: c.job.skills || [],
        })),
      };

      const systemPrompt = `You are a high-speed AI Job Matcher. Evaluate each job's fit (score 65 to 98) for the candidate. Return ONLY raw JSON array:
[{"id": "...", "score": 92, "reason": "1-2 sentence match explanation", "matchedSkills": ["..."], "missingSkills": ["..."]}]`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nDATA:\n${JSON.stringify(promptPayload)}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (response.ok) {
        const json = await response.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              if (item.id) {
                aiEvaluations[item.id] = {
                  score: Math.min(99, Math.max(60, Number(item.score) || 75)),
                  reason: item.reason || "Strong technical and profile match.",
                  matchedSkills: Array.isArray(item.matchedSkills)
                    ? item.matchedSkills
                    : undefined,
                  missingSkills: Array.isArray(item.missingSkills)
                    ? item.missingSkills
                    : undefined,
                };
              }
            }
          }
        }
      }
    } catch (aiErr) {
      console.warn(
        "[AI Match Engine] Lightweight Gemini evaluation skipped, using weighted heuristic:",
        aiErr,
      );
    }
  }

  // 5. Build final scored list combining AI insights with heuristics
  const topMatches = candidatePool.map((item) => {
    const jobIdStr = String(item.job._id);
    const aiInsight = aiEvaluations[jobIdStr];

    const matchScore = aiInsight?.score || item.initialScore;
    const matchReason =
      aiInsight?.reason ||
      (item.matched.length > 0
        ? `Strong skill alignment in ${item.matched.slice(0, 3).join(", ")}. Matches your target profile.`
        : "Matches your general technology stack and remote role preferences.");

    const matchedSkills =
      aiInsight?.matchedSkills && aiInsight.matchedSkills.length > 0
        ? aiInsight.matchedSkills
        : item.matched.length > 0
          ? item.matched
          : ["JavaScript", "Web Tech"];

    const missingSkills =
      aiInsight?.missingSkills && aiInsight.missingSkills.length > 0
        ? aiInsight.missingSkills
        : item.missing;

    return {
      userId,
      jobId: jobIdStr,
      jobTitle: item.job.title,
      company: item.job.company,
      location: item.job.location,
      salary: item.job.salary || "Competitive",
      applyUrl: item.job.applyUrl,
      source: item.job.source || "LinkedIn",
      deadline: item.job.deadline,
      matchScore,
      matchedSkills,
      missingSkills,
      matchReason,
      status: "new" as const,
      suggestedDate: todayStr,
    };
  });

  // Sort by highest final score
  topMatches.sort((a, b) => b.matchScore - a.matchScore);

  // 6. Save / Upsert into JobMatchSuggestion
  const savedSuggestions: IJobMatchSuggestion[] = [];
  for (const match of topMatches) {
    const doc = await JobMatchSuggestion.findOneAndUpdate(
      { userId, jobId: match.jobId },
      { $set: match },
      { upsert: true, new: true },
    ).lean();
    if (doc) {
      savedSuggestions.push(doc as unknown as IJobMatchSuggestion);
    }
  }

  return savedSuggestions;
}

/**
 * Runs batch matching across all active job seekers in the system.
 * Triggered automatically after an Apify scraping run completes.
 */
export async function runBatchMatchingForAllUsers(): Promise<{
  matchedUsersCount: number;
  totalMatchesSaved: number;
  date: string;
}> {
  const mongoose = await connectDB();
  const db = mongoose.connection.db;
  if (!db)
    return {
      matchedUsersCount: 0,
      totalMatchesSaved: 0,
      date: new Date().toISOString(),
    };

  const userCollection = db.collection<Record<string, unknown>>("user");
  const candidates = await userCollection
    .find({
      status: { $ne: "blocked" },
    })
    .toArray();

  let totalMatches = 0;
  let matchedUsers = 0;

  for (const candidate of candidates) {
    const userId = String(candidate._id || candidate.id);
    try {
      const suggestions = await generateUserDailyMatches(userId);
      if (suggestions.length > 0) {
        totalMatches += suggestions.length;
        matchedUsers++;
      }
    } catch (err) {
      console.warn(`Failed matching for candidate ${userId}:`, err);
    }
  }

  return {
    matchedUsersCount: matchedUsers,
    totalMatchesSaved: totalMatches,
    date: new Date().toISOString().split("T")[0],
  };
}
