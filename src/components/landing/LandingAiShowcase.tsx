"use client";

import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Download,
  FileCheck,
  FileText,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LandingAiShowcase() {
  const [activeTab, setActiveTab] = useState<
    "ats" | "cover" | "fit" | "extract" | "resume"
  >("ats");
  const [copied, setCopied] = useState(false);

  const handleCopyDemo = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto p-1.5 bg-slate-200/60 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("ats")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "cover"
                ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md shadow-black/5"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>AI Cover Letter Architect</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fit")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "extract"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md shadow-black/5"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Smart Job Extractor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("resume")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "resume"
                ? "bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-md shadow-black/5"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Resume Hub</span>
          </button>
        </div>

        {/* Tab 0: Professional ATS Resume Checker Showcase */}
        {activeTab === "ats" && (
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
                75% of resumes fail automated ATS filters before a recruiter
                sees them. Our AI performs a comprehensive 4-pillar audit across
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
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      Senior_FullStack_Engineer.pdf
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Scanned against Senior Full-Stack role requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
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
                    <span className="font-semibold block">
                      Critical Suggestion:
                    </span>
                    <span>
                      Add quantified impact metrics (e.g. % latency decrease,
                      revenue impact) to your Experience bullet points to pass
                      strict enterprise ATS filters.
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-1">
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

                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
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
        )}

        {/* Tab 1: AI ATS Fit Analyzer Showcase */}
        {activeTab === "fit" && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-500/5">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                Feature #1: Deep Fit Scoring
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-space-grotesk">
                Calculate Exact ATS Match Before You Apply
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Applicant Tracking Systems reject over 75% of resumes before
                human eyes see them. Career Graph scans your resume against any
                target job spec to evaluate hard skills, soft skills, seniority,
                and missing keywords.
              </p>
              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant 0-100% ATS Compatibility Percentage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Pinpoints specific missing keywords & technologies
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Step-by-step strategic recommendations for your resume
                  </span>
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
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Staff Full-Stack Engineer
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Target Role: Vercel • Remote
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
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
        )}

        {/* Tab 2: Smart Job Extractor Showcase */}
        {activeTab === "extract" && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-indigo-500/5">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                Feature #2: 1-Click Extraction
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-space-grotesk">
                Paste Any Job Link. AI Automatically Parses Everything.
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Found an interesting opening on LinkedIn, Indeed, or Greenhouse?
                Paste the URL or description text. Our autonomous extractor
                isolates company, title, salary ranges, location, requirements,
                and tags into your tracker in 2 seconds.
              </p>
              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Extracts salary brackets, tech stacks, and company meta
                  </span>
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
                  <p className="text-xs text-slate-500">
                    Equity + 401(k) Match
                  </p>
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
        )}

        {/* Tab 3: AI Cover Letter Architect */}
        {activeTab === "cover" && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-purple-500/5">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                Feature #3: Tailored Cover Letters
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-space-grotesk">
                Generate Hyper-Tailored Cover Letters That Stand Out
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Generic templates get ignored. Career Graph reads your resume,
                the target job description, and weaves your actual achievements
                directly into compelling, role-specific letters in seconds.
              </p>
              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Tone calibration (Professional, Passionate, Assertive)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Incorporates real metrics from your work experience
                  </span>
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
                  Having scaled full-stack web applications to 3M+ active
                  monthly users while reducing server-rendered latency by 38%, I
                  was immediately drawn to Airbnb&apos;s mission of building
                  seamless, hyper-reliable guest and host experiences.
                </p>
                <p>
                  In my recent work with Next.js App Router and TypeScript, I
                  architected distributed micro-frontends and led
                  high-throughput checkout workflows. My background directly
                  aligns with your requirement for real-time collaboration
                  engines...
                </p>
                <p className="text-slate-500 dark:text-slate-400 italic text-xs">
                  [Generated in 2.1s • Customized with verified candidate
                  accomplishments]
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Resume Intelligence Hub */}
        {activeTab === "resume" && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-cyan-500/5">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
                Feature #4: Resume Intelligence Hub
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-space-grotesk">
                Multi-Version Resume Management & Intelligent Parsing
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                One resume does not fit all roles. Store specialized resume
                versions tailored for different positions (e.g. Frontend
                Specialist vs. Engineering Manager) and instantly check
                alignment against any opening.
              </p>
              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Automated PDF text extraction and skill inventory</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Version comparisons and historical ATS match tracking
                  </span>
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
              ].map((res, _i) => (
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
        )}
      </div>
    </section>
  );
}
