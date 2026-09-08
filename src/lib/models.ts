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
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    source: {
      type: String,
      enum: ["linkedin", "indeed", "glassdoor", "other"],
      default: "other",
    },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

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
