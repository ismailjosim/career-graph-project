import {
  Briefcase,
  Building2,
  CheckCircle2,
  Coins,
  DollarSign,
  FileCheck2,
  FileText,
  Heart,
  MapPin,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { JobPosting } from "@/lib/validation";

interface JobHeroCardProps {
  job: JobPosting;
  tokens: number;
  isSaved: boolean;
  hasApplied: boolean;
  existingApplicationId: string | null;
  onApplyClick: () => void;
  onSaveToggle: () => void;
  onShare: () => void;
  onCreateCoverLetter: () => void;
  onTailorResume: () => void;
}

export function JobHeroCard({
  job,
  tokens,
  isSaved,
  hasApplied,
  existingApplicationId,
  onApplyClick,
  onSaveToggle,
  onShare,
  onCreateCoverLetter,
  onTailorResume,
}: JobHeroCardProps) {
  const tokenCost = job.tokenCost || 5;

  return (
    <div className="card p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0 overflow-hidden">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={job.company}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              job.company.charAt(0).toUpperCase()
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 uppercase tracking-wide">
                {job.sourcePlatform === "direct"
                  ? "Platform Direct"
                  : job.sourcePlatform}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                {job.workplaceType}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                {job.employmentType}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-200">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{job.company}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{job.location}</span>
              </div>

              {job.salary && (
                <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="w-4 h-4 shrink-0" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Token Fee Box */}
        <div className="w-full sm:w-auto p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-center sm:text-right shrink-0 space-y-1">
          <div className="flex items-center justify-center sm:justify-end gap-1.5 text-amber-700 dark:text-amber-300 font-extrabold text-lg sm:text-xl">
            <Coins className="w-5 h-5 text-amber-500" />
            <span>{tokenCost} Tokens</span>
          </div>
          <div className="text-[11px] text-amber-800/80 dark:text-amber-300/80 font-medium">
            Base 5 + {job.requirements?.length || 0} requirements
          </div>
          <div className="text-[10px] text-slate-500 pt-1">
            Your balance:{" "}
            <strong className="text-slate-700 dark:text-slate-300">
              {tokens} tokens
            </strong>
          </div>
        </div>
      </div>

      {/* 5 Main Action Buttons Bar */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Left Action Buttons: Apply, Save, Share */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {hasApplied ? (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Application Submitted</span>
              {existingApplicationId && (
                <Link
                  href={`/applications/${existingApplicationId}`}
                  className="underline text-emerald-800 dark:text-emerald-200 ml-1"
                >
                  View Status →
                </Link>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onApplyClick}
              className="btn-primary text-xs sm:text-sm py-2.5 px-6 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Apply for Job ({tokenCost} Tokens)</span>
            </button>
          )}

          {/* Save Job Button */}
          <button
            type="button"
            onClick={onSaveToggle}
            className={`btn-outline text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 cursor-pointer transition-colors ${
              isSaved
                ? "border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/40 text-rose-600"
                : ""
            }`}
            title={isSaved ? "Saved in your wishlist" : "Save to wishlist"}
          >
            <Heart
              className={`w-4 h-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`}
            />
            <span>{isSaved ? "Saved" : "Save Job"}</span>
          </button>

          {/* Share Job Button */}
          <button
            type="button"
            onClick={onShare}
            className="btn-outline text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 cursor-pointer"
            title="Share this job opportunity"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Right Action Buttons: Tailored Cover Letter & Tailored Resume */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Create Cover Letter Button */}
          <button
            type="button"
            onClick={onCreateCoverLetter}
            className="btn-secondary text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 cursor-pointer text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
            title="Generate tailored cover letter pre-filled with this job"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Create Cover Letter</span>
          </button>

          {/* Tailor Resume Button */}
          <button
            type="button"
            onClick={onTailorResume}
            className="btn-secondary text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 cursor-pointer text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            title="Analyze resume fit and tailor keywords for this job"
          >
            <FileCheck2 className="w-4 h-4 text-blue-500" />
            <span>Tailor Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
}
