import { z } from "zod";

// Resume Schema
export const resumeSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1, "Resume name is required"),
  fileName: z.string(),
  fileUrl: z.string().url(),
  uploadedAt: z.date().default(() => new Date()),
  isDefault: z.boolean().default(false),
  rawText: z.string().optional(),
});

export type Resume = z.infer<typeof resumeSchema>;

// Cover Letter Schema
export const coverLetterSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1, "Cover letter title is required"),
  content: z.string().min(10, "Cover letter must be at least 10 characters"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type CoverLetter = z.infer<typeof coverLetterSchema>;

// Job Market Schema (marketplace directories & boards)
export const jobMarketSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1, "Marketplace name is required"),
  link: z.string().url("Must be a valid URL"),
  category: z
    .enum([
      "general",
      "tech",
      "remote",
      "startups",
      "freelance",
      "design",
      "local",
      "other",
    ])
    .default("general"),
  description: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional().default(""),
  rating: z.number().min(1).max(5).optional(),
  isFavorite: z.boolean().default(false),
  visitCount: z.number().default(0),
  savedAt: z.date().default(() => new Date()),
  // Backward compatibility fields
  title: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
});

export type JobMarket = z.infer<typeof jobMarketSchema>;

// Wishlist Schema (saved jobs for later review)
export const wishlistSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  jobMarketId: z.string().optional(),
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  description: z.string(),
  link: z.string().url("Must be a valid URL"),
  notes: z.string().optional(),
  savedAt: z.date().default(() => new Date()),
  status: z.enum(["saved", "reviewing", "decided"]).default("saved"),
});

export type Wishlist = z.infer<typeof wishlistSchema>;

// Job Application Schema
export const jobApplicationSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
  jobLink: z.string().url().optional(),
  resumeUsed: z.string(), // Resume ID
  coverLetterUsed: z.string().optional(), // Cover Letter ID
  fitScore: z.number().min(0).max(100).optional(), // 0-100 percentage
  notes: z.string().optional(),
  status: z
    .enum([
      "applied",
      "interview_scheduled",
      "interviewed",
      "offer_received",
      "rejected",
      "withdrawn",
    ])
    .default("applied"),
  appliedAt: z.date().default(() => new Date()),
  responseAt: z.date().optional(),
  responseType: z.enum(["positive", "negative", "pending"]).optional(),
  salary: z.string().optional(),
  location: z.string().optional(),
  employmentType: z
    .enum(["full-time", "part-time", "contract", "internship"])
    .optional(),
});

export type JobApplication = z.infer<typeof jobApplicationSchema>;

// Monthly Stats Schema (for caching/analytics)
export const monthlyStatsSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  year: z.number(),
  month: z.number().min(1).max(12),
  totalApplications: z.number().default(0),
  responsesReceived: z.number().default(0),
  rejections: z.number().default(0),
  interviews: z.number().default(0),
  offers: z.number().default(0),
  updatedAt: z.date().default(() => new Date()),
});

export type MonthlyStats = z.infer<typeof monthlyStatsSchema>;

// User Roles & Management Schemas
export const USER_ROLES = [
  "super_admin",
  "admin",
  "job_seeker",
  "recruiter",
  "employer",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["active", "inactive", "blocked"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const updateUserRoleSchema = z.object({
  role: z.enum(USER_ROLES),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(USER_ROLES).optional(),
  status: z.enum(USER_STATUSES).optional(),
  emailVerified: z.boolean().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().optional(), // Target job title e.g. "Senior Full Stack Engineer"
  bio: z.string().optional(), // Professional summary / pitch
  skills: z.union([z.array(z.string()), z.string()]).optional(),
  website: z.string().url().or(z.literal("")).optional(),
  linkedin: z.string().url().or(z.literal("")).optional(),
  experience: z.string().optional(), // e.g. "5+ years building distributed React/Node apps"
  education: z.string().optional(), // e.g. "B.S. in Computer Science"
  isProfileComplete: z.boolean().optional(),
});

export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

// Job Posting Source Platforms
export const JOB_SOURCE_PLATFORMS = [
  "direct",
  "linkedin",
  "indeed",
  "glassdoor",
  "other",
] as const;
export type JobSourcePlatform = (typeof JOB_SOURCE_PLATFORMS)[number];

export const WORKPLACE_TYPES = ["remote", "hybrid", "onsite"] as const;
export type WorkplaceType = (typeof WORKPLACE_TYPES)[number];

export const EXPERIENCE_LEVELS = [
  "entry",
  "mid",
  "senior",
  "lead",
  "executive",
] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

/**
 * Calculates dynamic token cost for applying to a job based on requirement density.
 * Base 5 tokens + 1 token per requirement (minimum 5).
 */
export function calculateJobTokenCost(requirements: string[]): number {
  const count = Array.isArray(requirements)
    ? requirements.filter((r) => r.trim().length > 0).length
    : 0;
  return Math.max(5, 5 + count);
}

// Job Posting Validation Schema
export const jobPostingSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(2, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  companyLogo: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  workplaceType: z.enum(WORKPLACE_TYPES).default("remote"),
  employmentType: z
    .enum(["full-time", "part-time", "contract", "internship"])
    .default("full-time"),
  experienceLevel: z.enum(EXPERIENCE_LEVELS).default("mid"),
  salary: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  description: z
    .string()
    .min(20, "Job description must be at least 20 characters"),
  requirements: z
    .array(z.string().min(1))
    .min(1, "At least one requirement is required"),
  benefits: z.array(z.string()).default([]),
  sourcePlatform: z.enum(JOB_SOURCE_PLATFORMS).default("direct"),
  originalJobUrl: z.string().url().or(z.literal("")).optional(),
  tokenCost: z.number().min(1).optional(),
  postedBy: z.string(),
  posterRole: z.string().default("recruiter"),
  status: z.enum(["active", "closed"]).default("active"),
  applicantsCount: z.number().default(0),
  viewsCount: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type JobPosting = z.infer<typeof jobPostingSchema>;
