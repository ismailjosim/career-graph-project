import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { SkillsComparisonCardProps } from "./types";

export function SkillsComparisonCard({
  strengths,
  missingSkills,
}: SkillsComparisonCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Key Strengths */}
      <div className="card p-6 border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            Key Candidate Strengths
          </h3>
        </div>

        {strengths.length === 0 ? (
          <p className="text-xs text-slate-500">
            No specific strengths identified.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {strengths.map((s) => (
              <li
                key={s}
                className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Missing Skills & ATS Keywords */}
      <div className="card p-6 border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            Missing Skills & ATS Gaps
          </h3>
        </div>

        {missingSkills.length === 0 ? (
          <p className="text-xs text-slate-500">
            No critical skills gaps detected. Great match!
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Incorporate these keywords into your resume if you have adjacent
              experience:
            </p>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
