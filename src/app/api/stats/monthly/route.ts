import { connectDB } from "@/lib/db";
import { JobApplication, MonthlyStats } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Try to get cached stats first
    let stats = await MonthlyStats.findOne({
      userId,
      year,
      month,
    });

    // If not cached, calculate from applications
    if (!stats) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const applications = await JobApplication.find({
        userId,
        appliedAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      const totalApplications = applications.length;
      const responsesReceived = applications.filter(
        (app) => app.responseAt
      ).length;
      const rejections = applications.filter(
        (app) => app.status === "rejected"
      ).length;
      const interviews = applications.filter(
        (app) => app.status === "interview_scheduled" || app.status === "interviewed"
      ).length;
      const offers = applications.filter(
        (app) => app.status === "offer_received"
      ).length;

      stats = new MonthlyStats({
        userId,
        year,
        month,
        totalApplications,
        responsesReceived,
        rejections,
        interviews,
        offers,
      });

      await stats.save();
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly stats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Recalculate stats
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const applications = await JobApplication.find({
      userId,
      appliedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const totalApplications = applications.length;
    const responsesReceived = applications.filter(
      (app) => app.responseAt
    ).length;
    const rejections = applications.filter(
      (app) => app.status === "rejected"
    ).length;
    const interviews = applications.filter(
      (app) => app.status === "interview_scheduled" || app.status === "interviewed"
    ).length;
    const offers = applications.filter(
      (app) => app.status === "offer_received"
    ).length;

    let stats = await MonthlyStats.findOne({
      userId,
      year,
      month,
    });

    if (stats) {
      Object.assign(stats, {
        totalApplications,
        responsesReceived,
        rejections,
        interviews,
        offers,
        updatedAt: new Date(),
      });
      await stats.save();
    } else {
      stats = new MonthlyStats({
        userId,
        year,
        month,
        totalApplications,
        responsesReceived,
        rejections,
        interviews,
        offers,
      });
      await stats.save();
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error calculating monthly stats:", error);
    return NextResponse.json(
      { error: "Failed to calculate monthly stats" },
      { status: 500 }
    );
  }
}
