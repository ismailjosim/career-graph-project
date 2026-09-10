import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { JobApplication, JobPosting, Resume } from "@/lib/models";
import {
  deductUserTokens,
  getSessionUser,
  unauthorizedResponse,
} from "@/lib/server-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    await connectDB();

    const job = await JobPosting.findById(id);
    if (!job) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 },
      );
    }

    if (job.status !== "active") {
      return NextResponse.json(
        { error: "This job posting is no longer accepting applications." },
        { status: 400 },
      );
    }

    // Check if user already applied
    const existingApp = await JobApplication.findOne({
      userId: user.id,
      $or: [
        { jobLink: `/jobs/${id}` },
        { jobTitle: job.title, company: job.company },
      ],
    });

    if (existingApp) {
      return NextResponse.json(
        {
          error:
            "You have already submitted an application for this job posting.",
          applicationId: String(existingApp._id),
        },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => ({}));
    let resumeId = body.resumeId;

    // If no resumeId supplied, look for user's default resume
    if (!resumeId) {
      const defaultResume = await Resume.findOne({
        userId: user.id,
        isDefault: true,
      })
        .sort({ uploadedAt: -1 })
        .lean();
      if (defaultResume) {
        resumeId = String(defaultResume._id);
      } else {
        const anyResume = await Resume.findOne({ userId: user.id })
          .sort({ uploadedAt: -1 })
          .lean();
        if (anyResume) {
          resumeId = String(anyResume._id);
        }
      }
    }

    if (!resumeId) {
      return NextResponse.json(
        { error: "Please select or upload a resume to apply." },
        { status: 400 },
      );
    }

    const tokenCost = typeof job.tokenCost === "number" ? job.tokenCost : 5;

    // Check balance and deduct tokens atomically
    const deductRes = await deductUserTokens({
      userId: user.id,
      amount: tokenCost,
      type: "job_application",
      description: `Applied to ${job.title} at ${job.company} (${tokenCost} tokens)`,
      metadata: {
        jobId: String(job._id),
        jobTitle: job.title,
        company: job.company,
        requirementsCount: job.requirements?.length || 0,
      },
    });

    if (!deductRes.success) {
      return NextResponse.json(
        {
          error:
            deductRes.error || "Insufficient tokens to submit application.",
          requiredTokens: tokenCost,
          currentTokens: user.tokens,
        },
        { status: 402 },
      );
    }

    // Create the JobApplication entry in user's job pipeline
    const application = new JobApplication({
      userId: user.id,
      jobTitle: job.title,
      company: job.company,
      description: job.description,
      jobLink: `/jobs/${job._id}`,
      resumeUsed: resumeId,
      coverLetterUsed: body.coverLetterId || undefined,
      location: job.location,
      salary: job.salary,
      employmentType: job.employmentType,
      notes:
        body.notes ||
        `Applied via Career Graph Job Portal (${job.sourcePlatform} listing)`,
      status: "applied",
      appliedAt: new Date(),
    });

    await application.save();

    // Increment applicants count
    await JobPosting.findByIdAndUpdate(job._id, {
      $inc: { applicantsCount: 1 },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Application submitted successfully! ${tokenCost} tokens deducted.`,
        application,
        newBalance: deductRes.newBalance,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error applying to job posting:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to apply to job",
      },
      { status: 500 },
    );
  }
}
