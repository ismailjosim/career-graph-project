import { AlignLeft, FileCheck2, KeyRound, TrendingUp } from "lucide-react";
import type { AtsAnalysisResult } from "./types";

interface AtsCategoryBreakdownProps {
  result: AtsAnalysisResult;
}

export function AtsCategoryBreakdown({ result }: AtsCategoryBreakdownProps) {
  const categories = [
    {
      title: "Formatting & Readability",
      score: result.categoryScores.formatting,
      feedback: result.categoryFeedback.formatting,
      icon: AlignLeft,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/60",
      bar: "bg-blue-600",
    },
    {
      title: "Keyword Optimization",
      score: result.categoryScores.keywords,
      feedback: result.categoryFeedback.keywords,
      icon: KeyRound,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/60",
      bar: "bg-indigo-600",
    },
    {
      title: "Content & Measurable Impact",
      score: result.categoryScores.contentImpact,
      feedback: `${result.categoryFeedback.contentImpact} (${result.actionVerbCount} action verbs detected)`,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
      bar: "bg-emerald-600",
    },
    {
      title: "Structure & Completeness",
      score: result.categoryScores.structure,
      feedback: result.categoryFeedback.structure,
      icon: FileCheck2,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/60",
      bar: "bg-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <div
            key={cat.title}
            className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${cat.bg} ${cat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                  {cat.score}%
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {cat.title}
                </h3>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`${cat.bar} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
              {cat.feedback}
            </p>
          </div>
        );
      })}
    </div>
  );
}
