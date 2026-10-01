"use client";

import { Cpu, FileText, Layers, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import {
  AtsShowcaseTab,
  CoverLetterShowcaseTab,
  ExtractShowcaseTab,
  FitShowcaseTab,
  ResumeShowcaseTab,
} from "./ai-showcase";

export function LandingAiShowcase() {
  const [activeTab, setActiveTab] = useState<
    "ats" | "cover" | "fit" | "extract" | "resume"
  >("ats");

  return (
    <section
      id="ai-features"
      className="py-20 sm:py-28 bg-slate-50/50 dark:bg-slate-900/40 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Cpu className="w-3.5 h-3.5" />
            Autonomous Intelligence Engine
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
            Supercharged by 5 Proprietary{" "}
            <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              AI Superpowers
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Stop applying blindly. Career Graph audits your resume against ATS
            algorithms, crafts tailored cover letters, and aligns your profile
            with machine precision.
          </p>
        </div>

        {/* Interactive Feature Tabs */}
        <div className="mt-10 sm:mt-12 flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 max-w-4xl mx-auto p-1.5 bg-slate-200/60 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("ats")}
            className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "ats"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md shadow-black/5"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>ATS Resume Checker</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cover")}
            className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "cover"
                ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md shadow-black/5"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>AI Cover Letter</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fit")}
            className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "fit"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md shadow-black/5"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Job Fit Matcher</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("extract")}
            className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "extract"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md shadow-black/5"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Smart Extractor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("resume")}
            className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "resume"
                ? "bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-md shadow-black/5"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Resume Hub</span>
          </button>
        </div>

        {/* Tab Showcases */}
        {activeTab === "ats" && <AtsShowcaseTab />}
        {activeTab === "fit" && <FitShowcaseTab />}
        {activeTab === "extract" && <ExtractShowcaseTab />}
        {activeTab === "cover" && <CoverLetterShowcaseTab />}
        {activeTab === "resume" && <ResumeShowcaseTab />}
      </div>
    </section>
  );
}
