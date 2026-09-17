import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { JobPosting } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    await connectDB();

    const [myJobs, activeCount, closedCount, aggregatesRaw] = await Promise.all([
      JobPosting.find({ postedBy: user.id })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      JobPosting.countDocuments({ postedBy: user.id, status: "active" }),
      JobPosting.countDocuments({ postedBy: user.id, status: "closed" }),
      JobPosting.aggregate<{ totalViews: number; totalApplicants: number; totalClicks: number }>([
        { $match: { postedBy: user.id } },
        {
          $group: {
            _id: null,
            totalViews: { $sum: { $ifNull: ["$viewsCount", 0] } },
            totalApplicants: { $sum: { $ifNull: ["$applicantsCount", 0] } },
            totalClicks: { $sum: { $ifNull: ["$externalClicksCount", 0] } },
          },
        },
      ]),
    ]);

    const totalViews = aggregatesRaw[0]?.totalViews || 0;
    const totalApplicants = aggregatesRaw[0]?.totalApplicants || 0;
    const totalClicks = aggregatesRaw[0]?.totalClicks || 0;

    return NextResponse.json({
      recruiter: {
        id: user.id,
        name: user.name,
        role: user.role,
        tokens: user.tokens || 0,
      },
      stats: {
        totalJobs: activeCount + closedCount,
        activeJobs: activeCount,
        closedJobs: closedCount,
        totalViews,
        totalApplicants,
        totalClicks,
      },
      recentJobs: myJobs.map((j) => ({
        id: String(j._id),
        title: j.title,
        company: j.company,
        location: j.location,
        workplaceType: j.workplaceType,
        status: j.status,
        viewsCount: j.viewsCount || 0,
        applicantsCount: j.applicantsCount || 0,
        externalClicksCount: j.externalClicksCount || 0,
        createdAt: j.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching recruiter overview:", error);
    return NextResponse.json(
      { error: "Failed to load recruiter overview" },
      { status: 500 },
    );
  }
}
