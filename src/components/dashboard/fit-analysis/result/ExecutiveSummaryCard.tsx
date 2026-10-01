import { Sparkles } from "lucide-react";
import type { ExecutiveSummaryCardProps } from "./types";

export function ExecutiveSummaryCard({ summary }: ExecutiveSummaryCardProps) {
  return (
    <div className="card p-6 sm:p-7 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>Executive Summary</span>
      </h3>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {summary}
      </p>
    </div>
  );
}
