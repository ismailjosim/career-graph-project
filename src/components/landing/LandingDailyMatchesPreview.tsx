"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface MatchedJobDemo {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  matchedSkills: string[];
  source: string;
  postedAgo: string;
}

const sampleMatches: MatchedJobDemo[] = [
  {
    id: "1",
    title: "Senior Full-Stack Engineer (React & Node.js)",
    company: "Vercel Partner Co.",
    location: "Remote (Worldwide)",
    salary: "$120,000 - $145,000 / yr",
    matchScore: 96,
    matchedSkills: ["React 19", "Next.js", "TypeScript", "Node.js"],
    source: "LinkedIn Jobs",
    postedAgo: "3 hours ago",
  },
  {
    id: "2",
    title: "Frontend Architect / Team Lead",
    company: "Stripe Ecosystems",
    location: "Remote (US / EU / Global)",
    salary: "$140,000 - $170,000 / yr",
    matchScore: 93,
    matchedSkills: ["UI/UX Systems", "Tailwind CSS", "Architecture"],
    source: "Otta / Wellfound",
    postedAgo: "5 hours ago",
  },
  {
    id: "3",
    title: "Full-Stack Web Application Developer",
    company: "CloudScale Systems",
    location: "Remote",
    salary: "$110,000 - $130,000 / yr",
    matchScore: 89,
    matchedSkills: ["MongoDB", "REST APIs", "Next.js"],
    source: "Indeed Web Sync",
    postedAgo: "8 hours ago",
  },
];

export function LandingDailyMatchesPreview() {
  return (
    <section
      id="ai-features"
      className="py-16 sm:py-20 lg:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Daily Recommendation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Daily Job Scraping & AI Resume Matching
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Stop searching 10 different job boards every morning. Our system
            scrapes fresh opportunities across the web daily, evaluates them
            against your resume, and delivers 10–15 curated high-probability
            matches straight to your dashboard.
          </p>
        </div>

        {/* Live Matching Dashboard Simulation */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-7">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                AI
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                    Today&apos;s Curated Matches (12 New Jobs)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
                    Live
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target Profile: Full-Stack Engineer • Synced today at 06:00 AM
                </p>
              </div>
            </div>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Get Your Daily 10-15 Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cards List */}
          <div className="mt-5 space-y-3.5">
            {sampleMatches.map((job) => (
              <div
                key={job.id}
                className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {job.company}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">
                      •
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.postedAgo}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">
                      •
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      via {job.source}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {job.title}
                  </h4>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {job.salary}
                    </span>
                  </div>

                  {/* Matched skills pill tags */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Matched Skills:
                    </span>
                    {job.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Match Score & Action */}
                <div className="flex sm:flex-row md:flex-col items-center sm:justify-between md:items-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium">
                        Resume Match
                      </p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {job.matchScore}%
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                  </div>

                  <Link
                    href="/signup"
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Apply / Track</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Footnote */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
            <p>
              ⚡ Scraped from 10+ platforms including LinkedIn, Indeed,
              Wellfound, RemoteOK, and Company career pages.
            </p>
            <Link
              href="/job-market"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Explore all job listings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
