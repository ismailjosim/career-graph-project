import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ScrapedJob } from "@/lib/models";
import { requireAdminUser } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminUser();
    if ("response" in auth) {
      return auth.response;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 10),
    );
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const skip = (page - 1) * limit;
    const query = searchParams.get("query")?.trim();
    const source = searchParams.get("source")?.trim();

    const filter: Record<string, unknown> = {};
    if (source && source !== "all") {
      filter.source = new RegExp(source, "i");
    }
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { skills: { $in: [new RegExp(query, "i")] } },
      ];
    }
    const showExpired = searchParams.get("showExpired") === "true";
    if (!showExpired) {
      filter.isActive = true;
      const now = new Date();
      const nonExpired = {
        $or: [
          { deadline: { $exists: false } },
          { deadline: null },
          { deadline: { $gte: now } },
        ],
      };
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, nonExpired];
        delete filter.$or;
      } else {
        filter.$or = nonExpired.$or;
      }
    }

    const [jobs, total] = await Promise.all([
      ScrapedJob.find(filter)
        .sort({ scrapedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ScrapedJob.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching scraped jobs:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch scraped jobs",
      },
      { status: 500 },
    );
  }
}
