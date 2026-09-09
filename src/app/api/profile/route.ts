import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CoverLetter, JobApplication, Resume } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";
import { updateUserProfileSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    await connectDB();

    // Fetch user's documents and stats concurrently
    const [resumes, coverLetters, totalApplications] = await Promise.all([
      Resume.find({ userId: user.id }).sort({ uploadedAt: -1 }).lean(),
      CoverLetter.find({ userId: user.id }).sort({ updatedAt: -1 }).lean(),
      JobApplication.countDocuments({ userId: user.id }),
    ]);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        role: user.role,
        status: user.status || "active",
        phone: user.phone || "",
        location: user.location || "",
        headline: user.headline || "",
        bio: user.bio || "",
        skills: user.skills || [],
        website: user.website || "",
        linkedin: user.linkedin || "",
        experience: user.experience || "",
        education: user.education || "",
        isProfileComplete: Boolean(user.isProfileComplete),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      stats: {
        totalResumes: resumes.length,
        totalCoverLetters: coverLetters.length,
        totalApplications,
      },
      resumes: resumes.map((r: Record<string, unknown>) => ({
        id: String(r._id),
        _id: String(r._id),
        name: r.name,
        fileName: r.fileName,
        fileUrl: r.fileUrl,
        isDefault: Boolean(r.isDefault),
        uploadedAt: r.uploadedAt,
      })),
      coverLetters: coverLetters.map((cl: Record<string, unknown>) => ({
        id: String(cl._id),
        _id: String(cl._id),
        title: cl.title,
        content: cl.content,
        createdAt: cl.createdAt,
        updatedAt: cl.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to load user profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const validatedData = updateUserProfileSchema.parse(body);

    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 500 },
      );
    }

    const userCollection = db.collection<Record<string, unknown>>("user");

    const updatePayload: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (validatedData.name) updatePayload.name = validatedData.name;
    if (validatedData.phone !== undefined)
      updatePayload.phone = validatedData.phone;
    if (validatedData.location !== undefined)
      updatePayload.location = validatedData.location;
    if (validatedData.headline !== undefined)
      updatePayload.headline = validatedData.headline;
    if (validatedData.bio !== undefined) updatePayload.bio = validatedData.bio;
    if (validatedData.skills !== undefined) {
      updatePayload.skills = Array.isArray(validatedData.skills)
        ? validatedData.skills
        : validatedData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    if (validatedData.website !== undefined)
      updatePayload.website = validatedData.website;
    if (validatedData.linkedin !== undefined)
      updatePayload.linkedin = validatedData.linkedin;
    if (validatedData.experience !== undefined)
      updatePayload.experience = validatedData.experience;
    if (validatedData.education !== undefined)
      updatePayload.education = validatedData.education;

    // Check if essential fields for cover letter generation are filled
    const headline = validatedData.headline ?? user.headline;
    const bio = validatedData.bio ?? user.bio;
    const hasEssentialFields = Boolean(
      headline && (bio || validatedData.skills),
    );
    updatePayload.isProfileComplete = hasEssentialFields;

    const userQuery = {
      $or: [
        ...(ObjectId.isValid(user.id) ? [{ _id: new ObjectId(user.id) }] : []),
        { _id: user.id },
        { id: user.id },
        { email: user.email },
      ],
    };

    await userCollection.updateOne(
      userQuery as Parameters<typeof userCollection.updateOne>[0],
      { $set: updatePayload },
    );

    const updatedUser = await userCollection.findOne(
      userQuery as Parameters<typeof userCollection.findOne>[0],
    );

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: updatedUser?.name || user.name,
        email: updatedUser?.email || user.email,
        emailVerified: Boolean(updatedUser?.emailVerified),
        role: updatedUser?.role || user.role,
        status: updatedUser?.status || user.status,
        phone: updatedUser?.phone || "",
        location: updatedUser?.location || "",
        headline: updatedUser?.headline || "",
        bio: updatedUser?.bio || "",
        skills: updatedUser?.skills || [],
        website: updatedUser?.website || "",
        linkedin: updatedUser?.linkedin || "",
        experience: updatedUser?.experience || "",
        education: updatedUser?.education || "",
        isProfileComplete: Boolean(updatedUser?.isProfileComplete),
        updatedAt: updatedUser?.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile information" },
      { status: 500 },
    );
  }
}
