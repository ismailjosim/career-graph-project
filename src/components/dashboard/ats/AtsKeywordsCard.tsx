import { CheckCircle2, KeyRound, PlusCircle } from "lucide-react";

interface AtsKeywordsCardProps {
  detectedKeywords: string[];
  missingKeywords: string[];
}

export function AtsKeywordsCard({
  detectedKeywords,
  missingKeywords,
}: AtsKeywordsCardProps) {
  return (
    <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <KeyRound className="w-5 h-5 text-indigo-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            ATS Keyword Alignment & Density
          </h2>
          <p className="text-xs text-slate-500">
            Keywords scanned by automated parsing filters compared to market
            benchmarks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detected Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Detected Skills & Proficiencies ({detectedKeywords.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {detectedKeywords.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No specific keywords detected.
              </p>
            ) : (
              detectedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200/60 dark:border-emerald-800/40"
                >
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
            <PlusCircle className="w-4 h-4 text-amber-600" />
            <span>
              Recommended Missing High-Impact Keywords ({missingKeywords.length}
              )
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No crucial missing keywords identified!
              </p>
            ) : (
              missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-200/60 dark:border-amber-800/40"
                >
                  + {kw}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
