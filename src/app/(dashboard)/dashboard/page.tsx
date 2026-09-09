"use client";

import { useMemo, useState } from "react";
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
import { useJobApplications, useMonthlyStats } from "@/hooks/useApi";

export default function DashboardPage() {
  const {
    applications,
    loading: appLoading,
    createApplication,
    fetchApplications,
  } = useJobApplications();
  const { refreshStats } = useMonthlyStats();

  const [showModal, setShowModal] = useState(false);
  const [chartView, setChartView] = useState<"metrics" | "timeline">("metrics");

  // Calculate live dynamic metrics from applications in real time
  const metrics = useMemo(
    () => calculateDashboardMetrics(applications),
    [applications],
  );

  // Chart data 1: Current Metric Breakdown
  const metricsChartData = useMemo(
    () => buildMetricsChartData(metrics),
    [metrics],
  );

  // Chart data 2: 6-Month Timeline Performance
  const timelineChartData = useMemo(
    () => buildTimelineChartData(applications),
    [applications],
  );

  const handleApplicationCreated = async () => {
    await fetchApplications();
    await refreshStats();
  };

  if (appLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Header */}
      <DashboardOverviewHeader
        totalApplications={metrics.total}
        onAddApplication={() => setShowModal(true)}
      />

      {/* Top 4 Real-time Stat Cards */}
      <DashboardStatsGrid metrics={metrics} />

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
