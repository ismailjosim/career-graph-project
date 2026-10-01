import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import { getSessionUser } from "@/lib/server-auth";
import { REVIEW_ROLES, REVIEW_STATUSES } from "@/lib/validation";

/**
 * GET /api/admin/reviews
 * Admin-only endpoint to view, search, and filter all reviews & feedback.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied. Admin authorization required.",
        },
        { status: 403 },
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const roleParam = searchParams.get("role") || "all";
    const statusParam = searchParams.get("status") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "15", 10)),
    );
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (
      roleParam !== "all" &&
      REVIEW_ROLES.includes(
        roleParam as unknown as (typeof REVIEW_ROLES)[number],
      )
    ) {
      filter.role = roleParam;
    }

    if (
      statusParam !== "all" &&
      REVIEW_STATUSES.includes(
        statusParam as unknown as (typeof REVIEW_STATUSES)[number],
      )
    ) {
      filter.status = statusParam;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { authorName: searchRegex },
        { content: searchRegex },
        { headline: searchRegex },
        { companyOrTarget: searchRegex },
        { verifiedOutcome: searchRegex },
      ];
    }

    const [
      reviews,
      filteredTotal,
      totalCount,
      pendingCount,
      approvedCount,
      rejectedCount,
      featuredCount,
      jobSeekerCount,
      recruiterCount,
      employerCount,
      ratingsAgg,
    ] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
      Review.countDocuments(),
      Review.countDocuments({ status: "pending" }),
      Review.countDocuments({ status: "approved" }),
      Review.countDocuments({ status: "rejected" }),
      Review.countDocuments({ status: "featured" }),
      Review.countDocuments({ role: "job_seeker" }),
      Review.countDocuments({ role: "recruiter" }),
      Review.countDocuments({ role: "employer" }),
      Review.aggregate([
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
          },
        },
      ]),
    ]);

    const averageRating =
      ratingsAgg.length > 0 && ratingsAgg[0].avgRating
        ? Number(ratingsAgg[0].avgRating.toFixed(1))
        : 5.0;

    return NextResponse.json({
      success: true,
      reviews,
      metrics: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        featured: featuredCount,
        averageRating,
        roleBreakdown: {
          job_seeker: jobSeekerCount,
          recruiter: recruiterCount,
          employer: employerCount,
        },
      },
      pagination: {
        total: filteredTotal,
        page,
        limit,
        totalPages: Math.ceil(filteredTotal / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Admin reviews fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin reviews" },
      { status: 500 },
    );
  }
}
