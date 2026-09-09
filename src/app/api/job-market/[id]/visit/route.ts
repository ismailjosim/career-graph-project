import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { JobMarket } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    await connectDB();

    const { id } = await params;
    const market = await JobMarket.findOneAndUpdate(
      { _id: id, userId },
      { $inc: { visitCount: 1 } },
      { new: true },
    );

    if (!market) {
      return NextResponse.json(
        { error: "Job market item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(market);
  } catch (error) {
    console.error("Error recording visit to job market:", error);
    return NextResponse.json(
      { error: "Failed to record visit" },
      { status: 500 },
    );
  }
}
