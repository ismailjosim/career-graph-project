import { connectDB } from "@/lib/db";
import { CoverLetter, Resume, TokenTransaction } from "@/lib/models";
import {
  DEFAULT_PLAN_CONFIG,
  type PlanStorageLimits,
} from "@/lib/plan-limits.types";
import { getSessionUser } from "@/lib/server-auth";

export * from "@/lib/plan-limits.types";

/**
 * Calculates current user's plan and document usage limits.
 */
export async function getUserPlanUsage(
  userId: string,
): Promise<PlanStorageLimits> {
  await connectDB();

  const user = await getSessionUser();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  // Check if user has purchased any token/pro package in the past
  let isPro = false;
  if (!isAdmin) {
    const hasPurchase = await TokenTransaction.findOne({
      userId,
      type: "package_purchase",
    });
    if (hasPurchase) {
      isPro = true;
    }
  }

  const planType: "free" | "pro" | "admin" = isAdmin
    ? "admin"
    : isPro
      ? "pro"
      : "free";

  const config = DEFAULT_PLAN_CONFIG[planType];

  const [resumeCount, coverLetterCount] = await Promise.all([
    Resume.countDocuments({ userId }),
    CoverLetter.countDocuments({ userId }),
  ]);

  return {
    plan: planType,
    planName: config.name,
    badge: config.badge,
    resumes: {
      count: resumeCount,
      max: config.maxResumes,
      isLimitReached: resumeCount >= config.maxResumes,
    },
    coverLetters: {
      count: coverLetterCount,
      max: config.maxCoverLetters,
      isLimitReached: coverLetterCount >= config.maxCoverLetters,
    },
  };
}

export interface DailyAiPlanStatus {
  hasActivePlan: boolean;
  isExpired: boolean;
  isVip: boolean;
  tier: "none" | "starter" | "pro" | "ultra" | "annual";
  daysRemaining: number | null;
  expiryDate: Date | null;
  isLifetime: boolean;
  matchesMax: number;
}

/**
 * Calculates current user's Daily AI Matches subscription status.
 * - Starter & Pro Packages: 30 days active daily scraping window (12 to 15 curated jobs/day).
 * - Ultra Career Pack: 30 days VIP Priority scraping (15 to 20 jobs/day + top queue).
 * - Annual VIP Pass ($50): 365 days (1 full year) of VIP Priority daily scraping.
 * - All token balances have LIFETIME validity and never expire.
 */
export async function getUserDailyAiMatchesStatus(
  userId: string,
  userRole?: string,
): Promise<DailyAiPlanStatus> {
  if (userRole === "admin" || userRole === "super_admin") {
    return {
      hasActivePlan: true,
      isExpired: false,
      isVip: true,
      tier: "annual",
      daysRemaining: null,
      expiryDate: null,
      isLifetime: true,
      matchesMax: 20,
    };
  }

  await connectDB();

  // If userRole was not provided, check user record in db
  if (!userRole) {
    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (db) {
      try {
        const { ObjectId } = await import("mongodb");
        let query: Record<string, unknown> = { id: userId };
        try {
          query = {
            $or: [
              { _id: new ObjectId(userId) },
              { _id: userId },
              { id: userId },
            ],
          };
        } catch {
          query = { $or: [{ _id: userId }, { id: userId }] };
        }
        const userDoc = await db.collection("user").findOne(query);
        if (
          userDoc?.role === "admin" ||
          userDoc?.role === "super_admin" ||
          userDoc?.hasDailyAiMatchesPlan === true
        ) {
          return {
            hasActivePlan: true,
            isExpired: false,
            isVip: true,
            tier: "annual",
            daysRemaining: null,
            expiryDate: null,
            isLifetime: true,
            matchesMax: 20,
          };
        }
      } catch {
        // Fall through
      }
    }
  }

  // Find the latest career bundle purchase (excluding token-only refills)
  const latestPurchase = await TokenTransaction.findOne({
    userId,
    type: "package_purchase",
    description: { $not: /refill/i },
    "metadata.packageName": { $not: /refill/i },
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!latestPurchase || !latestPurchase.createdAt) {
    return {
      hasActivePlan: false,
      isExpired: false,
      isVip: false,
      tier: "none",
      daysRemaining: 0,
      expiryDate: null,
      isLifetime: false,
      matchesMax: 7,
    };
  }

  // Determine package tier and validity period
  const desc = (latestPurchase.description || "").toLowerCase();
  const pkgName = String(
    (latestPurchase.metadata as Record<string, unknown> | undefined)
      ?.packageName || "",
  ).toLowerCase();
  const tokens = Number(latestPurchase.amount) || 0;

  let validityDays = 30;
  let isVip = false;
  let tier: DailyAiPlanStatus["tier"] = "starter";
  let matchesMax = 12;

  // Annual Pass: $50 / 6000+ tokens / annual in desc
  if (
    tokens >= 6000 ||
    desc.includes("annual") ||
    pkgName.includes("annual") ||
    desc.includes("50")
  ) {
    validityDays = 365; // 365 Days (Full 1 Year)
    isVip = true;
    tier = "annual";
    matchesMax = 20;
  } else if (
    tokens >= 2000 ||
    desc.includes("ultra") ||
    pkgName.includes("ultra")
  ) {
    validityDays = 30;
    isVip = true;
    tier = "ultra";
    matchesMax = 20;
  } else if (
    tokens >= 1000 ||
    desc.includes("pro") ||
    pkgName.includes("pro")
  ) {
    validityDays = 30;
    isVip = false;
    tier = "pro";
    matchesMax = 15;
  } else {
    validityDays = 30;
    isVip = false;
    tier = "starter";
    matchesMax = 12;
  }

  const purchaseTime = new Date(latestPurchase.createdAt).getTime();
  const validityMs = validityDays * 24 * 60 * 60 * 1000;
  const expiryTime = purchaseTime + validityMs;
  const now = Date.now();

  if (now < expiryTime) {
    const msRemaining = expiryTime - now;
    const daysRemaining = Math.max(
      1,
      Math.ceil(msRemaining / (1000 * 60 * 60 * 24)),
    );
    return {
      hasActivePlan: true,
      isExpired: false,
      isVip,
      tier,
      daysRemaining,
      expiryDate: new Date(expiryTime),
      isLifetime: false,
      matchesMax,
    };
  }

  // Purchase exists but validity period has elapsed: EXPIRED
  return {
    hasActivePlan: false,
    isExpired: true,
    isVip: false,
    tier,
    daysRemaining: 0,
    expiryDate: new Date(expiryTime),
    isLifetime: false,
    matchesMax: 7,
  };
}

/**
 * Checks whether a user has active access to the Daily AI Matches plan.
 * Returns true if the user is an admin or has purchased a package within the last 30 days.
 */
export async function checkUserHasDailyAiPlan(
  userId: string,
  userRole?: string,
): Promise<boolean> {
  const status = await getUserDailyAiMatchesStatus(userId, userRole);
  return status.hasActivePlan;
}
