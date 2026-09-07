import { connectDB } from "@/lib/db";
import { CoverLetter } from "@/lib/models";
import { coverLetterSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const coverLetters = await CoverLetter.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(coverLetters);
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    return NextResponse.json(
      { error: "Failed to fetch cover letters" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = coverLetterSchema.parse({
      ...body,
      userId,
    });

    const coverLetter = new CoverLetter(validatedData);
    await coverLetter.save();

    return NextResponse.json(coverLetter, { status: 201 });
  } catch (error: any) {
    console.error("Error creating cover letter:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create cover letter" },
      { status: 500 }
    );
  }
}
