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
    let link = (body.link || "").trim();
    if (link && !link.startsWith("http://") && !link.startsWith("https://")) {
      link = `https://${link}`;
    }

    const validatedData = wishlistSchema.parse({
      ...body,
      link,
      description: typeof body.description === "string" ? body.description : "",
      notes: typeof body.notes === "string" ? body.notes : "",
      userId,
    });

    const item = new Wishlist(validatedData);
    await item.save();

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating wishlist item:", error);
    const err = error as {
      name?: string;
      message?: string;
      errors?: unknown;
    };

    if (err.name === "ZodError" && Array.isArray(err.errors)) {
      const zodErrors = err.errors as Array<{
        message: string;
        path: string[];
      }>;
      const firstMessage = zodErrors[0]?.message || "Invalid input data";
      return NextResponse.json(
        { error: firstMessage, details: zodErrors },
        { status: 400 },
      );
    }

    if (err.name === "ValidationError" && err.errors) {
      const messages = Object.values(err.errors).map((e) => e.message);
      return NextResponse.json(
        { error: messages[0] || "Validation error", details: messages },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to create wishlist item" },
      { status: 500 },
    );
  }
}
