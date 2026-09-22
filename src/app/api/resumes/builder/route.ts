import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resume } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";
import type { ResumeBuilderData } from "@/lib/validation";

/**
 * Compiles structured builder data into plain text for ATS scoring and keyword analysis.
 */
function compileRawText(data: ResumeBuilderData): string {
  const parts: string[] = [];
  const {
    personalInfo,
    summary,
    experiences,
    educations,
    skillGroups,
    projects,
    certifications,
  } = data;

  if (personalInfo?.fullName) {
    parts.push(personalInfo.fullName);
    if (personalInfo.headline) parts.push(personalInfo.headline);
    const contacts = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
      personalInfo.github,
      personalInfo.website,
    ].filter(Boolean);
    if (contacts.length > 0) parts.push(contacts.join(" | "));
  }

  if (summary) {
    parts.push(`\nPROFESSIONAL SUMMARY\n${summary}`);
  }

  if (experiences && experiences.length > 0) {
    parts.push("\nEXPERIENCE");
    for (const exp of experiences) {
      const line = `${exp.role} at ${exp.company}${exp.location ? `, ${exp.location}` : ""} (${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate || "Present"})`;
      parts.push(line);
      if (exp.description) parts.push(exp.description);
      if (exp.highlights && exp.highlights.length > 0) {
        parts.push(exp.highlights.map((h) => `• ${h}`).join("\n"));
      }
    }
  }

  if (educations && educations.length > 0) {
    parts.push("\nEDUCATION");
    for (const edu of educations) {
      parts.push(
        `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""} - ${edu.institution} (${edu.startDate || ""} - ${edu.endDate || ""})`,
      );
      if (edu.honors) parts.push(`Honors: ${edu.honors}`);
    }
  }

  if (skillGroups && skillGroups.length > 0) {
    parts.push("\nSKILLS");
    for (const group of skillGroups) {
      parts.push(`${group.category}: ${group.skills.join(", ")}`);
    }
  }

  if (projects && projects.length > 0) {
    parts.push("\nPROJECTS");
    for (const proj of projects) {
      parts.push(`${proj.title} ${proj.role ? `(${proj.role})` : ""}`);
      if (proj.techStack && proj.techStack.length > 0) {
        parts.push(`Technologies: ${proj.techStack.join(", ")}`);
      }
      if (proj.description) parts.push(proj.description);
      if (proj.highlights && proj.highlights.length > 0) {
        parts.push(proj.highlights.map((h) => `• ${h}`).join("\n"));
      }
    }
  }

  if (certifications && certifications.length > 0) {
    parts.push("\nCERTIFICATIONS");
    for (const cert of certifications) {
      parts.push(
        `${cert.name} - ${cert.issuer} ${cert.date ? `(${cert.date})` : ""}`,
      );
    }
  }

  return parts.join("\n\n");
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    const userId = user.id;

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (id) {
      const resume = await Resume.findOne({ _id: id, userId });
      if (!resume) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(resume);
    }

    // List all resumes for user, sorted latest
    const resumes = await Resume.find({ userId, isBuiltInApp: true }).sort({
      updatedAt: -1,
    });
    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Error fetching builder resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
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
    const { id, name, templateId = "modern", themeConfig, builderData } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Resume name is required" },
        { status: 400 },
      );
    }

    if (!builderData) {
      return NextResponse.json(
        { error: "Resume builder data is required" },
        { status: 400 },
      );
    }

    const rawText = compileRawText(builderData);
    const fileName = `${name.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

    // If ID is provided, update existing resume
    if (id) {
      const existing = await Resume.findOne({ _id: id, userId });
      if (!existing) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 },
        );
      }

      existing.name = name.trim();
      existing.fileName = fileName;
      existing.isBuiltInApp = true;
      existing.templateId = templateId;
      existing.themeConfig = themeConfig || existing.themeConfig;
      existing.builderData = builderData;
      existing.rawText = rawText;

      await existing.save();
      return NextResponse.json(existing);
    }

    // Otherwise create new resume document
    const newResume = new Resume({
      userId,
      name: name.trim(),
      fileName,
      fileUrl: `/resumes/builder`, // In-app builder reference
      isDefault: false,
      isBuiltInApp: true,
      templateId,
      themeConfig: themeConfig || {
        accentColor: "#4f46e5",
        fontFamily: "sans",
        layoutDensity: "normal",
      },
      builderData,
      rawText,
      uploadedAt: new Date(),
    });

    await newResume.save();
    return NextResponse.json(newResume, { status: 201 });
  } catch (error) {
    console.error("Error saving builder resume:", error);
    return NextResponse.json(
      {
        error: "Failed to save resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
