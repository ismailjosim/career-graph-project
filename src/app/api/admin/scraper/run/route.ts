import { type NextRequest, NextResponse } from "next/server";
import {
  type ScraperPlatform,
  startApifyScraperRun,
} from "@/lib/apify-scraper";
import { connectDB } from "@/lib/db";
import { requireAdminUser } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAdminUser();
    if ("response" in auth) {
      return auth.response;
    }
    const adminUser = auth.user;

    const body = await request.json();
    const {
      platform = "linkedin",
      targetRole,
      location = "Remote",
      jobCount = 50,
    } = body;

    if (!targetRole || typeof targetRole !== "string" || !targetRole.trim()) {
      return NextResponse.json(
        { error: "Target job role (e.g. 'Full Stack Developer') is required" },
        { status: 400 },
      );
    }

    const validPlatforms: ScraperPlatform[] = [
      "linkedin",
      "indeed",
      "google_jobs",
      "glassdoor",
      "all",
    ];

    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        {
          error: `Invalid platform. Must be one of: ${validPlatforms.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const count = Math.min(200, Math.max(5, Number(jobCount) || 50));

    const result = await startApifyScraperRun({
      platform,
      targetRole: targetRole.trim(),
      location: location.trim() || "Remote",
      jobCount: count,
      adminId: adminUser.id,
      adminEmail: adminUser.email,
    });

    return NextResponse.json({
      success: true,
      message: `Scraping job started on Apify for "${targetRole}" (${count} jobs on ${platform})`,
      runId: result.runId,
      apifyRunId: result.apifyRunId,
      actorId: result.actorId,
      platform,
      targetRole,
      location,
      targetCount: count,
    });
  } catch (error) {
    console.error("Error starting Apify scraper run:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to initiate Apify scraper run",
      },
      { status: 500 },
    );
  }
}
