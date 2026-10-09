import { connectDB } from "@/lib/db";
import { JobMatchSuggestion, ScrapedJob } from "@/lib/models";

export interface RawScrapedJob {
  externalId: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  source: string;
  applyUrl: string;
  deadline: Date;
}

/**
 * Fetches real-world active tech jobs from public remote feeds (e.g. RemoteOK API)
 * Discards any jobs whose application deadline has already expired.
 */
async function fetchLiveRemoteJobs(): Promise<RawScrapedJob[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch("https://remoteok.com/api", {
      headers: {
        "User-Agent":
          "CareerGraph-JobMatcher/1.0 (https://careergraph.ismailjosim.com)",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(
        `[Daily Scraper] RemoteOK API responded with status ${res.status}`,
      );
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    // First item is legal metadata; subsequent items are real live postings
    const jobs = data.slice(1, 35);
    const results: RawScrapedJob[] = [];
    const now = Date.now();

    for (const j of jobs) {
      if (j?.id && j.position && j.company) {
        // Calculate application deadline (typically 21-30 days from posted date)
        let deadline: Date;
        if (j.date) {
          const postedDate = new Date(j.date);
          deadline = new Date(postedDate.getTime() + 21 * 24 * 60 * 60 * 1000);
        } else if (j.epoch) {
          deadline = new Date(
            Number(j.epoch) * 1000 + 21 * 24 * 60 * 60 * 1000,
          );
        } else {
          deadline = new Date(now + 18 * 24 * 60 * 60 * 1000);
        }

        // If the application deadline has already passed, DO NOT ingest or show it
        if (deadline.getTime() <= now) {
          continue;
        }

        const rawTags: string[] = Array.isArray(j.tags) ? j.tags : [];
        results.push({
          externalId: `live-rok-${j.id}`,
          title: String(j.position),
          company: String(j.company),
          location: j.location || "Remote (Worldwide)",
          jobType: "full-time",
          salary: j.salary || "Competitive Market Rate",
          description:
            typeof j.description === "string"
              ? j.description.slice(0, 1000)
              : "",
          requirements: rawTags.slice(0, 5),
          skills: rawTags.slice(0, 8),
          source: "RemoteOK",
          applyUrl: j.url || j.apply_url || "https://remoteok.com",
          deadline,
        });
      }
    }
    return results;
  } catch (err) {
    console.warn("[Daily Scraper] Live feed fetch failed:", err);
    return [];
  }
}

/**
 * Syncs the latest live scraped jobs into the database.
 * Deduplicates by externalId.
 * Automatically deactivates and purges any jobs whose deadline has passed.
 */
export async function syncDailyScrapedJobs(): Promise<{
  totalSynced: number;
  newAdded: number;
  liveFetched: number;
}> {
  await connectDB();

  // 1. Auto-deactivate expired jobs from the database pool
  const now = new Date();
  await ScrapedJob.updateMany(
    { deadline: { $lt: now }, isActive: true },
    { $set: { isActive: false } },
  );

  // 2. Remove match suggestions whose deadline has passed
  await JobMatchSuggestion.deleteMany({
    deadline: { $lt: now },
  });

  let newAdded = 0;
  const liveJobs = await fetchLiveRemoteJobs();

  if (liveJobs.length === 0) {
    console.warn("[Daily Scraper] No live jobs returned during sync run.");
    const existingActive = await ScrapedJob.countDocuments({
      isActive: true,
      $or: [
        { deadline: { $exists: false } },
        { deadline: null },
        { deadline: { $gte: now } },
      ],
    });
    return { totalSynced: existingActive, newAdded: 0, liveFetched: 0 };
  }

  for (const job of liveJobs) {
    const existing = await ScrapedJob.findOne({ externalId: job.externalId });
    if (!existing) {
      await ScrapedJob.create({
        ...job,
        scrapedAt: new Date(),
        isActive: true,
      });
      newAdded++;
    } else {
      // Refresh scraped timestamp, deadline, & active status
      await ScrapedJob.updateOne(
        { externalId: job.externalId },
        {
          $set: {
            isActive: true,
            scrapedAt: new Date(),
            deadline: job.deadline,
          },
        },
      );
    }
  }

  const totalSynced = await ScrapedJob.countDocuments({
    isActive: true,
    $or: [
      { deadline: { $exists: false } },
      { deadline: null },
      { deadline: { $gte: now } },
    ],
  });

  return { totalSynced, newAdded, liveFetched: liveJobs.length };
}
