import { CheckCircle2, Clock, Star, XCircle } from "lucide-react";
import type { ReviewMetrics } from "./admin-reviews.types";

interface AdminReviewsStatsProps {
  metrics: ReviewMetrics;
}

export function AdminReviewsStats({ metrics }: AdminReviewsStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* Total Feedback */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Total Feedback
        </span>
        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-space-grotesk">
          {metrics.total}
        </div>
        <span className="text-[11px] text-slate-400">All-time submissions</span>
      </div>

      {/* Pending Moderation */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Pending Action
          </span>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-space-grotesk">
          {metrics.pending}
        </div>
        <span className="text-[11px] text-slate-400">Awaiting approval</span>
      </div>

      {/* Approved Reviews */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Live / Approved
          </span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-space-grotesk">
          {metrics.approved}
        </div>
        <span className="text-[11px] text-slate-400">
          Visible on landing page
        </span>
      </div>

      {/* Rejected Reviews */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800/60 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-red-600 dark:text-red-400">
            Rejected / Hidden
          </span>
          <XCircle className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1 font-space-grotesk">
          {metrics.rejected}
        </div>
        <span className="text-[11px] text-slate-400">Filtered from public</span>
      </div>

      {/* Average Rating */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Average Score
          </span>
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-space-grotesk">
          {metrics.averageRating.toFixed(1)} / 5.0
        </div>
        <span className="text-[11px] text-slate-400">Overall sentiment</span>
      </div>
    </div>
  );
}
