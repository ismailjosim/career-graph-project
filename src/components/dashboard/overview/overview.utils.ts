import type { JobApplication } from "@/lib/validation";
import type {
  DashboardMetrics,
  MetricChartItem,
  TimelineChartItem,
} from "./types";

/**
 * Calculates dynamic real-time metrics and month-over-month trends from applications.
 */
export function calculateDashboardMetrics(
  applications: JobApplication[],
): DashboardMetrics {
  const total = applications.length;

  // Positive responses include interviews, offers, and positive responses
  const positiveResponses = applications.filter(
    (app) =>
      app.status === "interview_scheduled" ||
      app.status === "interviewed" ||
      app.status === "offer_received" ||
      app.responseType === "positive",
  ).length;

  const rejections = applications.filter(
    (app) => app.status === "rejected" || app.responseType === "negative",
  ).length;

  const interviews = applications.filter(
    (app) =>
      app.status === "interview_scheduled" || app.status === "interviewed",
  ).length;

  const offers = applications.filter(
    (app) => app.status === "offer_received",
  ).length;

  const appliedOnly = applications.filter(
    (app) => app.status === "applied",
  ).length;

  const totalResponded = positiveResponses + rejections;
  const responseRate =
    total > 0 ? Math.round((totalResponded / total) * 100) : 0;
  const interviewRate = total > 0 ? Math.round((interviews / total) * 100) : 0;
  const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  // Month-over-month trend calculation
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthApps = applications.filter((app) => {
    const d = new Date(app.appliedAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const lastMonthApps = applications.filter((app) => {
    const d = new Date(app.appliedAt);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  const calcTrend = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - prev) / prev) * 100);
  };

  const trends = {
    total: calcTrend(thisMonthApps.length, lastMonthApps.length),
    responses: calcTrend(
      thisMonthApps.filter((a) =>
        [
          "interview_scheduled",
          "interviewed",
          "offer_received",
          "rejected",
        ].includes(a.status),
      ).length,
      lastMonthApps.filter((a) =>
        [
          "interview_scheduled",
          "interviewed",
          "offer_received",
          "rejected",
        ].includes(a.status),
      ).length,
    ),
    rejections: calcTrend(
      thisMonthApps.filter((a) => a.status === "rejected").length,
      lastMonthApps.filter((a) => a.status === "rejected").length,
    ),
    interviews: calcTrend(
      thisMonthApps.filter(
        (a) => a.status === "interview_scheduled" || a.status === "interviewed",
      ).length,
      lastMonthApps.filter(
        (a) => a.status === "interview_scheduled" || a.status === "interviewed",
      ).length,
    ),
  };

  return {
    total,
    positiveResponses,
    rejections,
    interviews,
    offers,
    appliedOnly,
    responseRate,
    interviewRate,
    offerRate,
    trends,
    thisMonthTotal: thisMonthApps.length,
  };
}

/**
 * Builds metric breakdown chart data for the bar chart.
 */
export function buildMetricsChartData(
  metrics: DashboardMetrics,
): MetricChartItem[] {
  return [
    {
      name: "Total",
      applications: metrics.total,
      fill: "#3b82f6", // Blue
    },
    {
      name: "Responses",
      applications: metrics.positiveResponses,
      fill: "#10b981", // Emerald
    },
    {
      name: "Rejections",
      applications: metrics.rejections,
      fill: "#f43f5e", // Rose
    },
    {
      name: "Interviews",
      applications: metrics.interviews,
      fill: "#f59e0b", // Amber
    },
    {
      name: "Offers",
      applications: metrics.offers,
      fill: "#8b5cf6", // Purple
    },
  ];
}

/**
 * Builds 6-month timeline chart data.
 */
export function buildTimelineChartData(
  applications: JobApplication[],
): TimelineChartItem[] {
  const months: TimelineChartItem[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mIndex = d.getMonth();
    const yVal = d.getFullYear();
    const monthLabel = d.toLocaleString("default", { month: "short" });

    const monthApps = applications.filter((app) => {
      const appDate = new Date(app.appliedAt);
      return appDate.getMonth() === mIndex && appDate.getFullYear() === yVal;
    });

    const applied = monthApps.length;
    const responses = monthApps.filter(
      (a) =>
        a.status === "interview_scheduled" ||
        a.status === "interviewed" ||
        a.status === "offer_received",
    ).length;
    const offers = monthApps.filter(
      (a) => a.status === "offer_received",
    ).length;

    months.push({
      name: monthLabel,
      applied,
      responses,
      offers,
    });
  }

  return months;
}
