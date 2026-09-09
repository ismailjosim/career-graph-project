import mongoose from "mongoose";
import type {
  CoverLetter as ICoverLetter,
  JobApplication as IJobApplication,
  JobMarket as IJobMarket,
  MonthlyStats as IMonthlyStats,
  Resume as IResume,
  Wishlist as IWishlist,
} from "@/lib/validation";

// Resume Model
const resumeSchema = new mongoose.Schema<IResume>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    isDefault: { type: Boolean, default: false },
    rawText: { type: String },
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
  },
  { timestamps: true },
);

export const TokenPackage =
  mongoose.models.TokenPackage ||
  mongoose.model<ITokenPackage>("TokenPackage", tokenPackageSchema);

// Token Transaction Model
export type TokenTransactionType =
  | "signup_bonus"
  | "email_verification_bonus"
  | "package_purchase"
  | "admin_grant"
  | "ats_check"
  | "cover_letter"
  | "fit_analysis";

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

export const TokenTransaction =
  mongoose.models.TokenTransaction ||
  mongoose.model<ITokenTransaction>("TokenTransaction", tokenTransactionSchema);
