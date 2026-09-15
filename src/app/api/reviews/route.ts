import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import { getSessionUser } from "@/lib/server-auth";
import {
  REVIEW_ROLES,
  ReviewRole,
  submitReviewSchema,
} from "@/lib/validation";

// Seed/fallback reviews in case a fresh database doesn't have enough community submissions yet
const FALLBACK_REVIEWS = [
  {
    _id: "seed-1",
    userId: "seed-user-1",
    authorName: "Alex Rivera",
    authorImage: "",
    role: "job_seeker",
    rating: 5,
    headline: "Staff Frontend Engineer",
    companyOrTarget: "Landed role @ Stripe",
    verifiedOutcome: "Landed role @ Stripe in 14 days",
    content:
      "The AI Fit Analyzer caught 3 missing distributed system keywords on my resume that I completely overlooked. After tweaking it based on the recommendation, I got invited to an interview within 48 hours.",
    tags: ["AI Fit Analyzer", "Resume Optimizer", "Interview Ready"],
    status: "featured",
    helpfulVotes: 24,
    createdAt: new Date("2026-02-15"),
  },
  {
    _id: "seed-2",
    userId: "seed-user-2",
    authorName: "Samantha Chen",
    authorImage: "",
    role: "job_seeker",
    rating: 5,
    headline: "Senior Product Designer",
    companyOrTarget: "Landed role @ Linear",
    verifiedOutcome: "Landed role @ Linear",
    content:
      "Generating cover letters used to take me 45 minutes per company. Career Graph's AI weaves my actual Figma design system metrics into the letter in 3 seconds. It felt genuinely personalized, not robotic.",
    tags: ["Cover Letters", "Saved Time", "Personalized AI"],
    status: "featured",
    helpfulVotes: 19,
    createdAt: new Date("2026-02-20"),
  },
  {
    _id: "seed-3",
    userId: "seed-user-3",
    authorName: "Marcus Vance",
    authorImage: "",
    role: "recruiter",
    rating: 5,
    headline: "Technical Talent Lead",
    companyOrTarget: "Series B AI Startup",
    verifiedOutcome: "Screened 40+ Top Candidates",
    content:
      "As a recruiter, the curated marketplace directory and ATS keyword breakdown helps us benchmark what top engineers actually have on their resumes. Super clean UX and unmatched speed.",
    tags: ["Talent Screening", "ATS Benchmark", "Clean UX"],
    status: "featured",
    helpfulVotes: 15,
    createdAt: new Date("2026-03-01"),
  },
  {
    _id: "seed-4",
    userId: "seed-user-4",
    authorName: "Elena Rostova",
    authorImage: "",
    role: "employer",
    rating: 5,
    headline: "VP of Engineering",
    companyOrTarget: "Nexus Cloud Systems",
    verifiedOutcome: "Hired 3 Senior Devs",
    content:
      "We filled three senior backend positions in under a month. Candidates coming through Career Graph had clean, well-formatted profiles and realistic expectations on tech stacks.",
    tags: ["Fast Hiring", "Pre-vetted Profiles", "Reduced Time-to-Hire"],
    status: "featured",
    helpfulVotes: 31,
    createdAt: new Date("2026-03-05"),
  },
  {
    _id: "seed-5",
    userId: "seed-user-5",
    authorName: "David Kalu",
    authorImage: "",
    role: "job_seeker",
    rating: 5,
    headline: "Full Stack Developer",
    companyOrTarget: "Landed role @ Vercel ecosystem",
    verifiedOutcome: "Received 3 Job Offers",
    content:
      "The application tracker kept me organized when I was balancing 18 active job loops. No more messy spreadsheets. The monthly stats gave me clear visibility into my response rates.",
    tags: ["Pipeline Tracker", "Analytics", "Organized"],
    status: "approved",
    helpfulVotes: 12,
    createdAt: new Date("2026-03-08"),
  },
  {
    _id: "seed-6",
    userId: "seed-user-6",
    authorName: "Jessica Lin",
    authorImage: "",
    role: "recruiter",
    rating: 5,
    headline: "Head of Talent Acquisition",
    companyOrTarget: "FinTech Scaleup",
    verifiedOutcome: "Zero Unqualified Applicants",
    content:
      "The token-based job application model cut out 90% of bot and low-effort spam applications. Every application we received had real thought put into the cover letter and resume fit.",
    tags: ["High Quality Applicants", "No Bot Spam", "Token System"],
    status: "approved",
    helpfulVotes: 28,
    createdAt: new Date("2026-03-10"),
  },
];

/**
 * GET /api/reviews
 * Public endpoint to fetch reviews with optional role filtering and summary statistics
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const roleParam = searchParams.get("role");
    const limitParam = parseInt(searchParams.get("limit") || "30", 10);
    const limit = Math.min(Math.max(limitParam, 1), 100);

    const query: Record<string, unknown> = {
      status: { $in: ["approved", "featured"] },
    };

    if (roleParam && REVIEW_ROLES.includes(roleParam as ReviewRole)) {
      query.role = roleParam;
    }

    // Fetch database reviews
    const dbReviews = await Review.find(query)
      .sort({ status: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    // Calculate database counts by role
    const [totalCount, jobSeekerCount, recruiterCount, employerCount] =
      await Promise.all([
        Review.countDocuments({ status: { $in: ["approved", "featured"] } }),
        Review.countDocuments({
          status: { $in: ["approved", "featured"] },
          role: "job_seeker",
        }),
        Review.countDocuments({
          status: { $in: ["approved", "featured"] },
          role: "recruiter",
        }),
        Review.countDocuments({
          status: { $in: ["approved", "featured"] },
          role: "employer",
        }),
      ]);

    // If database has reviews, use database. Otherwise, blend with fallback seed reviews.
    let combinedReviews = dbReviews;
    let counts = {
      all: totalCount,
      job_seeker: jobSeekerCount,
      recruiter: recruiterCount,
      employer: employerCount,
    };

    if (dbReviews.length === 0) {
      // Filter fallbacks by role if selected
      combinedReviews = roleParam && roleParam !== "all"
        ? (FALLBACK_REVIEWS.filter((r) => r.role === roleParam) as unknown as typeof dbReviews)
        : (FALLBACK_REVIEWS as unknown as typeof dbReviews);

      counts = {
        all: FALLBACK_REVIEWS.length,
        job_seeker: FALLBACK_REVIEWS.filter((r) => r.role === "job_seeker").length,
        recruiter: FALLBACK_REVIEWS.filter((r) => r.role === "recruiter").length,
        employer: FALLBACK_REVIEWS.filter((r) => r.role === "employer").length,
      };
    }

    // Compute average rating
    const ratingSum = combinedReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avgRating =
      combinedReviews.length > 0
        ? Number((ratingSum / combinedReviews.length).toFixed(1))
        : 5.0;

    return NextResponse.json({
      success: true,
      reviews: combinedReviews,
      stats: {
        totalReviews: counts.all,
        averageRating: avgRating,
        roleCounts: counts,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
        reviews: FALLBACK_REVIEWS,
        stats: {
          totalReviews: FALLBACK_REVIEWS.length,
          averageRating: 5.0,
          roleCounts: {
            all: FALLBACK_REVIEWS.length,
            job_seeker: 3,
            recruiter: 2,
            employer: 1,
          },
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
