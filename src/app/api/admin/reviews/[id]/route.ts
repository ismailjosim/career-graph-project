import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import { getSessionUser } from "@/lib/server-auth";
import { REVIEW_STATUSES } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/admin/reviews/[id]
 * Updates review moderation status (e.g. approve, reject, feature)
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (
      !status ||
      !REVIEW_STATUSES.includes(status as (typeof REVIEW_STATUSES)[number])
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${REVIEW_STATUSES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    await connectDB();
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: { status, updatedAt: new Date() } },
      { new: true },
    );

    if (!updatedReview) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      review: updatedReview,
      message: `Review status updated to ${status}.`,
    });
  } catch (error) {
    console.error("Admin review status update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review status" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/reviews/[id]
 * Permanently deletes a review.
 */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;

    await connectDB();
    const deleted = await Review.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted permanently.",
    });
  } catch (error) {
    console.error("Admin review delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
