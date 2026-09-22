import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { JobApplication, MonthlyStats } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    const userId = user.id;

    await connectDB();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Fetch all applications for this user
    const applications = await JobApplication.find({ userId });

    const totalApplications = applications.length;
    const responsesReceived = applications.filter(
      (app) =>
        app.status === "interview_scheduled" ||
        app.status === "interviewed" ||
        app.status === "offer_received" ||
        app.responseType === "positive" ||
        Boolean(app.responseAt),
    ).length;
    const rejections = applications.filter(
      (app) => app.status === "rejected" || app.responseType === "negative",
    ).length;
    const interviews = applications.filter(
      (app) =>
        app.status === "interview_scheduled" || app.status === "interviewed",
    ).length;
    const offers = applications.filter(
      (app) => app.status === "offer_received",
    ).length;

    // Persist or update current month stats in MongoDB
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
    console.error("Error fetching monthly stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly stats" },
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

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const applications = await JobApplication.find({ userId });

    const totalApplications = applications.length;
    const responsesReceived = applications.filter(
      (app) =>
        app.status === "interview_scheduled" ||
        app.status === "interviewed" ||
        app.status === "offer_received" ||
        app.responseType === "positive" ||
        Boolean(app.responseAt),
    ).length;
    const rejections = applications.filter(
      (app) => app.status === "rejected" || app.responseType === "negative",
    ).length;
    const interviews = applications.filter(
      (app) =>
        app.status === "interview_scheduled" || app.status === "interviewed",
    ).length;
    const offers = applications.filter(
      (app) => app.status === "offer_received",
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
      { status: 500 },
    );
  }
}
