import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { JobMarket } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";
import { jobMarketSchema } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    const userId = user.id;

    await connectDB();

    const { id } = await params;
    const market = await JobMarket.findOne({
      _id: id,
      userId,
    });

    if (!market) {
      return NextResponse.json(
        { error: "Job market entry not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(market);
  } catch (error) {
    console.error("Error fetching job market item:", error);
    return NextResponse.json(
      { error: "Failed to fetch job market item" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    const userId = user.id;

    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const market = await JobMarket.findOne({
      _id: id,
      userId,
    });

    if (!market) {
      return NextResponse.json(
        { error: "Job market entry not found" },
        { status: 404 },
      );
    }

    const validatedData = jobMarketSchema.partial().parse(body);
    Object.assign(market, validatedData);
    await market.save();

    return NextResponse.json(market);
  } catch (error) {
    console.error("Error updating job market item:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update job market item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    const userId = user.id;

    await connectDB();

    const { id } = await params;
    const result = await JobMarket.deleteOne({
      _id: id,
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Job market entry not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Job market entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job market item:", error);
    return NextResponse.json(
      { error: "Failed to delete job market item" },
      { status: 500 },
    );
  }
}
