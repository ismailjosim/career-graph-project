"use client";

import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LandingHero() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobTitle.trim()) params.set("title", jobTitle.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/job-market?${params.toString()}`);
  };

  const popularKeywords = [
    "Remote",
    "Frontend",
    "Backend",
    "Full-Stack",
    "React",
    "Node.js",
    "Python",
    "Design",
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtle, clean top badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Daily Job Sync & AI Resume Matching</span>
          </div>

          {/* Minimalist, Impactful Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Find your next career move.
            <span className="block text-blue-600 dark:text-blue-500 mt-2">
              Matched directly to your skills.
            </span>
          </h1>

          {/* Clear, straightforward subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Search verified tech & remote opportunities, or let our daily
            matching engine deliver the top 10–15 curated jobs tailored
            specifically to your portfolio and resume.
          </p>

          {/* Clean, Powerful Job Search Bar (Indeed / Google Style) */}
          <div className="mt-10 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row gap-2"
            >
              {/* Job Title / Keyword */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Job title, keywords, or company"
                  className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Location */}
              <div className="md:w-64 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, country, or Remote"
                  className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="h-12 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Search Jobs</span>
              </button>
            </form>

            {/* Clean Keyword Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium mr-1 text-slate-400">Popular:</span>
              {popularKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => {
                    setJobTitle(kw);
                    router.push(`/job-market?title=${encodeURIComponent(kw)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Value Points */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Daily automatic online job scraping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>10–15 resume matched jobs delivered daily</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Kanban tracker & interview reminders</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
