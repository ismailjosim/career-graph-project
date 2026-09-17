import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AnalyticsEvent, JobPosting } from "@/lib/models";
import { getSessionUser } from "@/lib/server-auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await getSessionUser();

    const query = ObjectId.isValid(id)
      ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] }
      : { _id: id };

    const updatedJob = await JobPosting.findOneAndUpdate(
      query,
      { $inc: { externalClicksCount: 1 } },
      { new: true },
    );

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Log analytics telemetry event in background
    AnalyticsEvent.create({
      eventType: "external_job_click",
      userId: user?.id,
      resourceId: id,
      metadata: {
        company: updatedJob.company,
        title: updatedJob.title,
        sourcePlatform: updatedJob.sourcePlatform,
        targetUrl: updatedJob.originalJobUrl,
      },
    }).catch((err) =>
      console.warn("Failed to log click analytics event:", err),
    );

    return NextResponse.json({
      success: true,
      externalClicksCount: updatedJob.externalClicksCount || 1,
    });
  } catch (error) {
    console.error("Error tracking job click:", error);
    return NextResponse.json(
      { error: "Failed to record click" },
      { status: 500 },
    );
  }
}
