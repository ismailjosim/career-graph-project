"use client";

import { BookmarkPlus, Check, Loader2 } from "lucide-react";
import type { QuickApplyBannerProps } from "./types";

export function QuickApplyBanner({
  onApply,
  applying,
  appliedSuccess,
}: QuickApplyBannerProps) {
  return (
    <div className="card p-6 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
          <BookmarkPlus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Track this Job in your Pipeline
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Save this job posting and its AI fit score directly into your job
            applications tracker.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onApply}
        disabled={applying || appliedSuccess}
        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
          appliedSuccess
            ? "bg-emerald-600 text-white shadow-xs"
            : "btn-primary shadow-sm"
        }`}
      >
        {applying ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Adding to Tracker...</span>
          </>
        ) : appliedSuccess ? (
          <>
            <Check className="w-4 h-4" />
            <span>Added to Applications!</span>
          </>
        ) : (
          <>
            <BookmarkPlus className="w-4 h-4" />
            <span>Add to Applications Tracker</span>
          </>
        )}
      </button>
    </div>
  );
}
