import { connectDB } from "@/lib/db";
import { JobApplication } from "@/lib/models";
import { jobApplicationSchema } from "@/lib/validation";
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

    const applications = await JobApplication.find({ userId }).sort({
      appliedAt: -1,
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
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
    const validatedData = jobApplicationSchema.parse({
      ...body,
      userId,
    });

    const application = new JobApplication(validatedData);
    await application.save();

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    console.error("Error creating application:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
