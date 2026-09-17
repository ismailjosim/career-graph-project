import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import { getSessionUser } from "@/lib/server-auth";

/**
 * GET /api/reviews/me
 * Fetches the current logged in user's review if they have already submitted one.
 */
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        user: null,
        review: null,
      });
    }

    await connectDB();
    const existingReview = await Review.findOne({ userId: user.id }).lean();

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        headline: user.headline,
      },
      review: existingReview || null,
    });
  } catch (error) {
    console.error("Error fetching user review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user review" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/reviews/me
 * Allows a user to remove their review.
 */
export async function DELETE() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectDB();
    const deleted = await Review.findOneAndDelete({ userId: user.id });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "No review found to delete" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your review has been successfully removed.",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
