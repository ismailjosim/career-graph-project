"use client";

import { ArrowRight, ExternalLink, Globe2, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function LandingMarketplaceGrid() {
  const marketplaces = [
    {
      name: "LinkedIn Jobs",
      category: "Global Network",
      categoryBadge: "general",
      rating: 5,
      description:
        "World's largest professional network with millions of active corporate and tech listings.",
      url: "https://www.linkedin.com/jobs",
      domain: "linkedin.com",
      tags: ["Global", "Enterprise", "Networking"],
      verified: true,
    },
    {
      name: "Wellfound (AngelList)",
      category: "Startups",
      categoryBadge: "startups",
      rating: 5,
      description:
        "Discover top venture-backed startups, salary transparency, and direct founder outreach.",
      url: "https://wellfound.com/jobs",
      domain: "wellfound.com",
      tags: ["Startups", "Equity", "Direct Founders"],
      verified: true,
    },
    {
      name: "RemoteOK",
      category: "Remote First",
      categoryBadge: "remote",
      rating: 5,
      description:
        "Premier digital nomad and worldwide remote tech board with real-time salary brackets.",
      url: "https://remoteok.com",
      domain: "remoteok.com",
      tags: ["Remote", "Worldwide", "High Pay"],
      verified: true,
    },
    {
      name: "YC Work at a Startup",
      category: "YC Companies",
      categoryBadge: "startups",
      rating: 5,
      description:
        "Get hired by fast-growing Y Combinator portfolio companies from Seed to Series D.",
      url: "https://www.workatastartup.com",
      domain: "workatastartup.com",
      tags: ["Y Combinator", "High Growth", "Engineering"],
      verified: true,
    },
    {
      name: "We Work Remotely",
      category: "Remote Roles",
      categoryBadge: "remote",
      rating: 4,
      description:
        "One of the longest-standing remote work communities with engineering, DevOps & design jobs.",
      url: "https://weworkremotely.com",
      domain: "weworkremotely.com",
      tags: ["Remote", "DevOps", "Customer Success"],
      verified: true,
    },
    {
      name: "Dribbble Jobs",
      category: "Design & UX",
      categoryBadge: "design",
      rating: 4,
      description:
        "Top-tier curated design opportunities for UI/UX designers, brand architects, and animators.",
      url: "https://dribbble.com/jobs",
      domain: "dribbble.com",
      tags: ["Design", "Product UI", "Creative"],
      verified: true,
    },
  ];

  return (
    <section id="marketplace" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Globe2 className="w-3.5 h-3.5" />
              Curated Marketplace Directory
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
              Track Opportunities Across the{" "}
              <span className="bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                World&apos;s Best Job Boards
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              No need to scatter bookmarks across your browser. Career Graph
              brings the top tech, remote, and startup job marketplaces into one
              unified directory with 1-click tracking.
            </p>
          </div>

          <Link
            href="/job-market"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] shrink-0 self-start md:self-auto"
          >
            <span>Explore All 10+ Marketplaces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Marketplace Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplaces.map((board) => (
            <div
              key={board.name}
              className="group relative p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header with Google Favicon */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 p-2 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 group-hover:scale-105 transition-transform">
                      {/* Google Favicon API */}
                      <Image
                        src={`https://www.google.com/s2/favicons?domain=${board.domain}&sz=64`}
                        alt={board.name}
                        width={26}
                        height={26}
                        unoptimized
                        className="rounded-sm object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {board.name}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {board.domain}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {board.category}
                  </span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(board.rating)].map((_, i) => (
                    <Star
                      key={`star-${board.name}-${i}`}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 ml-1">
                    {board.rating}.0
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {board.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {board.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  href="/fit-analysis"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Match with AI</span>
                </Link>
                <a
                  href={board.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-colors"
                >
                  <span>Visit Board</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
