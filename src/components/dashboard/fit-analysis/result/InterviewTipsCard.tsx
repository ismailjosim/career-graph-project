import { Award } from "lucide-react";
import type { InterviewTipsCardProps } from "./types";

export function InterviewTipsCard({ tips }: InterviewTipsCardProps) {
  if (tips.length === 0) return null;

  return (
    <div className="card p-6 sm:p-7 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Strategic Interview Preparation Tips
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Likely focus areas and behavioral talking points for this position
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {tips.map((tip, idx) => (
          <div
            key={tip}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-3"
          >
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <span className="leading-relaxed">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
