import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Wishlist } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";
import { wishlistSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    const userId = user.id;

    await connectDB();

    const wishlist = await Wishlist.find({ userId }).sort({
      savedAt: -1,
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
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
    const validatedData = wishlistSchema.parse({
      ...body,
      userId,
    });

    const item = new Wishlist(validatedData);
    await item.save();

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating wishlist item:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create wishlist item" },
      { status: 500 },
    );
  }
}
