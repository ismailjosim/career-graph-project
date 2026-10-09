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

  // If the user has not uploaded any resume yet, do not generate fake matches
  if (!resume) {
    return [];
  }

  // 2. Fetch user profile from database to get candidate's targetRole (headline) & skills
  const mongoose = await connectDB();
  const db = mongoose.connection.db;
  let userHeadline = "";
  let userProfileSkills: string[] = [];

  if (db) {
    try {
      const { ObjectId } = await import("mongodb");
      let query: Record<string, unknown> = { id: userId };
      try {
        query = {
          $or: [{ _id: new ObjectId(userId) }, { _id: userId }, { id: userId }],
        };
      } catch {
        query = { $or: [{ _id: userId }, { id: userId }] };
      }
      const userDoc = await db.collection("user").findOne(query);
      if (userDoc) {
        if (typeof userDoc.headline === "string" && userDoc.headline.trim()) {
          userHeadline = userDoc.headline.trim();
        }
        if (Array.isArray(userDoc.skills)) {
          userProfileSkills = userDoc.skills
            .map((s) => String(s).trim().toLowerCase())
            .filter(Boolean);
        } else if (typeof userDoc.skills === "string") {
          userProfileSkills = userDoc.skills
            .split(",")
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);
        }
      }
    } catch (profileErr) {
      console.warn(
        "Could not retrieve user document for match scoring:",
        profileErr,
      );
    }
  }

  const targetRole = userHeadline || resume.name || "Software Engineer";
  const userSkills = Array.from(
    new Set([...extractUserSkills(resume), ...userProfileSkills]),
  );

  // 3. Fetch all active scraped jobs whose application deadline has not passed
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

  // 4. Pre-score and rank jobs by role title alignment & skill overlap
  const roleKeywords: string[] = targetRole
    .toLowerCase()
    .split(/[\s,/-]+/)
    .filter(
      (w: string) => w.length > 2 && !["and", "for", "the", "with"].includes(w),
    );

  const preScored = scrapedJobs.map((job) => {
    const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
    const jobTitleLower = (job.title || "").toLowerCase();
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

    // Role alignment score (up to 30 points)
    let roleScore = 0;
    if (roleKeywords.length > 0) {
      const matchedRoleWords = roleKeywords.filter((kw: string) =>
        jobTitleLower.includes(kw),
      );
      const roleRatio = matchedRoleWords.length / roleKeywords.length;
      roleScore = Math.round(roleRatio * 30);
    }

    // Skill overlap score (up to 45 points)
    let skillScore = 20;
    if (jobSkills.length > 0) {
      const matchRatio = matched.length / jobSkills.length;
      skillScore = Math.round(matchRatio * 45);
    }

    let score = Math.round(35 + roleScore + skillScore);
    score = Math.min(98, Math.max(65, score));

    return {
      job,
      matched,
      missing,
      initialScore: score,
    };
  });

  // 4.1 Check user plan status to determine max matches (VIP/Annual up to 20, Pro 15, Starter 12, Preview 7)
  const { getUserDailyAiMatchesStatus } = await import("@/lib/plan-limits");
  const planStatus = await getUserDailyAiMatchesStatus(userId);
  const maxToReturn = planStatus.matchesMax || 15;

  // Sort by initial relevance and take top candidate pool for evaluation
  preScored.sort((a, b) => b.initialScore - a.initialScore);
  const candidatePool = preScored.slice(0, Math.max(20, maxToReturn));

  // 5. Lightweight AI Evaluation (Gemini Flash) if API key is present
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
          targetRole,
          skills: userSkills.slice(0, 20),
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

  // 6. Build final scored list combining AI insights with heuristics
  const topMatches = candidatePool.map((item) => {
    const jobIdStr = String(item.job._id);
    const aiInsight = aiEvaluations[jobIdStr];

    const matchScore = aiInsight?.score || item.initialScore;
    const matchReason =
      aiInsight?.reason ||
      (item.matched.length > 0
        ? `Strong skill alignment in ${item.matched.slice(0, 3).join(", ")}. Matches your target profile as ${targetRole}.`
        : `Matches your target role as ${targetRole} and remote preferences.`);

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

  // Sort by highest final score and cap at user plan's max allocation
  topMatches.sort((a, b) => b.matchScore - a.matchScore);
  const finalMatches = topMatches.slice(0, maxToReturn);

  // 7. Save / Upsert into JobMatchSuggestion
  const savedSuggestions: IJobMatchSuggestion[] = [];
  for (const match of finalMatches) {
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
 * ONLY matches candidates who have an uploaded resume AND have purchased
 * the Daily AI Matches plan (Pro/Paid package or Admin). Excludes all others.
 * VIP Priority members (Ultra & Annual Pass) are prioritized at the top of the queue.
 */
export async function runBatchMatchingForAllUsers(): Promise<{
  matchedUsersCount: number;
  totalMatchesSaved: number;
  excludedUsersCount: number;
  date: string;
}> {
  const mongoose = await connectDB();
  const db = mongoose.connection.db;
  if (!db)
    return {
      matchedUsersCount: 0,
      totalMatchesSaved: 0,
      excludedUsersCount: 0,
      date: new Date().toISOString(),
    };

  const { getUserDailyAiMatchesStatus } = await import("@/lib/plan-limits");
  const userCollection = db.collection<Record<string, unknown>>("user");
  const candidates = await userCollection
    .find({
      status: { $ne: "blocked" },
    })
    .toArray();

  let totalMatches = 0;
  let matchedUsers = 0;
  let excludedUsers = 0;

  // Filter candidates by eligibility (resume uploaded + active plan)
  const eligibleCandidates: Array<{
    userId: string;
    isVip: boolean;
    tier: string;
  }> = [];

  for (const candidate of candidates) {
    const userId = String(candidate._id || candidate.id);
    try {
      // 1. Check if candidate has at least 1 resume uploaded
      const resumeCount = await Resume.countDocuments({ userId });
      if (resumeCount === 0) {
        excludedUsers++;
        continue;
      }

      // 2. Check if candidate has active Daily AI Matches plan
      const planStatus = await getUserDailyAiMatchesStatus(
        userId,
        candidate.role as string | undefined,
      );
      if (!planStatus.hasActivePlan) {
        // Exclude users who have not purchased or whose plan has expired
        excludedUsers++;
        continue;
      }

      eligibleCandidates.push({
        userId,
        isVip: planStatus.isVip,
        tier: planStatus.tier,
      });
    } catch (err) {
      console.warn(`Eligibility check failed for candidate ${userId}:`, err);
      excludedUsers++;
    }
  }

  // VIP & Annual Pass holders get prioritized at the top of the scraper queue
  eligibleCandidates.sort((a, b) => {
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;
    return 0;
  });

  // Run matching for all eligible candidates in priority order
  for (const candidate of eligibleCandidates) {
    try {
      const suggestions = await generateUserDailyMatches(candidate.userId);
      if (suggestions.length > 0) {
        totalMatches += suggestions.length;
        matchedUsers++;
      }
    } catch (err) {
      console.warn(`Failed matching for candidate ${candidate.userId}:`, err);
    }
  }

  console.log(
    `[Scraping Batch Engine] Finished: ${matchedUsers} enrolled users matched (${totalMatches} saved, VIPs prioritized), ${excludedUsers} excluded (no active plan or no resume).`,
  );

  return {
    matchedUsersCount: matchedUsers,
    totalMatchesSaved: totalMatches,
    excludedUsersCount: excludedUsers,
    date: new Date().toISOString().split("T")[0],
  };
}
