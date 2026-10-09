import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import { getSessionUser } from "@/lib/server-auth";
import {
  REVIEW_ROLES,
  type ReviewRole,
  submitReviewSchema,
} from "@/lib/validation";

/**
 * GET /api/reviews
 * Public endpoint to fetch reviews with role filtering, star rating filtering,
 * keyword searching, sorting, and summary metrics directly from verified DB records.
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const roleParam = searchParams.get("role");
    const ratingParam = searchParams.get("rating");
    const searchParam = searchParams.get("search")?.trim().toLowerCase();
    const sortParam = searchParams.get("sort") || "featured";
    const limitParam = parseInt(searchParams.get("limit") || "50", 10);
    const limit = Math.min(Math.max(limitParam, 1), 100);

    const query: Record<string, unknown> = {
      status: { $in: ["approved", "featured"] },
    };

    if (
      roleParam &&
      roleParam !== "all" &&
      REVIEW_ROLES.includes(roleParam as ReviewRole)
    ) {
      query.role = roleParam;
    }

    if (ratingParam && ratingParam !== "all") {
      const parsedRating = parseInt(ratingParam, 10);
      if (
        !Number.isNaN(parsedRating) &&
        parsedRating >= 1 &&
        parsedRating <= 5
      ) {
        query.rating = parsedRating;
      }
    }

    if (searchParam) {
      const searchRegex = new RegExp(searchParam, "i");
      query.$or = [
        { authorName: searchRegex },
        { content: searchRegex },
        { headline: searchRegex },
        { companyOrTarget: searchRegex },
        { verifiedOutcome: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Determine sort object
    let sortObj: Record<string, 1 | -1> = { status: -1, createdAt: -1 };
    if (sortParam === "highest") {
      sortObj = { rating: -1, createdAt: -1 };
    } else if (sortParam === "recent") {
      sortObj = { createdAt: -1 };
    }

    // Fetch database reviews
    const dbReviews = await Review.find(query)
      .sort(sortObj)
      .limit(limit)
      .lean();

    // Calculate database counts by role & ratings
    const allDbReviews = await Review.find({
      status: { $in: ["approved", "featured"] },
    })
      .select("rating role")
      .lean();

    // Aggregate rating breakdown from authentic records
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let ratingSum = 0;

    for (const r of allDbReviews) {
      const rNum = (r.rating || 5) as 1 | 2 | 3 | 4 | 5;
      if (ratingCounts[rNum] !== undefined) {
        ratingCounts[rNum]++;
      }
      ratingSum += rNum;
    }

    const avgRating =
      allDbReviews.length > 0
        ? Number((ratingSum / allDbReviews.length).toFixed(1))
        : 0;

    const roleCounts = {
      all: allDbReviews.length,
      job_seeker: allDbReviews.filter((r) => r.role === "job_seeker").length,
      recruiter: allDbReviews.filter((r) => r.role === "recruiter").length,
      employer: allDbReviews.filter((r) => r.role === "employer").length,
    };

    return NextResponse.json({
      success: true,
      reviews: dbReviews,
      stats: {
        totalReviews: roleCounts.all,
        averageRating: avgRating,
        roleCounts,
        ratingCounts,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
        reviews: [],
        stats: {
          totalReviews: 0,
          averageRating: 0,
          roleCounts: { all: 0, job_seeker: 0, recruiter: 0, employer: 0 },
          ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/reviews
 * Authenticated endpoint to submit a review.
 * RULE: One user will provide ONE review throughout their lifespan.
 * If user already submitted a review, this will UPDATE (upsert) their review.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to submit a review" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parseResult = submitReviewSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 },
      );
    }

    const {
      role,
      rating,
      content,
      headline,
      companyOrTarget,
      verifiedOutcome,
      tags,
    } = parseResult.data;

    await connectDB();

    // Check if user already has an existing review
    const existingReview = await Review.findOne({ userId: user.id });
    const isUpdate = Boolean(existingReview);

    // Upsert review for this user (1 user = 1 review)
    const updatedReview = await Review.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          userId: user.id,
          authorName: user.name || "Anonymous Professional",
          authorImage: user.image || "",
          role,
          rating,
          content,
          headline: headline || user.headline || "",
          companyOrTarget: companyOrTarget || "",
          verifiedOutcome: verifiedOutcome || "",
          tags,
          status: "approved",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
          helpfulVotes: 0,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    return NextResponse.json({
      success: true,
      review: updatedReview,
      isUpdate,
      message: isUpdate
        ? "Your review has been successfully updated!"
        : "Thank you! Your review has been published.",
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 },
    );
  }
}
