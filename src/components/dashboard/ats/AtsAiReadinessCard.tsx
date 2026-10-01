import {
  Bot,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { AtsAiReadiness } from "./types";

interface AtsAiReadinessCardProps {
  aiReadiness?: AtsAiReadiness;
}

export function AtsAiReadinessCard({ aiReadiness }: AtsAiReadinessCardProps) {
  if (!aiReadiness) return null;

  const levelColor =
    aiReadiness.score >= 80
      ? "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800"
      : aiReadiness.score >= 60
        ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800"
        : "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800";

  const levelLabel =
    aiReadiness.level === "agentic_native"
      ? "Agentic & AI Native"
      : aiReadiness.level === "ai_augmented"
        ? "AI Augmented Professional"
        : aiReadiness.level === "emerging"
          ? "Emerging AI Adoption"
          : "Traditional / Outdated AI Skills";

  return (
    <div className="card p-6 sm:p-8 bg-linear-to-br from-indigo-50/40 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-linear-to-tr from-indigo-600 to-purple-600 text-white shadow-xs shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Modern AI & Agentic Skills Readiness
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${levelColor}`}
              >
                {levelLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              2026 hiring benchmarks prioritize candidates skilled in AI coding
              assistants, agent workflows, and LLM acceleration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-indigo-100 dark:border-slate-700 shrink-0">
          <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <div className="text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block leading-tight">
              AI Readiness Score
            </span>
            <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono leading-tight">
              {aiReadiness.score}/100
            </span>
          </div>
        </div>
      </div>

      {/* Headline */}
      {aiReadiness.headline && (
        <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">{aiReadiness.headline}</p>
        </div>
      )}

      {/* Grid: Detected vs Recommended Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detected AI Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Detected Modern AI Skills (
              {aiReadiness.detectedAiSkills?.length || 0})
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {!aiReadiness.detectedAiSkills ||
            aiReadiness.detectedAiSkills.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg w-full">
                No modern AI skills (e.g. Cursor, AI Agents, Copilot) detected
                in your resume.
              </p>
            ) : (
              aiReadiness.detectedAiSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Recommended AI & Agentic Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
            <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>
              Recommended Modern Skills to Highlight (
              {aiReadiness.missingModernSkills?.length || 0})
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {!aiReadiness.missingModernSkills ||
            aiReadiness.missingModernSkills.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Excellent! Your resume covers key modern AI competencies.
              </p>
            ) : (
              aiReadiness.missingModernSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200/60 dark:border-purple-800/40"
                >
                  + {skill}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Actionable Suggestions */}
      {aiReadiness.suggestions && aiReadiness.suggestions.length > 0 && (
        <div className="pt-2 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>How to Modernize Your Resume for AI-Era Hiring</span>
          </div>
          <div className="space-y-2">
            {aiReadiness.suggestions.map((suggestion, idx) => (
              <div
                key={suggestion}
                className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5 shadow-2xs"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
