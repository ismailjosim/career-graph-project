import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resume, ResumeTemplate } from "@/lib/models";
import { TOP_50_RECRUITER_TEMPLATES } from "@/lib/resumeTemplatesData";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Check if database needs seeding or updating to the full 50 templates
    const totalInDb = await ResumeTemplate.countDocuments();
    if (totalInDb < 50) {
      // Upsert any missing templates from TOP_50_RECRUITER_TEMPLATES
      const bulkOps = TOP_50_RECRUITER_TEMPLATES.map((tmpl) => ({
        updateOne: {
          filter: { slug: tmpl.slug },
          update: { $setOnInsert: tmpl },
          upsert: true,
        },
      }));
      await ResumeTemplate.bulkWrite(bulkOps);
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(
      1,
      Math.min(50, parseInt(searchParams.get("limit") || "10", 10)),
    );
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim();

    // Build filter query
    const filter: Record<string, unknown> = { isActive: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const totalTemplates = await ResumeTemplate.countDocuments(filter);
    const totalPages = Math.ceil(totalTemplates / limit) || 1;
    const skip = (page - 1) * limit;

    const templates = await ResumeTemplate.find(filter)
      .sort({ sortOrder: 1, createdAt: 1 })
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

    // Format for client consumption
    const formatted = templates.map((t) => {
      const count = (usageMap[t.slug] || 0) + (usageMap[String(t._id)] || 0);
      return {
        id: t.slug,
        slug: t.slug,
        name: t.name,
        subtitle: t.subtitle || "",
        description: t.description || "",
        category: t.category || "general",
        layoutArchetype: t.layoutArchetype || "single_column",
        badge: t.badge || (t.isPro ? "PRO" : undefined),
        isPro: Boolean(t.isPro),
        tokenCost: t.tokenCost || 0,
        thumbnailUrl: t.thumbnailUrl,
        defaultTheme: t.defaultTheme || {
          accentColor: "#4f46e5",
          fontFamily: "sans",
          layoutDensity: "normal",
        },
        sortOrder: t.sortOrder,
        usageCount: count,
      };
    });

    return NextResponse.json(
      {
        templates: formatted,
        pagination: {
          page,
          limit,
          totalTemplates,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Failed to load resume templates:", err);
    return NextResponse.json(
      { error: "Failed to load resume templates" },
      { status: 500 },
    );
  }
}
