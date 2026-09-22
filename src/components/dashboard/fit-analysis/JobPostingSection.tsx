"use client";

import { AlertCircle, Briefcase, Link2, Loader2 } from "lucide-react";
import type { JobPostingSectionProps } from "./types";

export function JobPostingSection({
  jobMode,
  onJobModeChange,
  jobLink,
  onJobLinkChange,
  fetchingJobLink,
  onFetchJobUrl,
  jobLinkError,
  jobInput,
  onJobInputChange,
}: JobPostingSectionProps) {
  return (
    <div className="card p-4 sm:p-6 md:p-7 border border-slate-200 dark:border-slate-800/80 shadow-sm relative overflow-hidden space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              1. Target Job Posting
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste description or fetch from link
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onJobModeChange("paste")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              jobMode === "paste"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Paste Text
          </button>
          <button
            type="button"
            onClick={() => onJobModeChange("link")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
              jobMode === "link"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Job Link</span>
          </button>
        </div>
      </div>

      {/* Link Mode */}
      {jobMode === "link" && (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Job URL (Lever, Greenhouse, Career Site)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="url"
                placeholder="https://company.com/careers/job/..."
                value={jobLink}
                onChange={(e) => onJobLinkChange(e.target.value)}
                className="input pl-10 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={onFetchJobUrl}
              disabled={fetchingJobLink || !jobLink.trim()}
              className="btn-primary px-4 py-2 text-sm shrink-0 w-full sm:w-auto disabled:opacity-50 cursor-pointer"
            >
              {fetchingJobLink ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Fetch Job"
              )}
            </button>
          </div>

          {jobLinkError && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{jobLinkError}</p>
                <button
                  type="button"
                  onClick={() => onJobModeChange("paste")}
                  className="text-blue-600 dark:text-blue-400 font-semibold underline mt-1 block cursor-pointer"
                >
                  Switch to Paste Description &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Job Details Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              value={jobInput.title}
              onChange={(e) =>
                onJobInputChange({ ...jobInput, title: e.target.value })
              }
              className="input text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              placeholder="e.g. Stripe, Airbnb"
              value={jobInput.company}
              onChange={(e) =>
                onJobInputChange({ ...jobInput, company: e.target.value })
              }
              className="input text-sm"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Full Job Description *
            </label>
            <span className="text-[11px] text-slate-400">
              {jobInput.description.length} chars
            </span>
          </div>
          <textarea
            required
            rows={8}
            placeholder="Paste the full job posting text (responsibilities, qualifications, tech stack)..."
            value={jobInput.description}
            onChange={(e) =>
              onJobInputChange({ ...jobInput, description: e.target.value })
            }
            className="input text-sm resize-y leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
