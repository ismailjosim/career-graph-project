"use client";

import { Building2, ExternalLink, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import type { JobPosting } from "@/lib/validation";

interface JobDetailSidebarProps {
  job: JobPosting;
  onTrackClick: () => void;
  onTailorResume: () => void;
}

export function JobDetailSidebar({
  job,
  onTrackClick,
  onTailorResume,
}: JobDetailSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Company Information Card */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-500" />
          <span>Company Information</span>
        </h3>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden shadow-xs">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={job.company}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              job.company.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
              {job.company}
            </h4>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Workplace Model</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {job.workplaceType}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Listed Via</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {job.sourcePlatform === "direct"
                ? "Career Graph Portal"
                : job.sourcePlatform}
            </span>
          </div>
          {job.salary && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Salary Range</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {job.salary}
              </span>
            </div>
          )}
          {job.originalJobUrl && (
            <div className="pt-2">
              <a
                href={job.originalJobUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onTrackClick}
                className="btn-outline w-full text-xs py-2 flex items-center justify-center gap-1.5"
              >
                <span>View on {job.sourcePlatform}</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-100/70 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                  {job.externalClicksCount || 0} clicks
                </span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Job Overview Summary */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
          Job Overview
        </h3>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Employment Type</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {job.employmentType}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Workplace Type</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {job.workplaceType}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Experience Level</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {job.experienceLevel} Level
            </span>
          </div>

          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Source Platform</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {job.sourcePlatform}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Date Posted</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Applications</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {job.applicantsCount || 0} Candidates
            </span>
          </div>
        </div>
      </div>

      {/* Quick AI Match Upsell */}
      <div className="card p-6 bg-linear-to-br from-indigo-500/10 via-blue-500/10 to-cyan-500/10 border border-indigo-500/20 space-y-3 text-center">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
          Check Your Fit Score First?
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Compare your resume against this job description before applying to
          maximize interview probability.
        </p>
        <button
          type="button"
          onClick={onTailorResume}
          className="btn-primary w-full text-xs py-2 cursor-pointer font-bold shadow-xs"
        >
          Run AI Fit Match
        </button>
      </div>
    </div>
  );
}
