import { type NextRequest, NextResponse } from "next/server";
import { getApifyClient, ingestApifyDatasetItems } from "@/lib/apify-scraper";
import { connectDB } from "@/lib/db";
import { runBatchMatchingForAllUsers } from "@/lib/job-match-engine";
import { ScrapedJob, ScraperRun } from "@/lib/models";
import { requireAdminUser } from "@/lib/server-auth";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ runId: string }> },
) {
  try {
    const auth = await requireAdminUser();
    if ("response" in auth) {
      return auth.response;
    }

    const { runId } = await context.params;
    if (!runId) {
      return NextResponse.json(
        { error: "Missing runId parameter" },
        { status: 400 },
      );
    }

    await connectDB();
    const scraperRun = await ScraperRun.findById(runId);
    if (!scraperRun) {
      return NextResponse.json(
        { error: "Scraper run not found" },
        { status: 404 },
      );
    }

    // If already finished, return cached state with sample jobs
    if (scraperRun.status === "completed" || scraperRun.status === "failed") {
      const sampleJobs = await ScrapedJob.find({
        source: { $regex: new RegExp(scraperRun.platform, "i") },
      })
        .sort({ scrapedAt: -1 })
        .limit(10);

      return NextResponse.json({
        success: true,
        run: scraperRun,
        sampleJobs,
      });
    }

    // Check live status on Apify
    if (scraperRun.apifyRunId) {
      try {
        const client = getApifyClient();
        const apifyRun = await client.run(scraperRun.apifyRunId).get();

        if (apifyRun) {
          const apifyStatus = apifyRun.status; // READY, RUNNING, SUCCEEDED, FAILED, TIMED-OUT, ABORTED

          if (apifyStatus === "SUCCEEDED") {
            const datasetId =
              apifyRun.defaultDatasetId || scraperRun.apifyDatasetId;
            let ingested = {
              totalScraped: 0,
              newJobsCount: 0,
              duplicateCount: 0,
              sampleJobs: [] as unknown[],
            };

            if (datasetId) {
              ingested = await ingestApifyDatasetItems(
                runId,
                datasetId,
                scraperRun.platform,
              );
            }

            const finishedAt = new Date();
            const durationSeconds = Math.round(
              (finishedAt.getTime() - scraperRun.startedAt.getTime()) / 1000,
            );

            scraperRun.status = "completed";
            scraperRun.scrapedCount = ingested.totalScraped;
            scraperRun.newJobsCount = ingested.newJobsCount;
            scraperRun.duplicateCount = ingested.duplicateCount;
            scraperRun.finishedAt = finishedAt;
            scraperRun.durationSeconds = durationSeconds;
            await scraperRun.save();

            // Auto-trigger candidate AI matching for all active job seekers
            runBatchMatchingForAllUsers().catch((matchErr) => {
              console.warn(
                "[Scraper Status] Batch matching background error:",
                matchErr,
              );
            });

            return NextResponse.json({
              success: true,
              run: scraperRun,
              sampleJobs: ingested.sampleJobs,
            });
          }

          if (
            apifyStatus === "FAILED" ||
            apifyStatus === "TIMED-OUT" ||
            apifyStatus === "ABORTED"
          ) {
            scraperRun.status = "failed";
            scraperRun.error = `Apify Actor run exited with status: ${apifyStatus}`;
            scraperRun.finishedAt = new Date();
            await scraperRun.save();

            return NextResponse.json({
              success: true,
              run: scraperRun,
            });
          }
        }
      } catch (apifyErr) {
        console.warn("[Scraper Status] Error querying Apify run:", apifyErr);
      }
    }

    // Still running
    const currentDuration = Math.round(
      (Date.now() - scraperRun.startedAt.getTime()) / 1000,
    );

    return NextResponse.json({
      success: true,
      run: {
        ...scraperRun.toObject(),
        durationSeconds: currentDuration,
      },
    });
  } catch (error) {
    console.error("Error checking scraper status:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve scraper run status",
      },
      { status: 500 },
    );
  }
}
