import { NextResponse } from "next/server";
import { syncDailyScrapedJobs } from "@/lib/daily-scraper";
import { generateUserDailyMatches } from "@/lib/job-match-engine";
import { JobMatchSuggestion, ScrapedJob } from "@/lib/models";
import { getSessionUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const now = new Date();

    // Ensure we have active, non-expired scraped jobs in the pool
    const activeCount = await ScrapedJob.countDocuments({
      isActive: true,
      $or: [
        { deadline: { $exists: false } },
        { deadline: null },
        { deadline: { $gte: now } },
      ],
    });
    if (activeCount === 0) {
      await syncDailyScrapedJobs();
    }

    // Check if non-expired matches for today already exist
    let matches: Array<Record<string, unknown>> = await JobMatchSuggestion.find(
      {
        userId: user.id,
        suggestedDate: todayStr,
        $or: [
          { deadline: { $exists: false } },
          { deadline: null },
          { deadline: { $gte: now } },
        ],
      },
    )
      .sort({ matchScore: -1 })
      .limit(15)
      .lean();

    // If none exist for today yet, generate top 10-15 matches
    if (!matches || matches.length === 0) {
      const generated = await generateUserDailyMatches(user.id);
      matches = (generated as unknown as Array<Record<string, unknown>>).filter(
        (m) => !m.deadline || new Date(m.deadline as string | Date) >= now,
      );
    }

    const targetRole = user.headline || "Full Stack Developer";

    return NextResponse.json({
      success: true,
      matches,
      totalCount: matches.length,
      targetRole,
      date: todayStr,
    });
  } catch (error) {
    console.error("Daily matches API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch matches",
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Force regenerate fresh 10-15 matches
    await syncDailyScrapedJobs();
    const matches = await generateUserDailyMatches(user.id);

    return NextResponse.json({
      success: true,
      message: `Generated ${matches.length} fresh curated job matches`,
      matches,
      totalCount: matches.length,
      date: new Date().toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Regenerate daily matches error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
      },
      { status: 500 },
    );
  }
}
