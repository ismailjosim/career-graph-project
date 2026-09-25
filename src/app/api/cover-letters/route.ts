import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CoverLetter } from "@/lib/models";
import { getUserPlanUsage } from "@/lib/plan-limits";
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

    // Enforce Plan Storage Limits (e.g. Free plan: 3 cover letters, Pro plan: 15)
    const usage = await getUserPlanUsage(userId);
    if (usage.coverLetters.isLimitReached) {
      return NextResponse.json(
        {
          error: `Cover letter limit reached (${usage.coverLetters.count}/${usage.coverLetters.max}). On the ${usage.planName}, you can store up to ${usage.coverLetters.max} cover letters. Please delete an older cover letter to make room, or upgrade your plan.`,
          code: "PLAN_LIMIT_REACHED",
          limitType: "cover_letter",
          currentCount: usage.coverLetters.count,
          maxAllowed: usage.coverLetters.max,
          plan: usage.plan,
        },
        { status: 403 },
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
