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

// Job Market Schema (external job posts)
export const jobMarketSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  description: z.string(),
  link: z.string().url("Must be a valid URL"),
  source: z.enum(["linkedin", "indeed", "glassdoor", "other"]),
  savedAt: z.date().default(() => new Date()),
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
  status: z
    .enum(["saved", "reviewing", "decided"])
    .default("saved"),
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
  responseType: z
    .enum(["positive", "negative", "pending"])
    .optional(),
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
