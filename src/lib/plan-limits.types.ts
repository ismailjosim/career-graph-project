export interface PlanStorageLimits {
  plan: "free" | "pro" | "admin";
  planName: string;
  badge: string;
  resumes: {
    count: number;
    max: number;
    isLimitReached: boolean;
  };
  coverLetters: {
    count: number;
    max: number;
    isLimitReached: boolean;
  };
}

export const DEFAULT_PLAN_CONFIG = {
  free: {
    name: "Free Plan",
    badge: "Free Tier",
    maxResumes: 1,
    maxCoverLetters: 3,
  },
  pro: {
    name: "Pro Plan",
    badge: "Pro Member",
    maxResumes: 5,
    maxCoverLetters: 15,
  },
  admin: {
    name: "Administrator",
    badge: "Unlimited",
    maxResumes: 100,
    maxCoverLetters: 500,
  },
} as const;
