"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function ResumeShowcaseTab() {
  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-cyan-500/5">
      <div className="lg:col-span-5 space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
          Feature #4: Resume Intelligence Hub
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-space-grotesk">
          Multi-Version Resume Management & Intelligent Parsing
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          One resume does not fit all roles. Store specialized resume versions
          tailored for different positions (e.g. Frontend Specialist vs.
          Engineering Manager) and instantly check alignment against any
          opening.
        </p>
        <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Automated PDF text extraction and skill inventory</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Version comparisons and historical ATS match tracking</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Direct association with tracked job applications</span>
          </li>
        </ul>
        <div className="pt-2">
          <Link
            href="/resumes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-cyan-600 hover:bg-cyan-700 shadow-sm transition-all"
          >
            <span>Manage My Resumes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Resume Hub Visual Preview */}
      <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        {[
          {
            name: "FullStack_Senior_2026.pdf",
            focus: "Full-Stack / TypeScript Focus",
            matches: "14 Applications Linked",
            score: "94% Avg ATS",
          },
          {
            name: "Frontend_DesignSystems_Lead.pdf",
            focus: "UI/UX & Design Systems",
            matches: "8 Applications Linked",
            score: "91% Avg ATS",
          },
          {
            name: "Engineering_Management_Resume.pdf",
            focus: "Tech Lead / Team Leadership",
            matches: "5 Applications Linked",
            score: "88% Avg ATS",
          },
        ].map((res) => (
          <div
            key={res.name}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                PDF
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {res.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {res.focus} • {res.matches}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
              {res.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
