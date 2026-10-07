import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resume } from "@/lib/models";
import { getUserPlanUsage } from "@/lib/plan-limits";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";
import { resumeSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    const userId = user.id;

    await connectDB();

    const resumes = await Resume.find({ userId }).sort({
      uploadedAt: -1,
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
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

    // Enforce Plan Storage Limits (e.g. Free plan: 1 resume, Pro plan: 5 resumes)
    const usage = await getUserPlanUsage(userId);
    if (usage.resumes.isLimitReached) {
      return NextResponse.json(
        {
          error: `Resume limit reached (${usage.resumes.count}/${usage.resumes.max}). On the ${usage.planName}, you can save up to ${usage.resumes.max} resume${usage.resumes.max > 1 ? "s" : ""}. Please delete an existing resume to make room, or upgrade your plan.`,
          code: "PLAN_LIMIT_REACHED",
          limitType: "resume",
          currentCount: usage.resumes.count,
          maxAllowed: usage.resumes.max,
          plan: usage.plan,
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const validatedData = resumeSchema.parse({
      ...body,
      userId,
    });

    if (
      !validatedData.rawText &&
      (validatedData.fileUrl || validatedData.builderData)
    ) {
      try {
        const { extractResumeTextUniversal } = await import(
          "@/lib/resume-text-extractor"
        );
        const extracted = await extractResumeTextUniversal({
          fileUrl: validatedData.fileUrl,
          builderData: validatedData.builderData,
        });
        if (extracted.text && extracted.text.length > 20) {
          validatedData.rawText = extracted.text;
        }
      } catch (err) {
        console.warn(
          "Failed to automatically extract text for new resume:",
          err,
        );
      }
    }

    const resume = new Resume(validatedData);
    await resume.save();

    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    console.error("Error creating resume:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 },
    );
  }
}
