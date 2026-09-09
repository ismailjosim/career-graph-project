"use client";

import {
  ArrowRight,
  FileCheck,
  Globe2,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LandingHero() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState(
    "Staff Frontend / Full-Stack Engineer",
  );
  const [location, setLocation] = useState("Remote Worldwide");
  const [category, _setCategory] = useState("engineering");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to fit-analysis with query parameters or to job-market
    router.push(
      `/fit-analysis?title=${encodeURIComponent(jobTitle)}&category=${category}`,
    );
  };

  const trendingTags = [
    { label: "⚡ Remote Only", query: "Remote Frontend Engineer" },
    { label: "🤖 AI / Machine Learning", query: "AI Engineer" },
    { label: "🚀 Next.js & React 19", query: "Full-Stack React Engineer" },
    { label: "🎨 UI/UX Systems", query: "Product Designer" },
    { label: "💼 $150k+ Salary Roles", query: "Senior Software Engineer" },
    { label: "⭐ High ATS Fit", query: "TypeScript Engineer" },
  ];

  return (
    <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
      {/* Background Decorative Gradients & Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-112.5 bg-linear-to-b from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl dark:from-blue-600/20 dark:via-indigo-600/15" />
        <div className="absolute top-40 -left-48 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute top-20 -right-48 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Announcement Pill */}
        <Link
          href="#pricing"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium shadow-xs mb-8 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">
            New: ATS Resume Checker + 50 Free Tokens
          </span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span>4-Pillar Scan, Word/PDF Export & Custom Cover Letters</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-blue-500" />
        </Link>

        {/* Primary Marketplace Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
          Discover High-Fit Jobs.{" "}
          <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Dominate Applications with AI.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The all-in-one career ecosystem designed like a premier job
          marketplace. Curate top hiring platforms, run automated ATS resume fit
          scores, and craft tailored cover letters in seconds.
        </p>

        {/* Traditional Job Marketplace Interactive Search & Match Bar */}
        <div className="mt-10 max-w-4xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="p-3 sm:p-3.5 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-500/5 dark:shadow-black/40 backdrop-blur-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 items-center">
              {/* Job Title / Keyword Input */}
              <div className="md:col-span-5 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <Search className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="text-left w-full">
                  <label
                    htmlFor="search-job-title"
                    className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    Role or Skill
                  </label>
                  <input
                    id="search-job-title"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Location Select */}
              <div className="md:col-span-4 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                <div className="text-left w-full">
                  <label
                    htmlFor="search-location"
                    className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    Location
                  </label>
                  <input
                    id="search-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote, Worldwide, US"
                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl text-white font-semibold text-sm bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200 animate-spin-slow" />
                  <span>AI Fit Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Trending Quick Search Chips */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                Popular:
              </span>
              {trendingTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => setJobTitle(tag.query)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/70 dark:border-slate-700/70 transition-colors"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/ats-checker"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <FileCheck className="w-4 h-4 text-emerald-100" />
            <span>Check Resume ATS Score</span>
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-[11px] font-bold">
              Free
            </span>
          </Link>
          <Link
            href="/fit-analysis"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-blue-400 dark:text-blue-600" />
            <span>AI Job Fit Analyzer</span>
          </Link>
          <Link
            href="/job-market"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs transition-all hover:scale-[1.02]"
          >
            <Globe2 className="w-4 h-4 text-indigo-500" />
            <span>Browse Job Marketplace</span>
          </Link>
        </div>

        {/* Live Metrics Proof Bar */}
        <div className="mt-16 pt-10 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold font-space-grotesk text-slate-900 dark:text-white">
              98.4%
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              ATS Keyword Match Accuracy
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold font-space-grotesk text-blue-600 dark:text-blue-400">
              &lt; 3 Sec
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Smart Job URL Extraction
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold font-space-grotesk text-indigo-600 dark:text-indigo-400">
              10+ Boards
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Integrated Curated Marketplaces
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold font-space-grotesk text-cyan-600 dark:text-cyan-400">
              5 Roles
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Enterprise RBAC & Permissions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
