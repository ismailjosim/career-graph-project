import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { JobApplication } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";
import { jobApplicationSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    await connectDB();

    const applications = await JobApplication.find({ userId }).sort({
      appliedAt: -1,
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    await connectDB();

    const body = await request.json();
    const validatedData = jobApplicationSchema.parse({
      ...body,
      userId,
    });

    const application = new JobApplication(validatedData);
    await application.save();

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 },
    );
  }
}
