"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CuratedDailyMatchesCard } from "@/components/dashboard/CuratedDailyMatchesCard";

export default function DailyMatchesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/overview"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs text-slate-400">
          Updated Daily at 06:00 AM & on Scraper Completion
        </span>
      </div>

      {/* Main Curated Card with full list */}
      <CuratedDailyMatchesCard maxItems={100} showFullPageLink={false} />
    </div>
  );
}
