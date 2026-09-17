import { type NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary, extractPublicIdFromUrl } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { Resume } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";
import { resumeSchema } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    await connectDB();

    const { id } = await params;
    const resume = await Resume.findOne({
      _id: id,
      userId,
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const resume = await Resume.findOne({
      _id: id,
      userId,
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const validatedData = resumeSchema.partial().parse(body);
    Object.assign(resume, validatedData);
    await resume.save();

    return NextResponse.json(resume);
  } catch (error) {
    console.error("Error updating resume:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    await connectDB();

    const { id } = await params;
    const resume = await Resume.findOne({ _id: id, userId });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const publicId =
      resume.cloudinaryPublicId || extractPublicIdFromUrl(resume.fileUrl);
    if (publicId) {
      deleteFromCloudinary(publicId, "raw").catch(() => {
        // Retry as image resource type just in case
        deleteFromCloudinary(publicId, "image").catch(() => {});
      });
    }

    await Resume.deleteOne({ _id: id, userId });

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 },
    );
  }
}
