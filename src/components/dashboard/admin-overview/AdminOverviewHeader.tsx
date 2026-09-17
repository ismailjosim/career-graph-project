"use client";

import {
  Activity,
  Briefcase,
  Eye,
  MessageSquare,
  Plus,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

interface AdminOverviewHeaderProps {
  pendingReviewsCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  viewMode: "admin" | "candidate";
  onToggleViewMode: () => void;
  period: "all" | "30d" | "7d";
  onPeriodChange: (p: "all" | "30d" | "7d") => void;
}

export function AdminOverviewHeader({
  pendingReviewsCount = 0,
  isRefreshing,
  onRefresh,
  viewMode,
  onToggleViewMode,
  period,
  onPeriodChange,
}: AdminOverviewHeaderProps) {
  return (
    <div className="flex flex-col gap-5 bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Title & System Health Status */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Admin Command Center</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-xs">
                  SUPER ADMIN
                </span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Platform Active & Aggregating
            </span>
            <span>•</span>
            <span>All Data Synchronized</span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Switcher (Admin vs Candidate Preview) */}
          <button
            type="button"
            onClick={onToggleViewMode}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
              viewMode === "candidate"
                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            title="Preview candidate dashboard view"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{viewMode === "candidate" ? "Viewing Candidate" : "Preview Candidate"}</span>
          </button>

          {/* Quick Jump to Reviews Moderation */}
          <Link
            href="/reviews"
            className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5 font-medium relative"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            <span>Moderation</span>
            {pendingReviewsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold text-[10px] animate-pulse">
                {pendingReviewsCount}
              </span>
            )}
          </Link>

          {/* User Directory Link */}
          <Link
            href="/users"
            className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5 font-medium"
          >
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>Users</span>
          </Link>

          {/* Post New Job */}
          <Link
            href="/jobs/new"
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 font-medium shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Job</span>
          </Link>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer disabled:opacity-60"
            title="Refresh metrics"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Period Filter Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Analytics Scope:</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(["7d", "30d", "all"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange(p)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                period === p
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {p === "7d" ? "Last 7 Days" : p === "30d" ? "Last 30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
