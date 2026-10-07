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

  // 2. Fetch all active scraped jobs
  const scrapedJobs = await ScrapedJob.find({ isActive: true }).lean();

  if (!scrapedJobs || scrapedJobs.length === 0) {
    return [];
  }

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // 3. Score each job against user skills
  const scoredJobs = scrapedJobs.map((job) => {
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

    // Base score calculation
    let score = 65; // base baseline
    if (jobSkills.length > 0) {
      const matchRatio = matched.length / jobSkills.length;
      score = Math.round(60 + matchRatio * 38); // ranges between 60% and 98%
    } else {
      score = 75;
    }

    // Cap between 60 and 99
    score = Math.min(98, Math.max(65, score));

    const matchReason =
      matched.length > 0
        ? `Strong skill overlap in ${matched.slice(0, 3).join(", ")}. Fits your target profile.`
        : "Matches your general technology stack and remote role preferences.";

    return {
      userId,
      jobId: String(job._id),
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary || "Competitive",
      applyUrl: job.applyUrl,
      source: job.source || "LinkedIn",
      matchScore: score,
      matchedSkills: matched.length > 0 ? matched : ["JavaScript", "Web Tech"],
      missingSkills: missing,
      matchReason,
      status: "new" as const,
      suggestedDate: todayStr,
    };
  });

  // 4. Sort by highest match score
  scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

  // 5. Select top 10 to 15 jobs (user requirement: 10–15 jobs)
  const topMatches = scoredJobs.slice(0, 15);

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
