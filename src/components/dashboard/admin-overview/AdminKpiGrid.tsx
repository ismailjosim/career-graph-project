"use client";

import {
  Briefcase,
  Coins,
  FileText,
  MousePointerClick,
  Printer,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { AdminOverviewMetrics } from "./types";

interface AdminKpiGridProps {
  metrics: AdminOverviewMetrics;
}

export function AdminKpiGrid({ metrics }: AdminKpiGridProps) {
  const {
    users,
    applications,
    jobs,
    aiTools,
    resumeBuilder,
    communityReviews,
  } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Users */}
      <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Users
          </span>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {users.total.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            {users.verified} verified accounts ({users.unverified} unverified)
          </p>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Candidates: <strong>{users.byRole.job_seeker}</strong>
          </span>
          <span>
            Recruiters:{" "}
            <strong>{users.byRole.recruiter + users.byRole.employer}</strong>
          </span>
          <span>
            Admins:{" "}
            <strong>{users.byRole.admin + users.byRole.super_admin}</strong>
          </span>
        </div>
      </div>

      {/* 2. Total Posted Jobs */}
      <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Posted Jobs
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {jobs.total.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="text-emerald-600 font-semibold">
              {jobs.active} active
            </span>{" "}
            • {jobs.closed} closed
          </p>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Direct: <strong>{jobs.bySource.direct || 0}</strong>
          </span>
          <span>
            LinkedIn: <strong>{jobs.bySource.linkedin || 0}</strong>
          </span>
          <span>
            Indeed/Other:{" "}
            <strong>
              {(jobs.bySource.indeed || 0) + (jobs.bySource.other || 0)}
            </strong>
          </span>
        </div>
      </div>

      {/* 3. Total Applications */}
      <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Applications
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {applications.total.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            {applications.offerConversionRate}% offer conversion rate
          </p>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Applied: <strong>{applications.byStatus.applied || 0}</strong>
          </span>
          <span>
            Interviews:{" "}
            <strong>
              {(applications.byStatus.interview_scheduled || 0) +
                (applications.byStatus.interviewed || 0)}
            </strong>
          </span>
          <span>
            Offers: <strong>{applications.byStatus.offer_received || 0}</strong>
          </span>
        </div>
      </div>

      {/* 4. External Link Clicks */}
      <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            External Job Clicks
          </span>
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <MousePointerClick className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {jobs.totalExternalClicks.toLocaleString()}
          </h3>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
            {jobs.outboundCtr}% Outbound CTR ({jobs.totalViews} views)
          </p>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tracked at Job Post Level</span>
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            Live Telemetry
          </span>
        </div>
      </div>

      {/* 5. AI Career Tools Generation */}
      <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            AI Tool Generations
          </span>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {aiTools.totalAiRuns.toLocaleString()}
          </h3>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
            {aiTools.fitAnalysisRuns} Fit Analysis •{" "}
            {aiTools.coverLettersGenerated} Cover Letters
          </p>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            ATS Scans: <strong>{aiTools.atsChecksRuns}</strong>
          </span>
          <span>Active Gemini 2.5 API</span>
        </div>
      </div>

      {/* 6. Resume Builder Downloads & Prints */}
      <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Resume Downloads & Prints
          </span>
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <Printer className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {(
              resumeBuilder.downloadsCount + resumeBuilder.printRequestsCount
            ).toLocaleString()}
          </h3>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-0.5 flex items-center gap-1.5">
            <span>{resumeBuilder.downloadsCount} PDF downloads</span>
            <span>•</span>
            <span>{resumeBuilder.printRequestsCount} prints</span>
          </p>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Total Resumes in DB:{" "}
            <strong>{resumeBuilder.resumesUploaded}</strong>
          </span>
        </div>
      </div>

      {/* 7. Token Economy */}
      <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Token Economy
          </span>
          <div className="p-2 rounded-xl bg-yellow-50 dark:bg-yellow-950/60 text-yellow-600 dark:text-yellow-400">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {users.tokensCirculating.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Total active tokens circulating in user wallets
          </p>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Avg Balance:{" "}
            <strong>
              {users.total > 0
                ? Math.round(users.tokensCirculating / users.total)
                : 50}{" "}
              / user
            </strong>
          </span>
        </div>
      </div>

      {/* 8. Community Reviews Moderation */}
      <Link
        href="/admin/reviews"
        className="card p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-3 block hover:border-amber-400 dark:hover:border-amber-500/50 transition-all hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Reviews Moderation
          </span>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
            <Star className="w-4 h-4 fill-amber-500" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {communityReviews.total} Reviews
          </h3>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
            ★ {communityReviews.averageRating} average platform rating
          </p>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Pending Review:</span>
          {communityReviews.pending > 0 ? (
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {communityReviews.pending} action required
            </span>
          ) : (
            <span className="font-semibold text-emerald-600">
              All cleared ✓
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
