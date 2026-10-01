"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export function AtsShowcaseTab() {
  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-emerald-500/5">
      <div className="lg:col-span-5 space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Flagship: 4-Pillar ATS Audit
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-space-grotesk">
          Professional ATS Resume Audit & 1-Click Fixes
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          75% of resumes fail automated ATS filters before a recruiter sees
          them. Our AI performs a comprehensive 4-pillar audit across
          formatting, critical keywords, quantified impact, and
          structure—complete with exportable Word (.docx) and PDF reports.
        </p>
        <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              4-Pillar Scorecard: Formatting, Keywords, Impact & Structure
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Identifies critical ATS blockers & bullet-point rewrites
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Instant export to professionally styled Word & PDF reports
            </span>
          </li>
        </ul>
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            href="/ats-checker"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch ATS Checker</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Costs 10 Tokens (Free with Welcome Grant)
          </span>
        </div>
      </div>

      {/* ATS Checker Visual Preview */}
      <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                Senior_FullStack_Engineer.pdf
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Scanned against Senior Full-Stack role requirements
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 shrink-0 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-lg font-extrabold font-space-grotesk">
              91/100
            </span>
            <span className="text-[10px] font-semibold uppercase">
              ATS Ready
            </span>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { pillar: "Formatting", score: "95%", status: "Optimal" },
            { pillar: "Keywords", score: "88%", status: "High" },
            { pillar: "Content Impact", score: "92%", status: "Strong" },
            { pillar: "Structure", score: "90%", status: "Clean" },
          ].map((item) => (
            <div
              key={item.pillar}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 text-center"
            >
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {item.pillar}
              </p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {item.score}
              </p>
              <span className="text-[10px] font-medium text-slate-400">
                {item.status}
              </span>
            </div>
          ))}
        </div>

        {/* Diagnostics & Export Bar */}
        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-2.5 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Critical Suggestion:</span>
              <span>
                Add quantified impact metrics (e.g. % latency decrease, revenue
                impact) to your Experience bullet points to pass strict
                enterprise ATS filters.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                Matched:
              </span>
              {[
                "React 19",
                "Next.js",
                "TypeScript",
                "System Design",
                "CI/CD",
              ].map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium"
                >
                  ✓ {kw}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                <Download className="w-3 h-3 text-blue-500" />
                DOCX
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                <Download className="w-3 h-3 text-rose-500" />
                PDF
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
