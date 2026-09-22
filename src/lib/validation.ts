import { z } from "zod";

// Resume Builder Schemas
export const resumePersonalInfoSchema = z.object({
  fullName: z.string().default(""),
  headline: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  website: z.string().default(""),
  linkedin: z.string().default(""),
  github: z.string().default(""),
});

export const resumeExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().default(""),
  highlights: z.array(z.string()).default([]),
});

export const resumeEducationItemSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.string().optional(),
});

export const resumeSkillGroupSchema = z.object({
  category: z.string(),
  skills: z.array(z.string()),
});

export const resumeProjectItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  role: z.string().optional(),
  link: z.string().optional(),
  github: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  description: z.string().default(""),
  highlights: z.array(z.string()).default([]),
});

export const resumeCertificationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string().optional(),
  url: z.string().optional(),
});

export const resumeThemeConfigSchema = z.object({
  accentColor: z.string().default("#4f46e5"),
  fontFamily: z.enum(["sans", "serif", "mono"]).default("sans"),
  layoutDensity: z.enum(["compact", "normal", "spacious"]).default("normal"),
});

export const resumeBuilderDataSchema = z.object({
  personalInfo: resumePersonalInfoSchema,
  summary: z.string().default(""),
  experiences: z.array(resumeExperienceItemSchema).default([]),
  educations: z.array(resumeEducationItemSchema).default([]),
  skillGroups: z.array(resumeSkillGroupSchema).default([]),
  projects: z.array(resumeProjectItemSchema).default([]),
  certifications: z.array(resumeCertificationItemSchema).default([]),
});

// Resume Schema
export const resumeSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1, "Resume name is required"),
  fileName: z.string(),
  fileUrl: z.string(),
  cloudinaryPublicId: z.string().optional(),
  fileSize: z.number().optional(),
  uploadedAt: z.date().default(() => new Date()),
  isDefault: z.boolean().default(false),
  rawText: z.string().optional(),
  isBuiltInApp: z.boolean().default(false),
  templateId: z.string().default("modern"),
  themeConfig: resumeThemeConfigSchema.optional(),
  builderData: resumeBuilderDataSchema.optional(),
});

export type Resume = z.infer<typeof resumeSchema>;
export type ResumeBuilderData = z.infer<typeof resumeBuilderDataSchema>;
export type ResumePersonalInfo = z.infer<typeof resumePersonalInfoSchema>;
export type ResumeExperienceItem = z.infer<typeof resumeExperienceItemSchema>;
export type ResumeEducationItem = z.infer<typeof resumeEducationItemSchema>;
export type ResumeSkillGroup = z.infer<typeof resumeSkillGroupSchema>;
export type ResumeProjectItem = z.infer<typeof resumeProjectItemSchema>;
export type ResumeCertificationItem = z.infer<
  typeof resumeCertificationItemSchema
>;
export type ResumeThemeConfig = z.infer<typeof resumeThemeConfigSchema>;

// Resume Template Schema (for dynamic templates managed by Admin)
export const resumeTemplateSchema = z.object({
  _id: z.string().optional(),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens"),
  name: z.string().min(2, "Template name is required"),
  subtitle: z.string().default(""),
  description: z.string().default(""),
  category: z
    .enum(["tech", "creative", "executive", "general"])
    .default("general"),
  layoutArchetype: z
    .enum([
      "single_column",
      "sidebar_left",
      "executive_classic",
      "minimal_tech",
    ])
    .default("single_column"),
  thumbnailUrl: z.string().optional(),
  badge: z.string().optional(),
  isPro: z.boolean().default(false),
  tokenCost: z.number().min(0).default(0),
  defaultTheme: resumeThemeConfigSchema.default({
    accentColor: "#4f46e5",
    fontFamily: "sans",
    layoutDensity: "normal",
  }),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
  createdBy: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type ResumeTemplate = z.infer<typeof resumeTemplateSchema>;

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

// Experience Ranges (Industry Standard)
export const EXPERIENCE_RANGES = [
  "0 - 1 year",
  "1 - 3 years",
  "3 - 5 years",
  "5 - 7 years",
  "7 - 10 years",
  "10+ years",
] as const;
export type ExperienceRange = (typeof EXPERIENCE_RANGES)[number];

// Structured Education Entry Schema
export const educationEntrySchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree / Qualification is required"),
  fieldOfStudy: z.string().optional().default(""),
  startYear: z.string().optional().default(""),
  endYear: z.string().optional().default(""),
  credits: z.string().optional().default(""),
  grade: z.string().optional().default(""),
  activities: z.string().optional().default(""),
});
export type EducationEntry = z.infer<typeof educationEntrySchema>;

// Structured Technical Skill with Years of Experience Schema
export const technicalSkillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required"),
  yearsOfExperience: z.union([z.string(), z.number()]),
  proficiency: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .optional()
    .default("intermediate"),
});
export type TechnicalSkill = z.infer<typeof technicalSkillSchema>;

export const updateUserProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(USER_ROLES).optional(),
  status: z.enum(USER_STATUSES).optional(),
  emailVerified: z.boolean().optional(),
  image: z.string().url().or(z.literal("")).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().optional(), // Target job title e.g. "Senior Full Stack Engineer"
  bio: z.string().optional(), // Professional summary / pitch
  skills: z.union([z.array(z.string()), z.string()]).optional(),
  technicalSkills: z
    .union([z.array(technicalSkillSchema), z.string()])
    .optional(),
  website: z.string().url().or(z.literal("")).optional(),
  linkedin: z.string().url().or(z.literal("")).optional(),
  experience: z.string().optional(), // e.g. "3 - 5 years"
  education: z.union([z.array(educationEntrySchema), z.string()]).optional(),
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
  externalClicksCount: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type JobPosting = z.infer<typeof jobPostingSchema>;

// Analytics Telemetry Schema
export const ANALYTICS_EVENT_TYPES = [
  "resume_download",
  "resume_print",
  "external_job_click",
  "cover_letter_generated",
  "fit_analysis_run",
  "ats_check_run",
] as const;
export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export const analyticsEventSchema = z.object({
  _id: z.string().optional(),
  eventType: z.enum(ANALYTICS_EVENT_TYPES),
  userId: z.string().optional(),
  resourceId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date().default(() => new Date()),
});
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

// Review Validation Schemas
export const REVIEW_ROLES = ["job_seeker", "recruiter", "employer"] as const;
export type ReviewRole = (typeof REVIEW_ROLES)[number];

export const REVIEW_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "featured",
  "hidden",
] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const submitReviewSchema = z.object({
  role: z.enum(REVIEW_ROLES, {
    message: "Role must be job_seeker, recruiter, or employer",
  }),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  content: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters long")
    .max(600, "Review cannot exceed 600 characters"),
  headline: z.string().trim().max(100).optional().default(""),
  companyOrTarget: z.string().trim().max(100).optional().default(""),
  verifiedOutcome: z.string().trim().max(120).optional().default(""),
  tags: z.array(z.string().trim()).max(5).default([]),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

export const reviewSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  authorName: z.string(),
  authorImage: z.string().optional(),
  role: z.enum(REVIEW_ROLES),
  rating: z.number().int().min(1).max(5),
  content: z.string(),
  headline: z.string().default(""),
  companyOrTarget: z.string().default(""),
  verifiedOutcome: z.string().default(""),
  tags: z.array(z.string()).default([]),
  status: z.enum(REVIEW_STATUSES).default("approved"),
  helpfulVotes: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Review = z.infer<typeof reviewSchema>;
