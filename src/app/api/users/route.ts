import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ensureSuperAdminExists, requireAdminUser } from "@/lib/server-auth";
import type { UserRole } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminUser();
    if ("response" in authResult) {
      return authResult.response;
    }

    await ensureSuperAdminExists();

    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: "Database connection unavailable" },
        { status: 500 },
      );
    }

    const userCollection = db.collection("user");

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const role = searchParams.get("role") || "all";
    const status = searchParams.get("status") || "all";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(
      1,
      Math.min(100, Number(searchParams.get("limit")) || 15),
    );
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (role && role !== "all") {
      query.role = role;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const [rawUsers, totalFiltered, allUsersForCounts] = await Promise.all([
      userCollection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      userCollection.countDocuments(query),
      userCollection.find({}, { projection: { role: 1, status: 1 } }).toArray(),
    ]);

    // Aggregate counts for all role tabs
    const roleCounts: Record<string, number> = {
      all: allUsersForCounts.length,
      super_admin: 0,
      admin: 0,
      job_seeker: 0,
      recruiter: 0,
      employer: 0,
    };

    const statusCounts: Record<string, number> = {
      all: allUsersForCounts.length,
      active: 0,
      inactive: 0,
      blocked: 0,
    };

    for (const u of allUsersForCounts) {
      const r = (u.role as UserRole) || "job_seeker";
      if (roleCounts[r] !== undefined) {
        roleCounts[r]++;
      } else {
        roleCounts.job_seeker++;
      }

      const s = (u.status as string) || "active";
      if (statusCounts[s] !== undefined) {
        statusCounts[s]++;
      } else {
        statusCounts.active++;
      }
    }

    const users = rawUsers.map((u) => ({
      id: u._id.toString(),
      _id: u._id.toString(),
      name: u.name || "Unnamed User",
      email: u.email,
      emailVerified: Boolean(u.emailVerified),
      image: u.image || null,
      role: (u.role as UserRole) || "job_seeker",
      status: (u.status as string) || "active",
      headline: (u.headline as string) || "",
      phone: (u.phone as string) || "",
      location: (u.location as string) || "",
      isProfileComplete: Boolean(u.isProfileComplete),
      createdAt: u.createdAt || new Date(),
      updatedAt: u.updatedAt || new Date(),
    }));

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit) || 1,
      },
      roleCounts,
      statusCounts,
      currentUserRole: authResult.user.role,
      currentUserId: authResult.user.id,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users list" },
      { status: 500 },
    );
  }
}
