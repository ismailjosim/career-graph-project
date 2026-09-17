"use client";

import {
  ArrowRight,
  Building2,
  Coins,
  DollarSign,
  ExternalLink,
  Heart,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { JobCardProps } from "./types";

export function JobCard({
  job,
  onApply,
  onSaveToggle,
  isSaved = false,
  hasApplied = false,
}: JobCardProps) {
  const [clicksCount, setClicksCount] = useState(job.externalClicksCount || 0);

  const handleExternalClick = () => {
    setClicksCount((prev) => prev + 1);
    if (job._id) {
      fetch(`/api/jobs/${job._id}/click`, {
        method: "POST",
        keepalive: true,
      }).catch(() => {});
    }
  };
  const getSourceBadge = (source: string) => {
    switch (source) {
      case "linkedin":
        return {
          label: "LinkedIn",
          class:
            "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40",
        };
      case "indeed":
        return {
          label: "Indeed",
          class:
            "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40",
        };
      case "glassdoor":
        return {
          label: "Glassdoor",
          class:
            "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
        };
      default:
        return {
          label: "Direct Platform",
          class:
            "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/40",
        };
    }
  };

  const sourceBadge = getSourceBadge(job.sourcePlatform);
  const tokenCost = job.tokenCost || 5;

  return (
    <div className="card p-5 sm:p-6 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all group relative">
      <div>
        {/* Top bar: Source badge, Workplace type & Save Button */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${sourceBadge.class}`}
            >
              {sourceBadge.label}
            </span>

            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
              {job.workplaceType}
            </span>

            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
              {job.employmentType}
            </span>
          </div>

          {onSaveToggle && (
            <button
              type="button"
              onClick={() => onSaveToggle(job)}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isSaved
                  ? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/60 text-rose-600"
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600"
              }`}
              title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart
                className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                  isSaved ? "fill-rose-500 text-rose-500" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Company Logo & Job Title */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0 overflow-hidden">
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

          <div className="min-w-0 flex-1">
            <Link
              href={`/jobs/${job._id}`}
              className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 group-hover:text-blue-600"
            >
              {job.title}
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                {job.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5 truncate">
                <MapPin className="w-3 h-3 shrink-0" />
                {job.location}
              </span>
            </div>
          </div>
        </div>

        {/* Salary & Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mb-3.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {job.salary ? (
            <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <span>{job.salary}</span>
            </div>
          ) : (
            <span className="text-slate-400">Salary negotiable</span>
          )}

          <span className="capitalize text-slate-400">•</span>
          <span className="capitalize">{job.experienceLevel} Level</span>

          {job.originalJobUrl && (
            <a
              href={job.originalJobUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleExternalClick}
              className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 ml-auto text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              title={`View on ${job.sourcePlatform} (${clicksCount} clicks)`}
            >
              <span>{job.sourcePlatform}</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-100/70 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                {clicksCount} clicks
              </span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Requirements Tags Preview */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {job.requirements.slice(0, 4).map((req) => (
              <span
                key={req}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate max-w-[140px]"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                +{job.requirements.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer: Token Cost Pill & Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Token Cost Pill */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold shrink-0"
          title={`Applying requires ${tokenCost} tokens (${job.requirements.length} requirements)`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>{tokenCost} Tokens</span>
        </div>

        <div className="flex items-center gap-2">
          {hasApplied ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              ✓ Applied
            </span>
          ) : onApply ? (
            <button
              type="button"
              onClick={() => onApply(job)}
              className="btn-primary text-xs py-1.5 px-3.5 shadow-sm cursor-pointer"
            >
              <span>Apply</span>
            </button>
          ) : null}

          <Link
            href={`/jobs/${job._id}`}
            className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer font-semibold"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
