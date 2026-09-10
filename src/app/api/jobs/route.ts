import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { JobPosting } from "@/lib/models";
import {
  canManageSystemUsers,
  getSessionUser,
  unauthorizedResponse,
} from "@/lib/server-auth";
import { calculateJobTokenCost, jobPostingSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const workplaceType = searchParams.get("workplaceType");
    const employmentType = searchParams.get("employmentType");
    const experienceLevel = searchParams.get("experienceLevel");
    const sourcePlatform = searchParams.get("sourcePlatform");
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(
      1,
      Math.min(50, Number(searchParams.get("limit")) || 12),
    );
    const skip = (page - 1) * limit;

    // Filter query: only active jobs by default, or all if requested
    const query: Record<string, unknown> = {
      status: searchParams.get("status") || "active",
    };

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
        { requirements: searchRegex },
      ];
    }

    if (workplaceType && workplaceType !== "all") {
      query.workplaceType = workplaceType;
    }
    if (employmentType && employmentType !== "all") {
      query.employmentType = employmentType;
    }
    if (experienceLevel && experienceLevel !== "all") {
      query.experienceLevel = experienceLevel;
    }
    if (sourcePlatform && sourcePlatform !== "all") {
      query.sourcePlatform = sourcePlatform;
    }

    // Sort definition
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortBy === "tokens_asc") {
      sortObj = { tokenCost: 1, createdAt: -1 };
    } else if (sortBy === "tokens_desc") {
      sortObj = { tokenCost: -1, createdAt: -1 };
    } else if (sortBy === "popular") {
      sortObj = { viewsCount: -1, createdAt: -1 };
    }

    const [jobs, totalFiltered, totalActive, remoteCount] = await Promise.all([
      JobPosting.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      JobPosting.countDocuments(query),
      JobPosting.countDocuments({ status: "active" }),
      JobPosting.countDocuments({ status: "active", workplaceType: "remote" }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        total: totalFiltered,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(totalFiltered / limit)),
        hasNextPage: page < Math.ceil(totalFiltered / limit),
        hasPrevPage: page > 1,
      },
      stats: {
        totalActive,
        remoteCount,
      },
    });
  } catch (error) {
    console.error("Error listing job postings:", error);
    return NextResponse.json(
      { error: "Failed to fetch job postings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Check recruiter / employer / admin permissions
    const allowedRoles = ["admin", "super_admin", "recruiter", "employer"];
    const hasPermission =
      allowedRoles.includes(user.role) || canManageSystemUsers(user.role);

    if (!hasPermission) {
      return NextResponse.json(
        {
          error:
            "Permission denied. Only recruiters, employers, and administrators can post jobs.",
        },
        { status: 403 },
      );
    }

    await connectDB();

    const body = await request.json();

    // Auto calculate token cost based on requirements count
    const requirements = Array.isArray(body.requirements)
      ? body.requirements
      : [];
    const calculatedCost = calculateJobTokenCost(requirements);

    const validatedData = jobPostingSchema.parse({
      ...body,
      tokenCost:
        typeof body.tokenCost === "number" && body.tokenCost > 0
          ? body.tokenCost
          : calculatedCost,
      postedBy: user.id,
      posterRole: user.role,
      status: "active",
    });

    const job = new JobPosting(validatedData);
    await job.save();

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job posting:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to post job" },
      { status: 500 },
    );
  }
}
