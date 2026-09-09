import { AlertTriangle, CheckCircle, Sparkles, TrendingUp } from "lucide-react";
import type { AtsAnalysisResult } from "./types";

interface AtsScoreHeroProps {
  result: AtsAnalysisResult;
  documentName: string;
}

export function AtsScoreHero({ result, documentName }: AtsScoreHeroProps) {
  const getScoreTheme = (score: number) => {
    if (score >= 85) {
      return {
        stroke: "#10b981",
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        border: "border-emerald-200 dark:border-emerald-800/60",
        badge:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
        icon: CheckCircle,
      };
    }
    if (score >= 70) {
      return {
        stroke: "#3b82f6",
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950/40",
        border: "border-blue-200 dark:border-blue-800/60",
        badge:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
        icon: TrendingUp,
      };
    }
    if (score >= 50) {
      return {
        stroke: "#f59e0b",
        text: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/40",
        border: "border-amber-200 dark:border-amber-800/60",
        badge:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
        icon: AlertTriangle,
      };
    }
    return {
      stroke: "#ef4444",
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-800/60",
      badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
      icon: AlertTriangle,
    };
  };

  const theme = getScoreTheme(result.overallScore);
  const StatusIcon = theme.icon;

  // Radial calculation for 100px diameter circle
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (result.overallScore / 100) * circumference;

  return (
    <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-8">
      {/* Radial Gauge */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          className="w-32 h-32 sm:w-36 sm:h-36 -rotate-90 transform"
          viewBox="0 0 100 100"
          aria-label={`Overall ATS score: ${result.overallScore} out of 100`}
        >
          <title>{`Overall ATS score: ${result.overallScore} out of 100`}</title>
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="text-slate-100 dark:text-slate-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={theme.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span
            className={`text-3xl sm:text-4xl font-black tracking-tight ${theme.text}`}
          >
            {result.overallScore}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ATS Score
          </span>
        </div>
      </div>

      {/* Details & Summary */}
      <div className="flex-1 space-y-3 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide inline-flex items-center gap-1.5 ${theme.badge}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{result.badge}</span>
          </span>

          <span className="text-xs text-slate-400">
            Audited document:{" "}
            <strong className="text-slate-700 dark:text-slate-200">
              {documentName}
            </strong>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {result.executiveSummary}
        </p>

        {/* Quick Wins */}
        {result.quickWins && result.quickWins.length > 0 && (
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Top Quick Wins to Boost Your Score:</span>
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              {result.quickWins.map((win) => (
                <li key={win} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
