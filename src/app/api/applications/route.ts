import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { JobApplication } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";
import { jobApplicationSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    const userId = user.id;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const employmentType = searchParams.get("employmentType");
    const sortBy = searchParams.get("sortBy") || "appliedAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const query: Record<string, unknown> = { userId };
    if (search?.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query.$or = [
        { jobTitle: searchRegex },
        { company: searchRegex },
        { location: searchRegex },
        { notes: searchRegex },
      ];
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (employmentType && employmentType !== "all") {
      query.employmentType = employmentType;
    }

    if (pageParam) {
      const page = Math.max(1, Number(pageParam) || 1);
      const limit = Math.max(1, Math.min(100, Number(limitParam) || 10));
      const skip = (page - 1) * limit;

      const [applications, totalFiltered, totalAll] = await Promise.all([
        JobApplication.find(query)
          .sort({ [sortBy]: sortOrder })
          .skip(skip)
          .limit(limit)
          .lean(),
        JobApplication.countDocuments(query),
        JobApplication.countDocuments({ userId }),
      ]);

      return NextResponse.json({
        applications,
        pagination: {
          total: totalFiltered,
          totalAll,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(totalFiltered / limit)),
          hasNextPage: page < Math.ceil(totalFiltered / limit),
          hasPrevPage: page > 1,
        },
      });
    }

    const applications = await JobApplication.find(query).sort({
      [sortBy]: sortOrder,
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
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
    const userId = user.id;

    await connectDB();

    const body = await request.json();
    const validatedData = jobApplicationSchema.parse({
      ...body,
      userId,
    });

    const application = new JobApplication(validatedData);
    await application.save();

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 },
    );
  }
}
