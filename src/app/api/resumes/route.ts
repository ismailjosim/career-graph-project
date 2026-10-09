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

    if (validatedData.rawText) {
      const { validateResumeContent } = await import("@/lib/resume-validator");
      const validation = validateResumeContent(validatedData.rawText);
      if (!validation.isValid) {
        return NextResponse.json(
          {
            error:
              validation.reason ||
              "The uploaded document does not appear to be a valid resume or CV. Please upload a PDF document that clearly includes your work experience, education, and skills.",
            code: "INVALID_RESUME_DOCUMENT",
            validationScore: validation.score,
            matchedCategories: validation.matchedCategories,
          },
          { status: 400 },
        );
      }
    }

    const resume = new Resume(validatedData);
    await resume.save();

    // Auto-extract skills & target role to sync directly to user profile
    try {
      const { extractSkillsAndRoleFromResume } = await import(
        "@/lib/resume-skills-extractor"
      );
      const extracted = extractSkillsAndRoleFromResume({
        rawText: validatedData.rawText,
        builderData: validatedData.builderData as Record<
          string,
          unknown
        > | null,
        name: validatedData.name,
      });

      const mongoose = await connectDB();
      const db = mongoose.connection.db;
      if (db) {
        const { ObjectId } = await import("mongodb");
        let userQuery: Record<string, unknown> = { id: userId };
        try {
          userQuery = {
            $or: [
              { _id: new ObjectId(userId) },
              { _id: userId },
              { id: userId },
            ],
          };
        } catch {
          userQuery = { $or: [{ _id: userId }, { id: userId }] };
        }

        const existingUser = await db.collection("user").findOne(userQuery);
        const updateFields: Record<string, unknown> = {};

        // If user doesn't have a headline set, or it's default, update it
        if (
          (!existingUser?.headline ||
            existingUser.headline === "Job Seeker" ||
            existingUser.headline === "Full Stack Developer") &&
          (extracted.detectedRole || validatedData.name)
        ) {
          updateFields.headline = extracted.detectedRole || validatedData.name;
        }

        // Merge newly extracted skills with existing profile skills
        if (extracted.skills.length > 0) {
          const existingSkills: string[] = Array.isArray(existingUser?.skills)
            ? existingUser.skills
            : typeof existingUser?.skills === "string"
              ? existingUser.skills.split(",").map((s) => s.trim())
              : [];

          const existingLower = new Set(
            existingSkills.map((s) => s.toLowerCase()),
          );
          const newToAdd = extracted.skills.filter(
            (s) => !existingLower.has(s.toLowerCase()),
          );

          if (newToAdd.length > 0) {
            updateFields.skills = [...existingSkills, ...newToAdd];
          }
        }

        if (Object.keys(updateFields).length > 0) {
          await db.collection("user").updateOne(userQuery, {
            $set: updateFields,
          });
        }

        // Generate initial job matches based on scraped jobs in database
        const { generateUserDailyMatches } = await import(
          "@/lib/job-match-engine"
        );
        generateUserDailyMatches(userId).catch((genErr) => {
          console.warn("Initial job match generation error:", genErr);
        });
      }
    } catch (extractErr) {
      console.warn("Failed to auto-sync skills to user profile:", extractErr);
    }

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
