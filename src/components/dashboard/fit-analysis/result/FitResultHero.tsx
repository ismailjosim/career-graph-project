import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { FitResultHeroProps } from "./types";

export function FitResultHero({ result }: FitResultHeroProps) {
  const getVerdictStyle = (decision: string) => {
    switch (decision) {
      case "strongly_recommended":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
          badge: "bg-emerald-500 text-white",
          icon: CheckCircle2,
          iconColor: "text-emerald-500",
          glow: "shadow-emerald-500/10",
        };
      case "recommended":
        return {
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300",
          badge: "bg-blue-600 text-white",
          icon: Sparkles,
          iconColor: "text-blue-500",
          glow: "shadow-blue-500/10",
        };
      case "proceed_with_caution":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
          badge: "bg-amber-500 text-white",
          icon: AlertTriangle,
          iconColor: "text-amber-500",
          glow: "shadow-amber-500/10",
        };
      default:
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300",
          badge: "bg-rose-600 text-white",
          icon: AlertCircle,
          iconColor: "text-rose-500",
          glow: "shadow-rose-500/10",
        };
    }
  };

  const verdictStyle = getVerdictStyle(result.verdict.decision);
  const VerdictIcon = verdictStyle.icon;

  return (
    <div
      className={`card p-6 sm:p-8 border-2 ${verdictStyle.bg} ${verdictStyle.glow} relative overflow-hidden`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Verdict Text Details */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs ${verdictStyle.badge}`}
            >
              {result.verdict.badge}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Official Recommendation
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <VerdictIcon
              className={`w-8 h-8 ${verdictStyle.iconColor} shrink-0`}
            />
            <span>Should I Apply?</span>
          </h2>

          <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed max-w-2xl">
            {result.verdict.rationale}
          </p>
        </div>

        {/* Large Metric Gauge */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md shrink-0 min-w-45 w-full sm:w-auto">
          <div className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-baseline">
            {result.fitScore}
            <span className="text-3xl text-blue-600 dark:text-blue-400 font-bold ml-1">
              %
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider">
            Overall Fit Match
          </span>
        </div>
      </div>

      {/* 3 Metric Breakdown Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300">
              Technical Skills Match
            </span>
            <span className="text-slate-900 dark:text-slate-100">
              {result.scoreBreakdown.skillsMatch}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${result.scoreBreakdown.skillsMatch}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300">
              Experience & Seniority
            </span>
            <span className="text-slate-900 dark:text-slate-100">
              {result.scoreBreakdown.experienceMatch}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${result.scoreBreakdown.experienceMatch}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300">
              Core Requirements
            </span>
            <span className="text-slate-900 dark:text-slate-100">
              {result.scoreBreakdown.requirementsMatch}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-700"
              style={{
                width: `${result.scoreBreakdown.requirementsMatch}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
