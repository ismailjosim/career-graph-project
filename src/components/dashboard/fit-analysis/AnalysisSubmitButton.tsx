import { AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import type { AnalysisSubmitButtonProps } from "./types";

export function AnalysisSubmitButton({
  analyzing,
  analysisError,
}: AnalysisSubmitButtonProps) {
  return (
    <div className="space-y-4">
      <button
        type="submit"
        disabled={analyzing}
        className="w-full btn-primary py-4 text-base font-bold shadow-lg hover:shadow-xl group relative overflow-hidden cursor-pointer disabled:opacity-50"
      >
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
          <span>Run AI Fit Analysis & View Report</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>

      {analysisError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-sm text-rose-800 dark:text-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Analysis Failed</p>
            <p className="text-xs mt-0.5">{analysisError}</p>
          </div>
        </div>
      )}
    </div>
  );
}
