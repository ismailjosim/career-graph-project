"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { clientCache } from "@/lib/client-cache";
import { AdminChartsSection } from "./AdminChartsSection";
import { AdminKpiGrid } from "./AdminKpiGrid";
import { AdminOverviewHeader } from "./AdminOverviewHeader";
import { AdminPlanLimitsCard } from "./AdminPlanLimitsCard";
import { AdminTopJobsTable } from "./AdminTopJobsTable";
import type { AdminOverviewResponse } from "./types";

const ADMIN_METRICS_CACHE_KEY = "admin_overview_metrics";

interface AdminDashboardOverviewProps {
  viewMode: "admin" | "candidate";
  onToggleViewMode: () => void;
}

export function AdminDashboardOverview({
  viewMode,
  onToggleViewMode,
}: AdminDashboardOverviewProps) {
  const cached = clientCache.get<AdminOverviewResponse>(
    ADMIN_METRICS_CACHE_KEY,
  );
  const [data, setData] = useState<AdminOverviewResponse | null>(
    cached?.data ?? null,
  );
  const [loading, setLoading] = useState(!cached?.data);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"all" | "30d" | "7d">("all");

  const fetchOverview = useCallback(async (showToast = false) => {
    try {
      if (showToast) {
        setIsRefreshing(true);
      } else if (
        !clientCache.get<AdminOverviewResponse>(ADMIN_METRICS_CACHE_KEY)?.data
      ) {
        setLoading(true);
      }
      setError(null);

      const url = showToast
        ? "/api/admin/overview?refresh=true"
        : "/api/admin/overview";
      const res = await fetch(url);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(
          errJson.error || "Failed to load admin overview metrics",
        );
      }

      const json = await res.json();
      setData(json);
      clientCache.set(ADMIN_METRICS_CACHE_KEY, json, 120_000, true);
      if (showToast) {
        toast.success("Metrics refreshed successfully!");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error loading metrics";
      setError(msg);
      if (showToast) toast.error(msg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (loading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            "kpi-1",
            "kpi-2",
            "kpi-3",
            "kpi-4",
            "kpi-5",
            "kpi-6",
            "kpi-7",
            "kpi-8",
          ].map((id) => (
            <div
              key={id}
              className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card p-8 text-center space-y-3 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-2xl">
        <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
          {error || "Could not load admin overview data"}
        </p>
        <button
          type="button"
          onClick={() => fetchOverview(true)}
          className="btn-primary py-2 px-4 text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const { metrics, timeline } = data;

  return (
    <div className="w-full space-y-7 animate-fade-in pb-16">
      {/* 1. Header & Controls */}
      <AdminOverviewHeader
        pendingReviewsCount={metrics.communityReviews.pending}
        isRefreshing={isRefreshing}
        onRefresh={() => fetchOverview(true)}
        viewMode={viewMode}
        onToggleViewMode={onToggleViewMode}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* 2. Top KPI Cards Grid (8 Metrics) */}
      <AdminKpiGrid metrics={metrics} />

      {/* 3. Recharts Visual Analytics Section */}
      <AdminChartsSection
        timeline={timeline}
        aiTools={metrics.aiTools}
        jobs={metrics.jobs}
      />

      {/* 4. Plan & Storage Quota Architecture */}
      <AdminPlanLimitsCard />

      {/* 5. Top Performing Jobs by External Outbound Clicks */}
      <AdminTopJobsTable jobs={metrics.topClickedJobs} />
    </div>
  );
}
