"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CuratedDailyMatchesCard } from "@/components/dashboard/CuratedDailyMatchesCard";

export default function DailyMatchesPage() {
  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Navigation & Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Updated Daily at 06:00 AM & on Scraper Completion
        </span>
      </div>

      {/* Main Curated Card with full list */}
      <CuratedDailyMatchesCard maxItems={100} showFullPageLink={false} />
    </div>
  );
}
