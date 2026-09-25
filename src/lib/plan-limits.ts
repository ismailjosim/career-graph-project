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
