import { NextResponse } from "next/server";
import { syncDailyScrapedJobs } from "@/lib/daily-scraper";

export const dynamic = "force-dynamic";

/**
 * Daily Cron Endpoint to scrape and sync jobs online.
 * Can be scheduled with Vercel Cron, GitHub Actions, or local scheduler.
 */
export async function GET() {
  try {
    const result = await syncDailyScrapedJobs();
    return NextResponse.json({
      success: true,
      message: `Daily job sync completed. Total active scraped jobs: ${result.totalSynced}`,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Daily job sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Sync failed",
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  return GET();
}
