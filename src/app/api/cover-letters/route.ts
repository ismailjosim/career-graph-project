import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CoverLetter } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";
import { coverLetterSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    const userId = user.id;

    await connectDB();

    const coverLetters = await CoverLetter.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(coverLetters);
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    return NextResponse.json(
      { error: "Failed to fetch cover letters" },
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
    const validatedData = coverLetterSchema.parse({
      ...body,
      userId,
    });

    const coverLetter = new CoverLetter(validatedData);
    await coverLetter.save();

    return NextResponse.json(coverLetter, { status: 201 });
  } catch (error) {
    console.error("Error creating cover letter:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create cover letter" },
      { status: 500 },
    );
  }
}
