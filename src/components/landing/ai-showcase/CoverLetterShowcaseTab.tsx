"use client";

import { ArrowRight, Check, CheckCircle2, Copy, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function CoverLetterShowcaseTab() {
  const [copied, setCopied] = useState(false);

  const handleCopyDemo = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-purple-500/5">
      <div className="lg:col-span-5 space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold">
          Feature #3: Tailored Cover Letters
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-space-grotesk">
          Generate Hyper-Tailored Cover Letters That Stand Out
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Generic templates get ignored. Career Graph reads your resume, the
          target job description, and weaves your actual achievements directly
          into compelling, role-specific letters in seconds.
        </p>
        <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Tone calibration (Professional, Passionate, Assertive)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Incorporates real metrics from your work experience</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Instant copy, edit, and PDF export</span>
          </li>
        </ul>
        <div className="pt-2">
          <Link
            href="/cover-letters"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
          >
            <span>Build Cover Letter</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Cover Letter Visual Preview */}
      <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Generated for Lead Engineer @ Airbnb
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyDemo}
            className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy Sample"}</span>
          </button>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-700/60 font-sans text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed space-y-2.5">
          <p>
            <strong>Dear Airbnb Engineering Team,</strong>
          </p>
          <p>
            Having scaled full-stack web applications to 3M+ active monthly users
            while reducing server-rendered latency by 38%, I was immediately
            drawn to Airbnb&apos;s mission of building seamless, hyper-reliable
            guest and host experiences.
          </p>
          <p>
            In my recent work with Next.js App Router and TypeScript, I
            architected distributed micro-frontends and led high-throughput
            checkout workflows. My background directly aligns with your
            requirement for real-time collaboration engines...
          </p>
          <p className="text-slate-500 dark:text-slate-400 italic text-xs">
            [Generated in 2.1s • Customized with verified candidate
            accomplishments]
          </p>
        </div>
      </div>
    </div>
  );
}
