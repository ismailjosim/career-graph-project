import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { JobApplication, JobPosting, Wishlist } from "@/lib/models";
import {
  canManageSystemUsers,
  getSessionUser,
  unauthorizedResponse,
} from "@/lib/server-auth";
import { calculateJobTokenCost, jobPostingSchema } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await connectDB();

    // Increment views atomically
    const job = await JobPosting.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true },
    ).lean();

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check user-specific states if authenticated
    let hasApplied = false;
    let existingApplicationId: string | null = null;
    let isWishlisted = false;

    const user = await getSessionUser();
    if (user?.id) {
      const [application, wishlistItem] = await Promise.all([
        JobApplication.findOne({
          userId: user.id,
          $or: [
            { jobLink: `/jobs/${id}` },
            { jobTitle: job.title, company: job.company },
          ],
        }).lean(),
        Wishlist.findOne({
          userId: user.id,
          $or: [
            { link: `/jobs/${id}` },
            { title: job.title, company: job.company },
          ],
        }).lean(),
      ]);

      if (application) {
        hasApplied = true;
        existingApplicationId = String(application._id);
      }
      if (wishlistItem) {
        isWishlisted = true;
      }
    }

    return NextResponse.json({
      job,
      hasApplied,
      existingApplicationId,
      isWishlisted,
    });
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json(
      { error: "Failed to fetch job details" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    await connectDB();
    const existingJob = await JobPosting.findById(id);
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Only job creator or admin can update
    const isOwner = existingJob.postedBy === user.id;
    const isAdmin = canManageSystemUsers(user.role);
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          error: "Permission denied. You can only edit your own job postings.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const requirements = Array.isArray(body.requirements)
      ? body.requirements
      : existingJob.requirements;
    const calculatedCost = calculateJobTokenCost(requirements);

    const validatedData = jobPostingSchema.partial().parse({
      ...body,
      tokenCost:
        typeof body.tokenCost === "number" && body.tokenCost > 0
          ? body.tokenCost
          : calculatedCost,
    });

    const updatedJob = await JobPosting.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true },
    );

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Error updating job posting:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update job",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    await connectDB();
    const existingJob = await JobPosting.findById(id);
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const isOwner = existingJob.postedBy === user.id;
    const isAdmin = canManageSystemUsers(user.role);
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          error:
            "Permission denied. You can only delete your own job postings.",
        },
        { status: 403 },
      );
    }

    await JobPosting.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job posting:", error);
    return NextResponse.json(
      { error: "Failed to delete job posting" },
      { status: 500 },
    );
  }
}
