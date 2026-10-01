import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { FitAnalysisHeaderProps } from "./types";

export function FitAnalysisHeader({ previousResult }: FitAnalysisHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition cursor-pointer"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              AI Job Fit Analysis
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xs shrink-0">
              <Sparkles className="w-3 h-3" />
              AI Engine
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Match your resume against any job description. Get tailored bullet
            adjustments and an application recommendation on the next page.
          </p>
        </div>
      </div>

      {previousResult && (
        <Link
          href="/fit-analysis/result"
          className="btn-outline text-xs py-2 px-3.5 flex items-center gap-2 border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            Last Result: <strong>{previousResult.fitScore}%</strong> (
            {previousResult.jobTitle})
          </span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}
