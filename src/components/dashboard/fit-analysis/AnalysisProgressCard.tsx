import { Sparkles } from "lucide-react";
import type { AnalysisProgressCardProps } from "./types";

export function AnalysisProgressCard({
  currentStepIndex,
  steps,
}: AnalysisProgressCardProps) {
  const percent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="card p-8 text-center border-2 border-indigo-500/40 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-lg space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md animate-spin">
        <Sparkles className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Analyzing Fit & Auditing Resume...
        </h3>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold min-h-5">
          {steps[currentStepIndex]}
        </p>
      </div>

      <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-linear-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-[11px] text-slate-400">
        You will be automatically redirected to your full Analysis Report page
        when complete.
      </p>
    </div>
  );
}
