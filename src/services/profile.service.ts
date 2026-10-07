import { ObjectId } from "mongodb";
import type { ProfileData, ProfileUser } from "@/interfaces";
import { connectDB } from "@/lib/db";
import { CoverLetter, JobApplication, Resume } from "@/lib/models";
import { getSessionUser } from "@/lib/server-auth";
import type { EducationEntry, TechnicalSkill } from "@/lib/validation";

function parseEducation(raw: unknown): EducationEntry[] {
  if (Array.isArray(raw)) return raw as EducationEntry[];
  if (typeof raw === "string" && raw.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as EducationEntry[];
    } catch {
      // ignore JSON parse error
    }
  }
  if (typeof raw === "string" && raw.trim().length > 0) {
    return [
      {
        id: "legacy-edu-1",
        institution: "",
        degree: raw.trim(),
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        credits: "",
        grade: "",
        activities: "",
      },
    ];
  }
  return [];
}

function parseTechnicalSkills(raw: unknown): TechnicalSkill[] {
  if (Array.isArray(raw)) return raw as TechnicalSkill[];
  if (typeof raw === "string" && raw.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as TechnicalSkill[];
    } catch {
      // ignore JSON parse error
    }
  }
  return [];
}

/**
 * Server-side profile data loader matching Health-Care-App service architecture.
 * Fetches user profile, credentials, documents, and application stats.
 */
export async function getProfileDataServer(
  targetUserId?: string,
): Promise<ProfileData | null> {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return null;
    }

    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return null;
    }

    const userCollection = db.collection<Record<string, unknown>>("user");
    const accountCollection = db.collection<Record<string, unknown>>("account");

    const effectiveUserId =
      targetUserId && targetUserId !== sessionUser.id
        ? targetUserId
        : sessionUser.id;

    // Fetch user document from DB
    const userQuery = {
      $or: [
        ...(ObjectId.isValid(effectiveUserId)
          ? [{ _id: new ObjectId(effectiveUserId) }]
          : []),
        { _id: effectiveUserId },
        { id: effectiveUserId },
      ],
    };

    const targetUserDoc = await userCollection.findOne(
      userQuery as Parameters<typeof userCollection.findOne>[0],
    );

    if (!targetUserDoc) {
      return null;
    }

    // Check account auth provider
    const accounts = await accountCollection
      .find({
        $or: [
          { userId: effectiveUserId },
          ...(ObjectId.isValid(effectiveUserId)
            ? [{ userId: new ObjectId(effectiveUserId) }]
            : []),
        ],
      })
      .toArray();

    const hasCredential = accounts.some(
      (a) => a.providerId === "credential" || Boolean(a.password),
    );
    const hasSocial = accounts.some((a) => a.providerId === "google");
    const isSocialOnly = hasSocial && !hasCredential;

    // Fetch documents and metrics concurrently
    const [resumes, coverLetters, totalApplications] = await Promise.all([
      Resume.find({ userId: effectiveUserId }).sort({ uploadedAt: -1 }).lean(),
      CoverLetter.find({ userId: effectiveUserId })
        .sort({ updatedAt: -1 })
        .lean(),
      JobApplication.countDocuments({ userId: effectiveUserId }),
    ]);

    const parsedSkills = Array.isArray(targetUserDoc.skills)
      ? (targetUserDoc.skills as string[])
      : typeof targetUserDoc.skills === "string"
        ? targetUserDoc.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const user: ProfileUser = {
      id: String(targetUserDoc._id || targetUserDoc.id),
      name: String(targetUserDoc.name || ""),
      email: String(targetUserDoc.email || ""),
      emailVerified: Boolean(targetUserDoc.emailVerified),
      image: (targetUserDoc.image as string) || null,
      role: (targetUserDoc.role as ProfileUser["role"]) || "job_seeker",
      status: (targetUserDoc.status as ProfileUser["status"]) || "active",
      phone: (targetUserDoc.phone as string) || "",
      location: (targetUserDoc.location as string) || "",
      headline: (targetUserDoc.headline as string) || "",
      bio: (targetUserDoc.bio as string) || "",
      skills: parsedSkills,
      technicalSkills: parseTechnicalSkills(targetUserDoc.technicalSkills),
      website: (targetUserDoc.website as string) || "",
      linkedin: (targetUserDoc.linkedin as string) || "",
      experience: (targetUserDoc.experience as string) || "",
      education: parseEducation(targetUserDoc.education),
      isProfileComplete: Boolean(targetUserDoc.isProfileComplete),
      createdAt: targetUserDoc.createdAt as string | Date,
      updatedAt: targetUserDoc.updatedAt as string | Date,
    };

    return {
      user: {
        ...user,
        ...(isSocialOnly ? { isSocialOnly: true } : {}),
      } as ProfileUser,
      stats: {
        totalResumes: resumes.length,
        totalCoverLetters: coverLetters.length,
        totalApplications,
      },
      resumes: resumes.map((r: Record<string, unknown>) => ({
        id: String(r._id),
        name: String(r.name || "Resume"),
        fileName: String(r.fileName || "resume.pdf"),
        fileUrl: String(r.fileUrl || ""),
        isDefault: Boolean(r.isDefault),
        uploadedAt: (r.uploadedAt || r.createdAt || new Date()) as
          | string
          | Date,
      })),
      coverLetters: coverLetters.map((cl: Record<string, unknown>) => ({
        id: String(cl._id),
        title: String(cl.title || "Cover Letter"),
        content: String(cl.content || ""),
        createdAt: (cl.createdAt || new Date()) as string | Date,
        updatedAt: (cl.updatedAt || new Date()) as string | Date,
      })),
    };
  } catch (error) {
    console.error("[ProfileService] Server profile fetch error:", error);
    return null;
  }
}
