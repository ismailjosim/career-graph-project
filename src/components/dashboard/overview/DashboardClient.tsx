"use client";

import { Eye, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminDashboardOverview } from "@/components/dashboard/admin-overview";
import { CuratedDailyMatchesCard } from "@/components/dashboard/CuratedDailyMatchesCard";
import {
  AddApplicationModal,
  buildMetricsChartData,
  buildTimelineChartData,
  calculateDashboardMetrics,
  DashboardLoading,
  DashboardOverviewHeader,
  DashboardStatsGrid,
  PerformanceChart,
  QuickInsightsCard,
  RecentApplicationsTable,
} from "@/components/dashboard/overview";
import { RecruiterDashboardOverview } from "@/components/dashboard/recruiter-overview";
import { useJobApplications, useMonthlyStats } from "@/hooks/useApi";
import { useSession } from "@/lib/auth-client";
import { clientCache } from "@/lib/client-cache";
import type { UserRole } from "@/lib/validation";

export function DashboardClient() {
  const { data: session } = useSession();
  const sessionRole = (session?.user as Record<string, unknown>)?.role as
    | UserRole
    | undefined;

  const cachedRole =
    clientCache.get<UserRole>("user_role")?.data ?? sessionRole ?? null;
  const [userRole, setUserRole] = useState<UserRole | null>(cachedRole);
  const [roleLoading, setRoleLoading] = useState(!cachedRole);
  const [adminViewMode, setAdminViewMode] = useState<"admin" | "candidate">(
    "admin",
  );

  // Sync verified role from session or live DB
  useEffect(() => {
    if (session?.user) {
      const sRole = (session.user as Record<string, unknown>)?.role as
        | UserRole
        | undefined;
      if (sRole) {
        setUserRole(sRole);
        clientCache.set("user_role", sRole, 300_000, true);
        setRoleLoading(false);
      } else {
        fetch("/api/users/me")
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.user?.role) {
              const r = data.user.role as UserRole;
              setUserRole(r);
              clientCache.set("user_role", r, 300_000, true);
            }
          })
          .catch(() => {})
          .finally(() => setRoleLoading(false));
      }
    } else {
      setRoleLoading(false);
    }
  }, [session]);

  // Candidate Data Hooks
  const { applications, createApplication, fetchApplications } =
    useJobApplications();
  const { refreshStats } = useMonthlyStats();

  const [showModal, setShowModal] = useState(false);
  const [chartView, setChartView] = useState<"metrics" | "timeline">("metrics");

  // Calculate live dynamic metrics from applications in real time
  const metrics = useMemo(
    () => calculateDashboardMetrics(applications),
    [applications],
  );

  const metricsChartData = useMemo(
    () => buildMetricsChartData(metrics),
    [metrics],
  );

  const timelineChartData = useMemo(
    () => buildTimelineChartData(applications),
    [applications],
  );

  const handleApplicationCreated = async () => {
    await fetchApplications();
    await refreshStats();
  };

  if (roleLoading) {
    return <DashboardLoading />;
  }

  // 1. Admin & Super Admin Perspective
  const isAdminUser = userRole === "admin" || userRole === "super_admin";

  if (isAdminUser && adminViewMode === "admin") {
    return (
      <AdminDashboardOverview
        viewMode="admin"
        onToggleViewMode={() => setAdminViewMode("candidate")}
      />
    );
  }

  // 2. Recruiter & Employer Perspective
  const isRecruiterUser = userRole === "recruiter" || userRole === "employer";
  if (isRecruiterUser) {
    return <RecruiterDashboardOverview />;
  }

  // 3. Job Seeker (Candidate) Perspective (or Admin previewing candidate)
  return (
    <div className="w-full space-y-8 animate-fade-in pb-16">
      {/* Admin Preview Notice Bar */}
      {isAdminUser && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-between gap-3 text-xs text-amber-800 dark:text-amber-200 shadow-xs">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-600" />
            <span className="font-semibold">
              Admin Mode: Currently Previewing Candidate Overview Experience
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAdminViewMode("admin")}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Return to Admin Command Center</span>
          </button>
        </div>
      )}

      {/* Header */}
      <DashboardOverviewHeader
        totalApplications={metrics.total}
        onAddApplication={() => setShowModal(true)}
      />

      {/* Top 4 Real-time Stat Cards */}
      <DashboardStatsGrid metrics={metrics} />

      {/* Today's Curated AI Matches Section */}
      <CuratedDailyMatchesCard maxItems={3} showFullPageLink={true} />

      {/* Performance Charts & Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PerformanceChart
          metricsChartData={metricsChartData}
          timelineChartData={timelineChartData}
          chartView={chartView}
          onChartViewChange={setChartView}
        />
        <QuickInsightsCard metrics={metrics} />
      </div>

      {/* Recent Applications Table */}
      <RecentApplicationsTable
        applications={applications}
        onAddApplication={() => setShowModal(true)}
      />

      {/* Add Application Modal */}
      <AddApplicationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        createApplication={createApplication}
        onSuccess={handleApplicationCreated}
      />
    </div>
  );
}
