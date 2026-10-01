import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ResumeTemplate } from "@/lib/models";
import { requireAdminUser } from "@/lib/server-auth";
import { resumeTemplateSchema } from "@/lib/validation";

const PROTECTED_SYSTEM_SLUGS = ["modern", "executive", "tech", "creative"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminUser();
    if ("response" in authResult) {
      return authResult.response;
    }

    const { id } = await params;
    const body = await request.json();

    // Partial validation
    const partialSchema = resumeTemplateSchema.partial();
    const validated = partialSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    await connectDB();

    const query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { slug: id };

    // If slug is changing, verify it doesn't collide
    if (validated.data.slug) {
      const collision = await ResumeTemplate.findOne({
        slug: validated.data.slug.toLowerCase().trim(),
        _id: { $ne: ObjectId.isValid(id) ? new ObjectId(id) : undefined },
      });
      if (collision) {
        return NextResponse.json(
          { error: "Another template with this slug already exists." },
          { status: 409 },
        );
      }
    }

    const updated = await ResumeTemplate.findOneAndUpdate(
      query,
      { $set: validated.data },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Template updated successfully", template: updated },
      { status: 200 },
    );
  } catch (err) {
    console.error("Admin PATCH resume-templates error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to update template",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminUser();
    if ("response" in authResult) {
      return authResult.response;
    }

    const { id } = await params;
    await connectDB();

    const query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { slug: id };
    const existing = await ResumeTemplate.findOne(query);

    if (!existing) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    // Protect core system templates from accidental permanent deletion
    if (PROTECTED_SYSTEM_SLUGS.includes(existing.slug)) {
      // Instead of hard deleting, we can deactivate them
      await ResumeTemplate.updateOne(query, { $set: { isActive: false } });
      return NextResponse.json(
        {
          message:
            "Core system template deactivated instead of deleted to protect existing candidate resumes.",
          template: { ...existing.toObject(), isActive: false },
        },
        { status: 200 },
      );
    }

    await ResumeTemplate.deleteOne(query);

    return NextResponse.json(
      { message: "Template deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Admin DELETE resume-templates error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to delete template",
      },
      { status: 500 },
    );
  }
}
