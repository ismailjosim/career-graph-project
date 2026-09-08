import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Wishlist } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";
import { wishlistSchema } from "@/lib/validation";

export async function GET(
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
    const item = await Wishlist.findOne({
      _id: id,
      userId,
    });

    if (!item) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching wishlist item:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist item" },
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
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const item = await Wishlist.findOne({
      _id: id,
      userId,
    });

    if (!item) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 },
      );
    }

    const validatedData = wishlistSchema.partial().parse(body);
    Object.assign(item, validatedData);
    await item.save();

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating wishlist item:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update wishlist item" },
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
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    await connectDB();

    const { id } = await params;
    const result = await Wishlist.deleteOne({
      _id: id,
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Wishlist item deleted successfully" });
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    return NextResponse.json(
      { error: "Failed to delete wishlist item" },
      { status: 500 },
    );
  }
}
