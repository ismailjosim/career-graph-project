"use client";

import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import Link from "next/link";

export function ExtractShowcaseTab() {
  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-indigo-500/5">
      <div className="lg:col-span-5 space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          Feature #2: 1-Click Extraction
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-space-grotesk">
          Paste Any Job Link. AI Automatically Parses Everything.
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Found an interesting opening on LinkedIn, Indeed, or Greenhouse? Paste
          the URL or description text. Our autonomous extractor isolates
          company, title, salary ranges, location, requirements, and tags into
          your tracker in 2 seconds.
        </p>
        <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Extracts salary brackets, tech stacks, and company meta</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Eliminates tedious manual copy-pasting into spreadsheets
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Auto-categorizes into Wishlist or Applied status</span>
          </li>
        </ul>
        <div className="pt-2">
          <Link
            href="/applications/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
          >
            <span>Try Smart Job Adder</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Extractor Visual Preview */}
      <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
          <Search className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="truncate text-slate-500 dark:text-slate-400 font-mono">
            https://jobs.lever.co/stripe/staff-backend-engineer-payments
          </span>
          <span className="ml-auto px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">
            Parsed ✓
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">
              Extracted Role
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              Staff Backend Engineer
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              Stripe • Remote US
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">
              Compensation
            </p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              $210,000 - $260,000
            </p>
            <p className="text-xs text-slate-500">Equity + 401(k) Match</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
          <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1.5">
            Identified Tech Requirements
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Distributed Systems",
              "Go",
              "Java",
              "Kafka",
              "High Throughput",
              "ACID Transactions",
            ].map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium border border-indigo-100 dark:border-indigo-900"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
