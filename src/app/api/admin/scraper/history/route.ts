import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ScrapedJob, ScraperRun } from "@/lib/models";
import { requireAdminUser } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminUser();
    if ("response" in auth) {
      return auth.response;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      50,
      Math.max(5, Number(searchParams.get("limit")) || 15),
    );
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const skip = (page - 1) * limit;

    const [runs, totalRuns, totalJobsInDb] = await Promise.all([
      ScraperRun.find().sort({ startedAt: -1 }).skip(skip).limit(limit).lean(),
      ScraperRun.countDocuments(),
      ScrapedJob.countDocuments(),
    ]);

    // Compute stats
    const stats = await ScraperRun.aggregate([
      {
        $group: {
          _id: null,
          totalScrapedJobs: { $sum: "$scrapedCount" },
          totalNewJobs: { $sum: "$newJobsCount" },
          completedRuns: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          failedRuns: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
        },
      },
    ]);

    const aggregateStats = stats[0] || {
      totalScrapedJobs: 0,
      totalNewJobs: 0,
      completedRuns: 0,
      failedRuns: 0,
    };

    return NextResponse.json({
      success: true,
      runs,
      pagination: {
        page,
        limit,
        total: totalRuns,
        totalPages: Math.ceil(totalRuns / limit),
      },
      stats: {
        totalRuns,
        totalJobsInDb,
        ...aggregateStats,
      },
    });
  } catch (error) {
    console.error("Error fetching scraper history:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch scraper history",
      },
      { status: 500 },
    );
  }
}
