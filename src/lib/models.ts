import mongoose from "mongoose";
import type {
  AnalyticsEvent as IAnalyticsEvent,
  CoverLetter as ICoverLetter,
  JobApplication as IJobApplication,
  JobMarket as IJobMarket,
  JobMatchSuggestion as IJobMatchSuggestion,
  JobPosting as IJobPosting,
  MonthlyStats as IMonthlyStats,
  Resume as IResume,
  ResumeTemplate as IResumeTemplate,
  Review as IReview,
  ScrapedJob as IScrapedJob,
  ScraperRun as IScraperRun,
  Wishlist as IWishlist,
} from "@/lib/validation";

// Resume Template Model (Admin managed dynamic templates)
const resumeTemplateSchema = new mongoose.Schema<IResumeTemplate>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["tech", "creative", "executive", "general"],
      default: "general",
      index: true,
    },
    layoutArchetype: {
      type: String,
      enum: [
        "single_column",
        "sidebar_left",
        "executive_classic",
        "minimal_tech",
      ],
      default: "single_column",
    },
    thumbnailUrl: { type: String },
    badge: { type: String },
    isPro: { type: Boolean, default: false, index: true },
    tokenCost: { type: Number, default: 0 },
    defaultTheme: {
      accentColor: { type: String, default: "#4f46e5" },
      fontFamily: { type: String, default: "sans" },
      layoutDensity: { type: String, default: "normal" },
    },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
    createdBy: { type: String },
  },
  { timestamps: true },
);

if (mongoose.models.ResumeTemplate) {
  delete (mongoose.models as Record<string, unknown>).ResumeTemplate;
}

export const ResumeTemplate =
  mongoose.models.ResumeTemplate ||
  mongoose.model<IResumeTemplate>("ResumeTemplate", resumeTemplateSchema);

// Resume Model
const resumeSchema = new mongoose.Schema<IResume>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String },
    fileSize: { type: Number },
    uploadedAt: { type: Date, default: Date.now },
    isDefault: { type: Boolean, default: false },
    rawText: { type: String },
    isBuiltInApp: { type: Boolean, default: false },
    templateId: { type: String, default: "modern" },
    themeConfig: {
      accentColor: { type: String, default: "#4f46e5" },
      fontFamily: { type: String, default: "sans" },
      layoutDensity: { type: String, default: "normal" },
    },
    builderData: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Resume =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", resumeSchema);

// Cover Letter Model
const coverLetterSchema = new mongoose.Schema<ICoverLetter>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const CoverLetter =
  mongoose.models.CoverLetter ||
  mongoose.model<ICoverLetter>("CoverLetter", coverLetterSchema);

// Job Market Model
const jobMarketSchema = new mongoose.Schema<IJobMarket>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "general",
        "tech",
        "remote",
        "startups",
        "freelance",
        "design",
        "local",
        "other",
      ],
      default: "general",
      index: true,
    },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },
    notes: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5 },
    isFavorite: { type: Boolean, default: false, index: true },
    visitCount: { type: Number, default: 0 },
    savedAt: { type: Date, default: Date.now },
    // Backward compatibility
    title: { type: String },
    company: { type: String },
    source: { type: String },
  },
  { timestamps: true },
);

// In Next.js development, clear cached model so updated schema takes effect immediately
if (mongoose.models.JobMarket) {
  delete (mongoose.models as Record<string, unknown>).JobMarket;
}

export const JobMarket =
  mongoose.models.JobMarket ||
  mongoose.model<IJobMarket>("JobMarket", jobMarketSchema);

// Wishlist Model
const wishlistSchema = new mongoose.Schema<IWishlist>(
  {
    userId: { type: String, required: true, index: true },
    jobMarketId: String,
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    notes: String,
    savedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["saved", "reviewing", "decided"],
      default: "saved",
    },
  },
  { timestamps: true },
);

export const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>("Wishlist", wishlistSchema);

// Job Application Model
const jobApplicationSchema = new mongoose.Schema<IJobApplication>(
  {
    userId: { type: String, required: true, index: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    description: String,
    jobLink: String,
    resumeUsed: { type: String, required: true, ref: "Resume" },
    coverLetterUsed: { type: String, ref: "CoverLetter" },
    fitScore: { type: Number, min: 0, max: 100 },
    notes: String,
    status: {
      type: String,
      enum: [
        "applied",
        "interview_scheduled",
        "interviewed",
        "offer_received",
        "rejected",
        "withdrawn",
      ],
      default: "applied",
    },
    appliedAt: { type: Date, default: Date.now },
    responseAt: Date,
    responseType: {
      type: String,
      enum: ["positive", "negative", "pending"],
    },
    salary: String,
    location: String,
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
    },
  },
  { timestamps: true },
);

// Create indexes for efficient queries
jobApplicationSchema.index({ userId: 1, appliedAt: -1 });

export const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>("JobApplication", jobApplicationSchema);

// Monthly Stats Model
const monthlyStatsSchema = new mongoose.Schema<IMonthlyStats>(
  {
    userId: { type: String, required: true, index: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    totalApplications: { type: Number, default: 0 },
    responsesReceived: { type: Number, default: 0 },
    rejections: { type: Number, default: 0 },
    interviews: { type: Number, default: 0 },
    offers: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

monthlyStatsSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

export const MonthlyStats =
  mongoose.models.MonthlyStats ||
  mongoose.model<IMonthlyStats>("MonthlyStats", monthlyStatsSchema);

// OTP Verification Model
export interface IOtpVerification {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const otpVerificationSchema = new mongoose.Schema<IOtpVerification>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const OtpVerification =
  mongoose.models.OtpVerification ||
  mongoose.model<IOtpVerification>("OtpVerification", otpVerificationSchema);

// Token Package Model
export interface ITokenPackage {
  _id?: string;
  name: string;
  tokens: number;
  price: number; // in USD
  description: string;
  badge?: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  sortOrder: number;
  polarProductId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tokenPackageSchema = new mongoose.Schema<ITokenPackage>(
  {
    name: { type: String, required: true, trim: true },
    tokens: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    badge: { type: String, default: "" },
    features: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    polarProductId: { type: String, trim: true },
  },
  { timestamps: true },
);

if (mongoose.models.TokenPackage) {
  delete (mongoose.models as Record<string, unknown>).TokenPackage;
}

export const TokenPackage =
  mongoose.models.TokenPackage ||
  mongoose.model<ITokenPackage>("TokenPackage", tokenPackageSchema);

// Job Posting Model (Platform-posted jobs by recruiters/admin)
const jobPostingSchema = new mongoose.Schema<IJobPosting>(
  {
    title: { type: String, required: true, trim: true, index: true },
    company: { type: String, required: true, trim: true, index: true },
    companyLogo: { type: String },
    location: { type: String, required: true, trim: true },
    workplaceType: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
      default: "remote",
      index: true,
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      default: "full-time",
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead", "executive"],
      default: "mid",
    },
    salary: { type: String },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    description: { type: String, required: true },
    requirements: { type: [String], required: true, default: [] },
    benefits: { type: [String], default: [] },
    sourcePlatform: {
      type: String,
      enum: ["direct", "linkedin", "indeed", "glassdoor", "other"],
      default: "direct",
      index: true,
    },
    originalJobUrl: { type: String },
    tokenCost: { type: Number, required: true, default: 5 },
    postedBy: { type: String, required: true, index: true },
    posterRole: { type: String, default: "recruiter" },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
      index: true,
    },
    applicantsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    externalClicksCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Search index for Job Postings
jobPostingSchema.index({
  title: "text",
  company: "text",
  location: "text",
  description: "text",
});

if (mongoose.models.JobPosting) {
  delete (mongoose.models as Record<string, unknown>).JobPosting;
}

export const JobPosting =
  mongoose.models.JobPosting ||
  mongoose.model<IJobPosting>("JobPosting", jobPostingSchema);

// Token Transaction Model
export type TokenTransactionType =
  | "signup_bonus"
  | "email_verification_bonus"
  | "package_purchase"
  | "admin_grant"
  | "ats_check"
  | "cover_letter"
  | "fit_analysis"
  | "job_application"
  | "resume_builder";

export interface ITokenTransaction {
  _id?: string;
  userId: string;
  amount: number; // positive (credit) or negative (debit)
  balanceAfter: number;
  type: TokenTransactionType;
  description: string;
  packageId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const tokenTransactionSchema = new mongoose.Schema<ITokenTransaction>(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "signup_bonus",
        "email_verification_bonus",
        "package_purchase",
        "admin_grant",
        "ats_check",
        "cover_letter",
        "fit_analysis",
        "job_application",
      ],
      index: true,
    },
    description: { type: String, default: "" },
    packageId: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

tokenTransactionSchema.index({ userId: 1, createdAt: -1 });
tokenTransactionSchema.index(
  { "metadata.polarCheckoutId": 1 },
  { unique: true, sparse: true },
);

if (mongoose.models.TokenTransaction) {
  delete (mongoose.models as Record<string, unknown>).TokenTransaction;
}

export const TokenTransaction =
  mongoose.models.TokenTransaction ||
  mongoose.model<ITokenTransaction>("TokenTransaction", tokenTransactionSchema);

// Review Model (1 review per user, verified role-based feedback)
const reviewSchema = new mongoose.Schema<IReview>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    authorName: { type: String, required: true, trim: true },
    authorImage: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["job_seeker", "recruiter", "employer"],
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5, index: true },
    content: { type: String, required: true, trim: true },
    headline: { type: String, default: "", trim: true },
    companyOrTarget: { type: String, default: "", trim: true },
    verifiedOutcome: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "featured", "hidden"],
      default: "approved",
      index: true,
    },
    helpfulVotes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

reviewSchema.index({ status: 1, role: 1, createdAt: -1 });

export const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

// Analytics Event Model (telemetry tracking for prints, downloads, and outbound clicks)
const analyticsEventSchema = new mongoose.Schema<IAnalyticsEvent>(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        "resume_download",
        "resume_print",
        "external_job_click",
        "cover_letter_generated",
        "fit_analysis_run",
        "ats_check_run",
      ],
      index: true,
    },
    userId: { type: String, index: true },
    resourceId: { type: String, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

export const AnalyticsEvent =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", analyticsEventSchema);

// Scraped Job Model
const scrapedJobSchema = new mongoose.Schema<IScrapedJob>(
  {
    externalId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    jobType: { type: String, default: "remote" },
    salary: { type: String, default: "Competitive" },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [], index: true },
    source: { type: String, default: "Web Scraper", index: true },
    applyUrl: { type: String, required: true },
    scrapedAt: { type: Date, default: Date.now, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

if (mongoose.models.ScrapedJob) {
  delete (mongoose.models as Record<string, unknown>).ScrapedJob;
}

export const ScrapedJob =
  mongoose.models.ScrapedJob ||
  mongoose.model<IScrapedJob>("ScrapedJob", scrapedJobSchema);

// Daily AI Job Match Suggestion Model (Stores 10-15 matched jobs per user)
const jobMatchSuggestionSchema = new mongoose.Schema<IJobMatchSuggestion>(
  {
    userId: { type: String, required: true, index: true },
    jobId: { type: String, required: true, index: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, default: "Competitive" },
    applyUrl: { type: String, required: true },
    source: { type: String, default: "LinkedIn" },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    matchReason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "viewed", "applied", "saved", "dismissed"],
      default: "new",
      index: true,
    },
    suggestedDate: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

jobMatchSuggestionSchema.index({ userId: 1, suggestedDate: -1 });
jobMatchSuggestionSchema.index({ userId: 1, jobId: 1 }, { unique: true });

if (mongoose.models.JobMatchSuggestion) {
  delete (mongoose.models as Record<string, unknown>).JobMatchSuggestion;
}

export const JobMatchSuggestion =
  mongoose.models.JobMatchSuggestion ||
  mongoose.model<IJobMatchSuggestion>(
    "JobMatchSuggestion",
    jobMatchSuggestionSchema,
  );

// Scraper Run Model (Audit log of Apify scraper executions)
const scraperRunSchema = new mongoose.Schema<IScraperRun>(
  {
    adminId: { type: String, required: true, index: true },
    adminEmail: { type: String },
    platform: {
      type: String,
      required: true,
      enum: ["linkedin", "indeed", "google_jobs", "glassdoor", "all"],
      index: true,
    },
    targetRole: { type: String, required: true, trim: true },
    location: { type: String, default: "Remote" },
    targetCount: { type: Number, default: 50 },
    scrapedCount: { type: Number, default: 0 },
    newJobsCount: { type: Number, default: 0 },
    duplicateCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"],
      default: "queued",
      index: true,
    },
    apifyActorId: { type: String },
    apifyRunId: { type: String },
    apifyDatasetId: { type: String },
    error: { type: String },
    startedAt: { type: Date, default: Date.now, index: true },
    finishedAt: { type: Date },
    durationSeconds: { type: Number },
  },
  { timestamps: true, bufferCommands: false },
);

scraperRunSchema.index({ createdAt: -1 });

if (mongoose.models.ScraperRun) {
  delete (mongoose.models as Record<string, unknown>).ScraperRun;
}

export const ScraperRun =
  mongoose.models.ScraperRun ||
  mongoose.model<IScraperRun>("ScraperRun", scraperRunSchema);
