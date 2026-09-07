import { connectDB } from "@/lib/db";
import { Resume } from "@/lib/models";
import { resumeSchema } from "@/lib/validation";
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

    const resumes = await Resume.find({ userId }).sort({
      uploadedAt: -1,
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
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
    const validatedData = resumeSchema.parse({
      ...body,
      userId,
    });

    const resume = new Resume(validatedData);
    await resume.save();

    return NextResponse.json(resume, { status: 201 });
  } catch (error: any) {
    console.error("Error creating resume:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}
