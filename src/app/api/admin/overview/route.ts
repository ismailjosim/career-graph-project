import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {
  AnalyticsEvent,
  CoverLetter,
  JobApplication,
  JobPosting,
  Resume,
  Review,
  TokenTransaction,
} from "@/lib/models";
import { requireAdminUser } from "@/lib/server-auth";
import { serverCache } from "@/lib/server-cache";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminUser();
    if ("response" in authResult) {
      return authResult.response;
    }

    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    const CACHE_KEY = "admin_overview_metrics";
    if (!forceRefresh) {
      const cached = serverCache.get(CACHE_KEY);
      if (cached) {
        return NextResponse.json(cached);
      }
    }

    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 500 },
      );
    }

    const userCollection = db.collection<Record<string, unknown>>("user");

    // Execute concurrent aggregations across all data collections
    const [
      totalUsers,
      usersByRoleRaw,
      usersByStatusRaw,
      verifiedUsersCount,
      tokensCirculatingRaw,
      totalApplications,
      applicationsByStatusRaw,
      totalJobPostings,
      jobStatusRaw,
      jobSourceRaw,
      jobAggregatesRaw,
      topClickedJobs,
      totalCoverLetters,
      totalFitAnalysis,
      totalAtsChecks,
      totalResumeDownloads,
      totalResumePrints,
      totalResumesUploaded,
      reviewsMetricsRaw,
      pendingReviewsCount,
      recentUsersRaw,
      recentApplicationsRaw,
    ] = await Promise.all([
      // 1. Users
      userCollection.countDocuments(),
      userCollection
        .aggregate<{ _id: string; count: number }>([
          {
            $group: {
              _id: { $ifNull: ["$role", "job_seeker"] },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      userCollection
        .aggregate<{ _id: string; count: number }>([
          {
            $group: {
              _id: { $ifNull: ["$status", "active"] },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      userCollection.countDocuments({ emailVerified: true }),
      userCollection
        .aggregate<{ totalTokens: number }>([
          {
            $group: {
              _id: null,
              totalTokens: { $sum: { $ifNull: ["$tokens", 50] } },
            },
          },
        ])
        .toArray(),

      // 2. Applications
      JobApplication.countDocuments(),
      JobApplication.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // 3. Job Postings
      JobPosting.countDocuments(),
      JobPosting.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      JobPosting.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$sourcePlatform", count: { $sum: 1 } } },
      ]),
      JobPosting.aggregate<{ totalViews: number; totalClicks: number }>([
        {
          $group: {
            _id: null,
            totalViews: { $sum: { $ifNull: ["$viewsCount", 0] } },
            totalClicks: { $sum: { $ifNull: ["$externalClicksCount", 0] } },
          },
        },
      ]),
      JobPosting.find()
        .sort({ externalClicksCount: -1, viewsCount: -1 })
        .limit(6)
        .select(
          "title company sourcePlatform location workplaceType externalClicksCount viewsCount applicantsCount originalJobUrl",
        )
        .lean(),

      // 4. AI Tool & Feature Generation Counts
      CoverLetter.countDocuments(),
      TokenTransaction.countDocuments({ type: "fit_analysis" }),
      TokenTransaction.countDocuments({ type: "ats_check" }),

      // 5. Resume Builder Downloads & Prints
      AnalyticsEvent.countDocuments({ eventType: "resume_download" }),
      AnalyticsEvent.countDocuments({ eventType: "resume_print" }),
      Resume.countDocuments(),

      // 6. Community Reviews
      Review.aggregate<{ total: number; avgRating: number }>([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgRating: { $avg: "$rating" },
          },
        },
      ]),
      Review.countDocuments({ status: "pending" }),

      // 7. Recent Registrations & Applications for feeds
      userCollection
        .find(
          {},
          {
            projection: { name: 1, email: 1, role: 1, status: 1, createdAt: 1 },
            sort: { createdAt: -1 },
            limit: 5,
          },
        )
        .toArray(),
      JobApplication.find()
        .sort({ appliedAt: -1 })
        .limit(5)
        .select("jobTitle company status appliedAt")
        .lean(),
    ]);

    // Normalize users by role
    const usersByRole = {
      job_seeker: 0,
      recruiter: 0,
      employer: 0,
      admin: 0,
      super_admin: 0,
    };
    for (const item of usersByRoleRaw) {
      if (item._id in usersByRole) {
        usersByRole[item._id as keyof typeof usersByRole] = item.count;
      }
    }

    // Normalize users by status
    const usersByStatus = {
      active: 0,
      inactive: 0,
      blocked: 0,
    };
    for (const item of usersByStatusRaw) {
      if (item._id in usersByStatus) {
        usersByStatus[item._id as keyof typeof usersByStatus] = item.count;
      }
    }

    // Normalize applications by status
    const applicationsByStatus: Record<string, number> = {
      applied: 0,
      interview_scheduled: 0,
      interviewed: 0,
      offer_received: 0,
      rejected: 0,
      withdrawn: 0,
    };
    for (const item of applicationsByStatusRaw) {
      if (item._id) {
        applicationsByStatus[item._id] = item.count;
      }
    }

    const offerCount = applicationsByStatus.offer_received || 0;
    const offerConversionRate =
      totalApplications > 0
        ? Math.round((offerCount / totalApplications) * 100 * 10) / 10
        : 0;

    // Normalize job totals
    const totalJobViews = jobAggregatesRaw[0]?.totalViews || 0;
    const totalExternalClicks = jobAggregatesRaw[0]?.totalClicks || 0;
    const outboundCtr =
      totalJobViews > 0
        ? Math.round((totalExternalClicks / totalJobViews) * 100 * 10) / 10
        : 0;

    const jobsByStatus = {
      active: 0,
      closed: 0,
    };
    for (const item of jobStatusRaw) {
      if (item._id in jobsByStatus) {
        jobsByStatus[item._id as keyof typeof jobsByStatus] = item.count;
      }
    }

    const jobsBySource: Record<string, number> = {
      direct: 0,
      linkedin: 0,
      indeed: 0,
      glassdoor: 0,
      other: 0,
    };
    for (const item of jobSourceRaw) {
      if (item._id) {
        jobsBySource[item._id] = item.count;
      }
    }

    // Reviews summary
    const reviewsTotal = reviewsMetricsRaw[0]?.total || 0;
    const reviewsAverageRating = reviewsMetricsRaw[0]?.avgRating
      ? Math.round(reviewsMetricsRaw[0].avgRating * 10) / 10
      : 0;

    // Assemble real 14-day timeline from database
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setHours(0, 0, 0, 0);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);

    const [dailyUsersRaw, dailyAppsRaw] = await Promise.all([
      userCollection
        .aggregate<{ _id: string; count: number }>([
          { $match: { createdAt: { $gte: fourteenDaysAgo } } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: { $toDate: "$createdAt" },
                },
              },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray()
        .catch(() => []),
      JobApplication.aggregate<{ _id: string; count: number }>([
        { $match: { appliedAt: { $gte: fourteenDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: { $toDate: "$appliedAt" },
              },
            },
            count: { $sum: 1 },
          },
        },
      ]).catch(() => []),
    ]);

    const userCountByDate = new Map(
      (dailyUsersRaw || []).map((u) => [u._id, u.count]),
    );
    const appCountByDate = new Map(
      (dailyAppsRaw || []).map((a) => [a._id, a.count]),
    );

    const timelineData = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(fourteenDaysAgo);
      d.setDate(d.getDate() + i);
      const isoDateKey = d.toISOString().split("T")[0];
      const dateStr = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return {
        date: dateStr,
        users: userCountByDate.get(isoDateKey) || 0,
        applications: appCountByDate.get(isoDateKey) || 0,
        clicks: 0,
      };
    });

    const responseData = {
      metrics: {
        users: {
          total: totalUsers,
          byRole: usersByRole,
          byStatus: usersByStatus,
          verified: verifiedUsersCount,
          unverified: totalUsers - verifiedUsersCount,
          tokensCirculating: tokensCirculatingRaw[0]?.totalTokens || 0,
        },
        applications: {
          total: totalApplications,
          byStatus: applicationsByStatus,
          offerConversionRate,
        },
        jobs: {
          total: totalJobPostings,
          active: jobsByStatus.active,
          closed: jobsByStatus.closed,
          bySource: jobsBySource,
          totalViews: totalJobViews,
          totalExternalClicks,
          outboundCtr,
        },
        topClickedJobs: topClickedJobs.map((j) => ({
          id: String(j._id),
          title: j.title,
          company: j.company,
          location: j.location,
          sourcePlatform: j.sourcePlatform,
          workplaceType: j.workplaceType,
          externalClicksCount: j.externalClicksCount || 0,
          viewsCount: j.viewsCount || 0,
          applicantsCount: j.applicantsCount || 0,
          originalJobUrl: j.originalJobUrl,
        })),
        aiTools: {
          coverLettersGenerated: totalCoverLetters,
          fitAnalysisRuns: totalFitAnalysis,
          atsChecksRuns: totalAtsChecks,
          totalAiRuns: totalCoverLetters + totalFitAnalysis + totalAtsChecks,
        },
        resumeBuilder: {
          downloadsCount: totalResumeDownloads,
          printRequestsCount: totalResumePrints,
          resumesUploaded: totalResumesUploaded,
        },
        communityReviews: {
          total: reviewsTotal,
          pending: pendingReviewsCount,
          averageRating: reviewsAverageRating,
        },
      },
      timeline: timelineData,
      recentActivity: {
        users: recentUsersRaw.map((u) => ({
          id: String(u._id),
          name: u.name || "Anonymous",
          email: u.email,
          role: u.role || "job_seeker",
          status: u.status || "active",
          createdAt: u.createdAt,
        })),
        applications: recentApplicationsRaw.map((a) => ({
          id: String(a._id),
          jobTitle: a.jobTitle,
          company: a.company,
          status: a.status,
          appliedAt: a.appliedAt,
        })),
      },
    };

    // Cache computed metrics for 45 seconds
    serverCache.set(CACHE_KEY, responseData, 45);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching admin overview metrics:", error);
    return NextResponse.json(
      { error: "Failed to load admin overview metrics" },
      { status: 500 },
    );
  }
}
