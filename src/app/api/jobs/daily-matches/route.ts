import { NextResponse } from "next/server";
import { syncDailyScrapedJobs } from "@/lib/daily-scraper";
import { generateUserDailyMatches } from "@/lib/job-match-engine";
import { JobMatchSuggestion, Resume, ScrapedJob } from "@/lib/models";
import { getUserDailyAiMatchesStatus } from "@/lib/plan-limits";
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

    const planStatus = await getUserDailyAiMatchesStatus(user.id, user.role);

    // 1. Check if user has an uploaded or created resume
    const userResume =
      (await Resume.findOne({ userId: user.id, isDefault: true }).lean()) ||
      (await Resume.findOne({ userId: user.id })
        .sort({ createdAt: -1 })
        .lean());

    if (!userResume) {
      // User has no resume in their account yet.
      // Purge any stale suggestions generated from previous fake defaults
      await JobMatchSuggestion.deleteMany({ userId: user.id });

      return NextResponse.json({
        success: true,
        hasResume: false,
        hasDailyAiMatchesPlan: planStatus.hasActivePlan,
        isExpired: planStatus.isExpired,
        daysRemaining: planStatus.daysRemaining,
        matches: [],
        totalCount: 0,
        targetRole: user.headline || "Job Seeker",
        date: todayStr,
      });
    }

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

    // If none exist for today yet, generate matches
    if (!matches || matches.length === 0) {
      const generated = await generateUserDailyMatches(user.id);
      matches = (generated as unknown as Array<Record<string, unknown>>).filter(
        (m) => !m.deadline || new Date(m.deadline as string | Date) >= now,
      );
    }

    // Free / Expired users get strictly 5-7 one-time preview matches.
    // Active users get matches up to their plan quota (12, 15, or 20 for VIP)
    const displayedMatches = planStatus.hasActivePlan
      ? matches.slice(0, planStatus.matchesMax)
      : matches.slice(0, 7);

    const targetRole = user.headline || "Full Stack Developer";

    return NextResponse.json({
      success: true,
      hasResume: true,
      hasDailyAiMatchesPlan: planStatus.hasActivePlan,
      isExpired: planStatus.isExpired,
      daysRemaining: planStatus.daysRemaining,
      isVip: planStatus.isVip,
      tier: planStatus.tier,
      matches: displayedMatches,
      totalCount: displayedMatches.length,
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

    // 1. Check if user has an uploaded or created resume
    const userResume =
      (await Resume.findOne({ userId: user.id, isDefault: true }).lean()) ||
      (await Resume.findOne({ userId: user.id })
        .sort({ createdAt: -1 })
        .lean());

    if (!userResume) {
      await JobMatchSuggestion.deleteMany({ userId: user.id });
      return NextResponse.json({
        success: true,
        hasResume: false,
        hasDailyAiMatchesPlan: false,
        isExpired: false,
        message:
          "Please upload your resume to generate personalized job matches.",
        matches: [],
        totalCount: 0,
        date: new Date().toISOString().split("T")[0],
      });
    }

    // 2. Check Daily AI Matches plan entitlement (Active 30-day window)
    const planStatus = await getUserDailyAiMatchesStatus(user.id, user.role);
    if (!planStatus.hasActivePlan) {
      return NextResponse.json(
        {
          success: false,
          code: "PLAN_REQUIRED",
          hasDailyAiMatchesPlan: false,
          isExpired: planStatus.isExpired,
          message: planStatus.isExpired
            ? "Your 30-day Daily AI Matches access has expired. Please renew your package to resume receiving fresh scraped jobs daily."
            : "Automated scraping match re-generation is reserved for Daily AI Matches plan members. Upgrade to unlock 30 days of automated daily delivery.",
        },
        { status: 403 },
      );
    }

    // Force regenerate fresh 10-15 matches
    await syncDailyScrapedJobs();
    const matches = await generateUserDailyMatches(user.id);

    return NextResponse.json({
      success: true,
      hasDailyAiMatchesPlan: true,
      isExpired: false,
      daysRemaining: planStatus.daysRemaining,
      isVip: planStatus.isVip,
      tier: planStatus.tier,
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
