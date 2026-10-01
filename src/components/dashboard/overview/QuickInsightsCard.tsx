import { Award } from "lucide-react";
import type { QuickInsightsCardProps } from "./types";

export function QuickInsightsCard({ metrics }: QuickInsightsCardProps) {
  return (
    <div className="card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Quick Insights</span>
          </h3>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Live Stats
          </span>
        </div>

        <div className="space-y-4">
          {/* Response Rate */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Response Rate
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {metrics.responseRate}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-linear-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(metrics.responseRate, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {metrics.positiveResponses + metrics.rejections} of{" "}
              {metrics.total} employers replied
            </p>
          </div>

          {/* Interview Conversion Rate */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Interview Rate
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {metrics.interviewRate}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-linear-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(metrics.interviewRate, 100)}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {metrics.interviews} interviews secured
            </p>
          </div>

          {/* Offer Rate */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Offer Rate
              </span>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {metrics.offerRate}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-linear-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(metrics.offerRate, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {metrics.offers} job {metrics.offers === 1 ? "offer" : "offers"}{" "}
              received
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">Status</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Tracker
        </span>
      </div>
    </div>
  );
}
