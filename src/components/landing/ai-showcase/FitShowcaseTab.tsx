"use client";

import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function FitShowcaseTab() {
  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-500/5">
      <div className="lg:col-span-5 space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          Feature #1: Deep Fit Scoring
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-space-grotesk">
          Calculate Exact ATS Match Before You Apply
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Applicant Tracking Systems reject over 75% of resumes before human
          eyes see them. Career Graph scans your resume against any target job
          spec to evaluate hard skills, soft skills, seniority, and missing
          keywords.
        </p>
        <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Instant 0-100% ATS Compatibility Percentage</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Pinpoints specific missing keywords & technologies</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Step-by-step strategic recommendations for your resume</span>
          </li>
        </ul>
        <div className="pt-2">
          <Link
            href="/fit-analysis"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
          >
            <span>Launch Fit Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Interactive Preview Card */}
      <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Staff Full-Stack Engineer
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target Role: Vercel • Remote
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 shrink-0 self-start sm:self-auto">
            <span className="text-xl font-extrabold font-space-grotesk">
              92%
            </span>
            <span className="text-[11px] font-semibold uppercase">
              High Match
            </span>
          </div>
        </div>

        {/* Sub Metrics Breakdown */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tech Skills
            </p>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              96%
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Experience
            </p>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              90%
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Seniority
            </p>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              88%
            </p>
          </div>
        </div>

        {/* Strengths & Missing Keyword Pills */}
        <div className="space-y-3 text-xs">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Verified Strengths & Match Proofs:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Next.js App Router",
                "TypeScript 5.x",
                "React Server Components",
                "Tailwind CSS",
                "Distributed Systems",
              ].map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Recommended Keywords to Add Before Submitting:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "GraphQL Federation",
                "Turbopack Build Optimization",
                "OpenTelemetry",
              ].map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-medium"
                >
                  + {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
