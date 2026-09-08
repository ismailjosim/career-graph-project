"use client";

import {
  Award,
  BarChart3,
  Briefcase,
  CheckCircle,
  Clock,
  ExternalLink,
  LineChart,
  Plus,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useJobApplications, useMonthlyStats } from "@/hooks/useApi";
import type { JobApplication } from "@/lib/validation";

interface AddApplicationForm {
  jobTitle: string;
  company: string;
  description: string;
  jobLink: string;
  fitScore: string;
  notes: string;
  status: string;
  salary: string;
  location: string;
  employmentType: string;
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const {
    applications,
    loading: appLoading,
    createApplication,
    fetchApplications,
  } = useJobApplications();
  const { refreshStats } = useMonthlyStats();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartView, setChartView] = useState<"metrics" | "timeline">("metrics");

  const [formData, setFormData] = useState<AddApplicationForm>({
    jobTitle: "",
    company: "",
    description: "",
    jobLink: "",
    fitScore: "",
    notes: "",
    status: "applied",
    salary: "",
    location: "",
    employmentType: "",
  });

  // Calculate live dynamic metrics from applications in real time
  const metrics = useMemo(() => {
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
    const interviewRate =
      total > 0 ? Math.round((interviews / total) * 100) : 0;
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
          (a) =>
            a.status === "interview_scheduled" || a.status === "interviewed",
        ).length,
        lastMonthApps.filter(
          (a) =>
            a.status === "interview_scheduled" || a.status === "interviewed",
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
  }, [applications]);

  // Chart data 1: Current Metric Breakdown
  const metricsChartData = useMemo(() => {
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
  }, [metrics]);

  // Chart data 2: 6-Month Timeline Performance
  const timelineChartData = useMemo(() => {
    const months = [];
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
  }, [applications]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submissionData: Omit<
        JobApplication,
        "_id" | "userId" | "appliedAt"
      > = {
        jobTitle: formData.jobTitle,
        company: formData.company,
        description: formData.description || undefined,
        jobLink: formData.jobLink || undefined,
        fitScore: formData.fitScore
          ? Number.parseInt(formData.fitScore, 10)
          : undefined,
        notes: formData.notes || undefined,
        status: formData.status as JobApplication["status"],
        salary: formData.salary || undefined,
        location: formData.location || undefined,
        employmentType: formData.employmentType as
          | JobApplication["employmentType"]
          | undefined,
        resumeUsed: "default-resume",
      };

      await createApplication(submissionData);
      setFormData({
        jobTitle: "",
        company: "",
        description: "",
        jobLink: "",
        fitScore: "",
        notes: "",
        status: "applied",
        salary: "",
        location: "",
        employmentType: "",
      });
      setShowModal(false);
      await fetchApplications();
      await refreshStats();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create application",
      );
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
  }: {
    title: string;
    value: number;
    icon: React.ComponentType<{ className: string }>;
    color: string;
    trend?: number;
  }) => {
    const isPositive = (trend ?? 0) >= 0;
    return (
      <div className="stat-card group hover:scale-[1.02] transition-transform">
        <div className="flex items-start justify-between">
          <div>
            <p className="stat-label">{title}</p>
            <p className="stat-value mt-1">{value}</p>
            {trend !== undefined && (
              <p
                className={`text-xs font-semibold mt-2 flex items-center gap-1 ${
                  isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{trend > 0 ? `+${trend}%` : `${trend}%`} this month</span>
              </p>
            )}
          </div>
          <div
            className={`${color} p-3 rounded-2xl text-white shadow-md group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  if (appLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
            Loading your job tracker dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="section-title flex items-center gap-2.5">
            Dashboard Overview
            {metrics.total > 0 && (
              <span className="badge-primary text-xs font-semibold px-2.5 py-0.5">
                {metrics.total} {metrics.total === 1 ? "Job" : "Jobs"} Tracked
              </span>
            )}
          </h1>
          <p className="section-subtitle">
            Real-time insights into your job hunt pipeline and interview success
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="btn-primary flex-1 md:flex-initial shadow-lg hover:shadow-xl cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Top 4 Real-time Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Applications"
          value={metrics.total}
          icon={Briefcase}
          color="bg-linear-to-br from-blue-600 to-indigo-600"
          trend={metrics.trends.total}
        />
        <StatCard
          title="Positive Responses"
          value={metrics.positiveResponses}
          icon={CheckCircle}
          color="bg-linear-to-br from-emerald-500 to-teal-600"
          trend={metrics.trends.responses}
        />
        <StatCard
          title="Rejections"
          value={metrics.rejections}
          icon={XCircle}
          color="bg-linear-to-br from-rose-500 to-red-600"
          trend={metrics.trends.rejections}
        />
        <StatCard
          title="Interviews"
          value={metrics.interviews}
          icon={Clock}
          color="bg-linear-to-br from-amber-500 to-orange-600"
          trend={metrics.trends.interviews}
        />
      </div>

      {/* Performance Charts & Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Chart Card */}
        <div className="lg:col-span-2 card p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Monthly Performance</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {chartView === "metrics"
                  ? "Breakdown across total pipeline stages"
                  : "Application activity over the last 6 months"}
              </p>
            </div>

            {/* View Mode Toggle Button */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setChartView("metrics")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  chartView === "metrics"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>By Metric</span>
              </button>
              <button
                type="button"
                onClick={() => setChartView("timeline")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  chartView === "timeline"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>
            </div>
          </div>

          <div className="h-70 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === "metrics" ? (
                <BarChart
                  data={metricsChartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="currentColor"
                    className="text-slate-500 dark:text-slate-400 text-xs"
                    tickLine={false}
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-slate-500 dark:text-slate-400 text-xs"
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{
                      fill: theme === "dark" ? "#1e293b50" : "#f1f5f980",
                    }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
                      borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                      borderRadius: "0.75rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="applications"
                    radius={[8, 8, 0, 0]}
                    animationDuration={600}
                  >
                    {metricsChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart
                  data={timelineChartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="currentColor"
                    className="text-slate-500 dark:text-slate-400 text-xs"
                    tickLine={false}
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-slate-500 dark:text-slate-400 text-xs"
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
                      borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                  />
                  <Bar
                    dataKey="applied"
                    name="Applications"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="responses"
                    name="Responses"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="offers"
                    name="Offers"
                    fill="#8b5cf6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Insights Card */}
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Quick Insights</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Live Stats
              </span>
            </div>

            <div className="space-y-4">
              {/* Response Rate */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Response Rate
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {metrics.responseRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-linear-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(metrics.responseRate, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  {metrics.positiveResponses + metrics.rejections} of{" "}
                  {metrics.total} employers replied
                </p>
              </div>

              {/* Interview Conversion Rate */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Interview Rate
                  </span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {metrics.interviewRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-linear-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(metrics.interviewRate, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  {metrics.interviews} interviews secured
                </p>
              </div>

              {/* Offer Rate */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Offer Rate
                  </span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    {metrics.offerRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-linear-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(metrics.offerRate, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  {metrics.offers} job{" "}
                  {metrics.offers === 1 ? "offer" : "offers"} received
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Status</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Tracker
            </span>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              Recent Applications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Latest applications in your pipeline
            </p>
          </div>

          <Link
            href="/applications"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              No applications tracked yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Start tracking your job search journey by adding your first
              application.
            </p>
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="btn-primary text-sm py-2 px-4 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Job</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 text-left font-semibold">
                    Job Title
                  </th>
                  <th className="px-6 py-3.5 text-left font-semibold">
                    Company
                  </th>
                  <th className="px-6 py-3.5 text-left font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-left font-semibold">
                    Fit Score
                  </th>
                  <th className="px-6 py-3.5 text-left font-semibold">
                    Applied
                  </th>
                  <th className="px-6 py-3.5 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {applications.slice(0, 6).map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                      {app.jobTitle}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      {app.company}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          app.status === "offer_received"
                            ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50"
                            : app.status === "interview_scheduled" ||
                                app.status === "interviewed"
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                              : app.status === "rejected"
                                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50"
                                : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50"
                        }`}
                      >
                        {app.status?.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {app.fitScore ? (
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {app.fitScore}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/applications/${app._id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-xs hover:underline"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Application Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h2 className="section-title text-xl">Add Job Application</h2>
                <p className="section-subtitle text-xs">
                  Fill in the details to update your charts and tracking metrics
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-sm">
                  {error}
                </div>
              )}

              {/* Job Title & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="e.g., Senior Full Stack Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="e.g., Stripe"
                  />
                </div>
              </div>

              {/* Location & Employment Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., Remote / New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Status & Fit Score */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="applied">Applied</option>
                    <option value="interview_scheduled">
                      Interview Scheduled
                    </option>
                    <option value="interviewed">Interviewed</option>
                    <option value="offer_received">Offer Received 🎉</option>
                    <option value="rejected">Rejected</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Fit Score (0-100)
                  </label>
                  <input
                    type="number"
                    name="fitScore"
                    value={formData.fitScore}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="input"
                    placeholder="e.g., 92"
                  />
                </div>
              </div>

              {/* Salary Range & Job Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., $140,000 - $170,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Job Link
                  </label>
                  <input
                    type="url"
                    name="jobLink"
                    value={formData.jobLink}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="input"
                  placeholder="Notes about interview rounds, referral, or benefits..."
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Application"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
