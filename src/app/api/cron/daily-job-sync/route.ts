import { type NextRequest, NextResponse } from "next/server";
import { syncDailyScrapedJobs } from "@/lib/daily-scraper";
import { runBatchMatchingForAllUsers } from "@/lib/job-match-engine";

export const dynamic = "force-dynamic";

/**
 * 24-Hour Central Automated Cron Endpoint
 * 1. Synchronizes latest central scraped jobs (fixed platform cost)
 * 2. Runs AI matching to compute top 10-15 curated jobs for all active job seekers
 */
export async function GET(req?: NextRequest) {
  try {
    // Optional CRON_SECRET authorization check for external invocation
    const authHeader = req?.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Vercel Cron automatically supplies CRON_SECRET or specific header
      const vercelCronHeader = req?.headers.get("x-vercel-cron");
      if (!vercelCronHeader) {
        console.warn("[Cron] Unauthorized cron invocation attempt");
      }
    }

    // Step 1: Central daily scraping & deduplication
    const scraperResult = await syncDailyScrapedJobs();

    // Step 2: Batch AI matching for active candidates
    const matchResult = await runBatchMatchingForAllUsers();

    return NextResponse.json({
      success: true,
      message: `24h daily job sync & candidate matching cycle completed.`,
      scraper: scraperResult,
      matching: matchResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Daily 24h cron job sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Sync failed",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
