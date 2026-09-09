import { Check, Copy, Layers } from "lucide-react";
import type { ResumeAdjustmentsListProps } from "./types";

export function ResumeAdjustmentsList({
  adjustments,
  onCopyAdjustment,
  copiedKey,
  onCopyAll,
  copiedAll,
}: ResumeAdjustmentsListProps) {
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900/50";
      case "medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/50";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900/50";
    }
  };

  return (
    <div className="card p-6 sm:p-8 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Resume Tailoring Recommendations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Targeted bullet point improvements based on this specific job
              description
            </p>
          </div>
        </div>

        {adjustments.length > 0 && (
          <button
            type="button"
            onClick={onCopyAll}
            className="btn-outline text-xs py-1.5 px-3 self-start sm:self-auto cursor-pointer"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All Suggestions</span>
              </>
            )}
          </button>
        )}
      </div>

      {adjustments.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          No specific resume adjustments suggested. Your resume is already
          well-aligned!
        </div>
      ) : (
        <div className="space-y-4">
          {adjustments.map((adj) => {
            const key = `${adj.section}-${adj.impact}-${adj.issue.slice(0, 20)}`;
            const isCopied = copiedKey === key;

            return (
              <div
                key={key}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      {adj.section}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${getImpactBadge(
                        adj.impact,
                      )}`}
                    >
                      {adj.impact} Impact
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onCopyAdjustment(adj.suggestion, key)}
                    className="text-xs font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition cursor-pointer"
                    title="Copy suggestion"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">
                          Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Suggestion</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs space-y-1.5">
                  <p className="text-rose-600 dark:text-rose-400 font-medium">
                    <strong>Issue:</strong> {adj.issue}
                  </p>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs leading-relaxed">
                    <strong>Recommended Bullet:</strong> {adj.suggestion}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
