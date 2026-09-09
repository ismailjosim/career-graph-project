import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TokenPackage } from "@/lib/models";
import { getSessionUser, requireAdminUser } from "@/lib/server-auth";

const DEFAULT_PACKAGES = [
  {
    name: "Starter Pack",
    tokens: 500,
    price: 5,
    description:
      "Essential token bundle for kickstarting your targeted job applications.",
    badge: "Starter",
    isPopular: false,
    features: [
      "50 Deep ATS Resume Audits (10 tokens each)",
      "25 AI Tailored Cover Letters (20 tokens each)",
      "50 Job Fit Alignment Checks (10 tokens each)",
      "Instant Balance Activation",
      "Tokens never expire",
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Pro Pack",
    tokens: 1000,
    price: 10,
    description:
      "Our most popular package for serious applicants targeting top roles.",
    badge: "Most Popular",
    isPopular: true,
    features: [
      "100 Deep ATS Resume Audits (10 tokens each)",
      "50 AI Tailored Cover Letters (20 tokens each)",
      "100 Job Fit Alignment Checks (10 tokens each)",
      "High-Priority AI Inference",
      "Downloadable ATS PDF & Word Reports",
      "Tokens never expire",
    ],
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Ultra Career Pack",
    tokens: 2000,
    price: 20,
    description:
      "Maximum career acceleration bundle with the highest token value per dollar.",
    badge: "Best Value",
    isPopular: false,
    features: [
      "200 Deep ATS Resume Audits (10 tokens each)",
      "100 AI Tailored Cover Letters (20 tokens each)",
      "200 Job Fit Alignment Checks (10 tokens each)",
      "Priority VIP AI Inference Speed",
      "Unlimited Resume Keyword Audits",
      "Dedicated 24/7 Career Assistance",
      "Tokens never expire",
    ],
    isActive: true,
    sortOrder: 3,
  },
];

export async function GET() {
  try {
    await connectDB();

    let count = await TokenPackage.countDocuments();
    if (count === 0) {
      await TokenPackage.insertMany(DEFAULT_PACKAGES);
      count = DEFAULT_PACKAGES.length;
    }

    const currentUser = await getSessionUser();
    const isAdmin =
      currentUser?.role === "admin" || currentUser?.role === "super_admin";

    // If admin, show all packages. Else only active ones.
    const query = isAdmin ? {} : { isActive: true };
    const packages = await TokenPackage.find(query).sort({
      sortOrder: 1,
      price: 1,
    });

    return NextResponse.json({
      packages,
      isAdmin,
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch token packages" },
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
    const {
      name,
      tokens,
      price,
      description,
      badge,
      features,
      isPopular,
      isActive,
      sortOrder,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Package name is required" },
        { status: 400 },
      );
    }

    const parsedTokens = Number(tokens);
    const parsedPrice = Number(price);

    if (Number.isNaN(parsedTokens) || parsedTokens <= 0) {
      return NextResponse.json(
        { error: "Tokens must be a positive number" },
        { status: 400 },
      );
    }

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { error: "Price must be a valid non-negative number" },
        { status: 400 },
      );
    }

    await connectDB();

    const newPackage = await TokenPackage.create({
      name: name.trim(),
      tokens: parsedTokens,
      price: parsedPrice,
      description: typeof description === "string" ? description.trim() : "",
      badge: typeof badge === "string" ? badge.trim() : "",
      features: Array.isArray(features)
        ? features.filter((f) => typeof f === "string" && f.trim())
        : [],
      isPopular: Boolean(isPopular),
      isActive: isActive === undefined ? true : Boolean(isActive),
      sortOrder: Number(sortOrder) || 0,
    });

    return NextResponse.json(
      { package: newPackage, message: "Package created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 },
    );
  }
}
