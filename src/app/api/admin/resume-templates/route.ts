import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resume, ResumeTemplate } from "@/lib/models";
import { requireAdminUser } from "@/lib/server-auth";
import { resumeTemplateSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminUser();
    if ("response" in authResult) {
      return authResult.response;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get("limit") || "10", 10)),
    );
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();

    // Build filter
    const filter: Record<string, unknown> = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (status === "active") filter.isActive = true;
    else if (status === "inactive") filter.isActive = false;
    else if (status === "pro") filter.isPro = true;
    else if (status === "free") filter.isPro = false;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const totalMatching = await ResumeTemplate.countDocuments(filter);
    const totalPages = Math.ceil(totalMatching / limit) || 1;
    const skip = (page - 1) * limit;

    const templates = await ResumeTemplate.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get usage stats per template from Resume model
    const usageCounts = await Resume.aggregate([
      {
        $match: {
          $or: [
            { isBuiltInApp: true },
            { templateId: { $exists: true, $ne: null } },
          ],
        },
      },
      { $group: { _id: "$templateId", count: { $sum: 1 } } },
    ]);

    const usageMap: Record<string, number> = {};
    for (const item of usageCounts) {
      if (item._id) {
        usageMap[String(item._id)] = item.count;
      }
    }

    const templatesWithStats = templates.map((t) => {
      const slugCount = usageMap[t.slug] || 0;
      const idCount = usageMap[String(t._id)] || 0;
      return {
        ...t,
        _id: String(t._id),
        usageCount: slugCount + idCount,
      };
    });

    // Overall collection stats
    const allTemplates = await ResumeTemplate.find()
      .select("isActive isPro")
      .lean();

    const stats = {
      total: allTemplates.length,
      active: allTemplates.filter((t) => t.isActive).length,
      pro: allTemplates.filter((t) => t.isPro).length,
      free: allTemplates.filter((t) => !t.isPro).length,
    };

    return NextResponse.json(
      {
        templates: templatesWithStats,
        stats,
        pagination: {
          page,
          limit,
          totalTemplates: totalMatching,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Admin GET resume-templates error:", err);
    return NextResponse.json(
      { error: "Failed to load templates" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminUser();
    if ("response" in authResult) {
      return authResult.response;
    }

    const body = await request.json();
    const validated = resumeTemplateSchema.safeParse(body);

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

    // Ensure slug is unique
    const existing = await ResumeTemplate.findOne({
      slug: validated.data.slug.toLowerCase().trim(),
    });
    if (existing) {
      return NextResponse.json(
        {
          error:
            "A template with this slug already exists. Please choose another slug.",
        },
        { status: 409 },
      );
    }

    const newTemplate = await ResumeTemplate.create({
      ...validated.data,
      slug: validated.data.slug.toLowerCase().trim(),
      createdBy: authResult.user.id,
    });

    return NextResponse.json(
      {
        message: "Resume template created successfully",
        template: newTemplate,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Admin POST resume-templates error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to create template",
      },
      { status: 500 },
    );
  }
}
