import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TokenPackage } from "@/lib/models";
import { createPolarProduct, DEFAULT_POLAR_PRODUCTS } from "@/lib/polar";
import { getSessionUser, requireAdminUser } from "@/lib/server-auth";
import { serverCache } from "@/lib/server-cache";

const DEFAULT_PACKAGES = [
  {
    name: "Starter Pack",
    tokens: 500,
    price: 5,
    polarProductId: DEFAULT_POLAR_PRODUCTS["Starter Pack"],
    description:
      "Essential token bundle for kickstarting your targeted job applications.",
    badge: "Starter",
    isPopular: false,
    features: [
      "~12 Complete Application Suites",
      "50 Deep ATS Resume Audits (10 tokens each)",
      "25 AI Tailored Cover Letters (20 tokens each)",
      "50 Job Fit Alignment Checks (10 tokens each)",
      "Tokens never expire (Lifetime validity)",
    ],
    isActive: true,
    category: "bundle",
    sortOrder: 1,
  },
  {
    name: "Pro Pack",
    tokens: 1150,
    price: 10,
    polarProductId: DEFAULT_POLAR_PRODUCTS["Pro Pack"],
    description:
      "Our most popular package for serious applicants targeting top roles (+15% Free Bonus).",
    badge: "Most Popular",
    isPopular: true,
    features: [
      "~28 Complete Application Suites",
      "1,150 AI Diamond Tokens (+150 bonus)",
      "115 Deep ATS Resume Audits (10 tokens each)",
      "57 AI Tailored Cover Letters (20 tokens each)",
      "High-Priority AI Inference",
      "Tokens never expire (Lifetime validity)",
    ],
    isActive: true,
    category: "bundle",
    sortOrder: 2,
  },
  {
    name: "Ultra Career Pack",
    tokens: 2600,
    price: 20,
    polarProductId: DEFAULT_POLAR_PRODUCTS["Ultra Career Pack"],
    description:
      "Maximum career acceleration bundle with the highest token value per dollar (+30% Free Bonus).",
    badge: "Best Value",
    isPopular: false,
    features: [
      "~65 Complete Application Suites",
      "2,600 AI Diamond Tokens (+600 bonus)",
      "260 Deep ATS Resume Audits (10 tokens each)",
      "130 AI Tailored Cover Letters (20 tokens each)",
      "Priority VIP AI Inference Speed",
      "Tokens never expire (Lifetime validity)",
    ],
    isActive: true,
    category: "bundle",
    sortOrder: 3,
  },
  {
    name: "Annual VIP Pass",
    tokens: 7000,
    price: 50,
    polarProductId: "",
    description:
      "All-in-one 365-day pass with 7,000 Lifetime Tokens and 1 Full Year of VIP Priority Daily AI Job Scraping (Save 58%).",
    badge: "1 Year VIP • Save 58%",
    isPopular: false,
    features: [
      "~175 Complete Application Suites",
      "7,000 AI Diamond Tokens (+75% Mega Bonus)",
      "365 Days of Daily AI Job Matches (1 Full Year)",
      "Top VIP Priority in Daily Scraper Queue",
      "Up to 20 Tailored Matches Per Day",
      "Tokens never expire (Lifetime validity)",
    ],
    isActive: true,
    category: "bundle",
    sortOrder: 4,
  },
  {
    name: "Token Mini Refill",
    tokens: 200,
    price: 2,
    polarProductId: "",
    description:
      "Instant token top-up for ATS resume checks & tailored cover letters (Tokens only, no daily scraping).",
    badge: "Quick Top-Up",
    category: "token_only",
    isPopular: false,
    features: [
      "200 AI Diamond Tokens",
      "20 Deep ATS Resume Audits (10 tokens each)",
      "10 AI Tailored Cover Letters (20 tokens each)",
      "Tokens never expire (Lifetime validity)",
      "Instant balance credit",
    ],
    isActive: true,
    sortOrder: 10,
  },
  {
    name: "Token Pro Refill",
    tokens: 600,
    price: 5,
    polarProductId: "",
    description:
      "High-volume token refill for active applicants focusing on resume audits and cover letters (+20% Bonus).",
    badge: "Best Value Refill",
    category: "token_only",
    isPopular: false,
    features: [
      "600 AI Diamond Tokens (+100 Free Bonus)",
      "60 Deep ATS Resume Audits (10 tokens each)",
      "30 AI Tailored Cover Letters (20 tokens each)",
      "Tokens never expire (Lifetime validity)",
      "Instant balance credit",
    ],
    isActive: true,
    sortOrder: 11,
  },
];

export async function GET() {
  try {
    await connectDB();

    let count = await TokenPackage.countDocuments();
    if (count === 0) {
      await TokenPackage.insertMany(DEFAULT_PACKAGES);
      count = DEFAULT_PACKAGES.length;
    } else {
      // Ensure Annual VIP Pass exists in DB
      const existingAnnual = await TokenPackage.findOne({
        name: "Annual VIP Pass",
      });
      if (!existingAnnual) {
        await TokenPackage.create(DEFAULT_PACKAGES[3]);
      }

      // Ensure Token Mini Refill exists in DB
      const existingMini = await TokenPackage.findOne({
        name: "Token Mini Refill",
      });
      if (!existingMini) {
        await TokenPackage.create(DEFAULT_PACKAGES[4]);
      }

      // Ensure Token Pro Refill exists in DB
      const existingProRefill = await TokenPackage.findOne({
        name: "Token Pro Refill",
      });
      if (!existingProRefill) {
        await TokenPackage.create(DEFAULT_PACKAGES[5]);
      }

      // Set category to 'token_only' for refill packages if missing
      await TokenPackage.updateMany(
        { name: /refill/i, category: { $ne: "token_only" } },
        { $set: { category: "token_only" } },
      );

      // Auto-migrate existing database records that don't have polarProductId yet
      const missingPolar = await TokenPackage.find({
        $or: [
          { polarProductId: { $exists: false } },
          { polarProductId: null },
          { polarProductId: "" },
        ],
      });

      for (const p of missingPolar) {
        if (DEFAULT_POLAR_PRODUCTS[p.name]) {
          await TokenPackage.updateOne(
            { _id: p._id },
            { $set: { polarProductId: DEFAULT_POLAR_PRODUCTS[p.name] } },
          );
        }
      }
    }

    const currentUser = await getSessionUser();
    const isAdmin =
      currentUser?.role === "admin" || currentUser?.role === "super_admin";

    // For non-admin users, serve from memory cache if available
    if (!isAdmin) {
      const cached = serverCache.get("public_token_packages");
      if (cached) {
        const res = NextResponse.json({ packages: cached, isAdmin: false });
        res.headers.set(
          "Cache-Control",
          "public, s-maxage=60, stale-while-revalidate=300",
        );
        return res;
      }
    }

    // If admin, show all packages. Else only active ones.
    const query = isAdmin ? {} : { isActive: true };
    const packages = await TokenPackage.find(query).sort({
      sortOrder: 1,
      price: 1,
    });

    if (!isAdmin) {
      serverCache.set("public_token_packages", packages, 120);
    }

    const response = NextResponse.json({
      packages,
      isAdmin,
    });

    if (!isAdmin) {
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=300",
      );
    }

    return response;
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
      category,
      polarProductId,
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

    // Auto-create product in Polar if not provided
    let resolvedPolarProductId =
      typeof polarProductId === "string" && polarProductId.trim()
        ? polarProductId.trim()
        : DEFAULT_POLAR_PRODUCTS[name.trim()] || null;

    if (!resolvedPolarProductId) {
      try {
        resolvedPolarProductId = await createPolarProduct({
          name: name.trim(),
          price: parsedPrice,
          description:
            typeof description === "string" ? description.trim() : "",
        });
      } catch (polarErr) {
        console.warn("Could not automatically create Polar product:", polarErr);
      }
    }

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
      category: category === "token_only" ? "token_only" : "bundle",
      polarProductId: resolvedPolarProductId || undefined,
    });

    serverCache.invalidate("public_token_packages");

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
