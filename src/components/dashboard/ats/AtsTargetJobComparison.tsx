"use client";

import { Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import type { AtsTargetJob } from "./types";

interface AtsTargetJobComparisonProps {
  showTargetJob: boolean;
  onToggleTargetJob: () => void;
  targetJob: AtsTargetJob;
  onTargetJobChange: (target: AtsTargetJob) => void;
}

export function AtsTargetJobComparison({
  showTargetJob,
  onToggleTargetJob,
  targetJob,
  onTargetJobChange,
}: AtsTargetJobComparisonProps) {
  return (
    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
      <button
        type="button"
        onClick={onToggleTargetJob}
        className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-slate-400" />
          <span>
            Target Job Comparison (Optional) &mdash; Tailor ATS Score to
            Specific Role
          </span>
        </span>
        {showTargetJob ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {showTargetJob && (
        <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in">
          <div>
            <label
              htmlFor="target-job-title-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              Target Job Title
            </label>
            <input
              id="target-job-title-input"
              type="text"
              placeholder="e.g. Senior Frontend Engineer or Product Manager"
              value={targetJob.title}
              onChange={(e) =>
                onTargetJobChange({ ...targetJob, title: e.target.value })
              }
              className="input text-xs"
            />
          </div>
          <div>
            <label
              htmlFor="target-job-desc-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              Target Job Description
            </label>
            <textarea
              id="target-job-desc-input"
              rows={3}
              placeholder="Paste the job posting description to check exact keyword matches and role requirements..."
              value={targetJob.description}
              onChange={(e) =>
                onTargetJobChange({
                  ...targetJob,
                  description: e.target.value,
                })
              }
              className="input text-xs resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
