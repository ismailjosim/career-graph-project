import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { JobMarket } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";
import { jobMarketSchema } from "@/lib/validation";

export const DEFAULT_JOB_MARKETS = [
  {
    name: "LinkedIn Jobs",
    link: "https://www.linkedin.com/jobs",
    category: "general",
    description:
      "The world's largest professional networking platform and job marketplace with direct recruiter messaging.",
    tags: ["Global", "All Roles", "Networking", "Easy Apply"],
    rating: 5,
    isFavorite: true,
  },
  {
    name: "Wellfound (AngelList)",
    link: "https://wellfound.com/jobs",
    category: "startups",
    description:
      "Connect directly with startup founders and early-stage high-growth technology companies.",
    tags: ["Startups", "Equity", "Direct Founders", "Tech"],
    rating: 5,
    isFavorite: true,
  },
  {
    name: "RemoteOK",
    link: "https://remoteok.com",
    category: "remote",
    description:
      "Premier marketplace for remote developers, designers, and marketers with verified pay statistics.",
    tags: ["Remote", "Transparent Pay", "Worldwide", "Tech"],
    rating: 5,
    isFavorite: true,
  },
  {
    name: "We Work Remotely",
    link: "https://weworkremotely.com",
    category: "remote",
    description:
      "One of the oldest and largest remote work communities with 100% remote job listings.",
    tags: ["Remote", "Engineering", "Marketing", "Customer Support"],
    rating: 4,
    isFavorite: false,
  },
  {
    name: "Y Combinator Work at a Startup",
    link: "https://www.workatastartup.com",
    category: "startups",
    description:
      "Apply directly to YC-backed startup teams and breakthrough venture companies worldwide.",
    tags: ["YC Alumni", "High Equity", "Engineering", "Founders"],
    rating: 5,
    isFavorite: true,
  },
  {
    name: "Indeed",
    link: "https://www.indeed.com",
    category: "general",
    description:
      "Comprehensive job search engine indexing millions of employment opportunities worldwide.",
    tags: ["High Volume", "Local & Remote", "Salary Insights"],
    rating: 4,
    isFavorite: false,
  },
  {
    name: "Upwork",
    link: "https://www.upwork.com",
    category: "freelance",
    description:
      "Leading marketplace connecting freelancers and agencies with enterprise clients globally.",
    tags: ["Freelance", "Contract", "Hourly & Fixed", "Global Clients"],
    rating: 4,
    isFavorite: false,
  },
  {
    name: "Dribbble Jobs",
    link: "https://dribbble.com/jobs",
    category: "design",
    description:
      "Curated design jobs, UI/UX opportunities, and creative gigs from top creative brands.",
    tags: ["UI/UX", "Product Design", "Creative", "Remote"],
    rating: 4,
    isFavorite: false,
  },
];

export async function GET(_request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    const userId = user.id;

    await connectDB();

    let markets = await JobMarket.find({ userId }).sort({
      isFavorite: -1,
      visitCount: -1,
      savedAt: -1,
    });

    // Seed default curated markets on first visit if none exist
    if (markets.length === 0) {
      const seededDocs = DEFAULT_JOB_MARKETS.map((item) => ({
        ...item,
        title: item.name,
        company: item.name,
        userId,
        visitCount: 0,
        savedAt: new Date(),
      }));

      await JobMarket.insertMany(seededDocs);
      markets = await JobMarket.find({ userId }).sort({
        isFavorite: -1,
        visitCount: -1,
        savedAt: -1,
      });
    }

    return NextResponse.json(markets);
  } catch (error) {
    console.error("Error fetching job markets:", error);
    const msg =
      error instanceof Error ? error.message : "Failed to fetch job markets";
    return NextResponse.json({ error: msg }, { status: 500 });
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

    const body = await request.json();
    const validatedData = jobMarketSchema.parse({
      ...body,
      title: body.title || body.name,
      company: body.company || body.name,
      userId,
    });

    const market = new JobMarket(validatedData);
    await market.save();

    return NextResponse.json(market, { status: 201 });
  } catch (error) {
    console.error("Error creating job market:", error);
    const err = error as { name?: string; errors?: unknown; message?: string };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: err.message || "Failed to create job market entry" },
      { status: 500 },
    );
  }
}
