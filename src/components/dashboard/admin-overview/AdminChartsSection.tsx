"use client";

import { Activity, BarChart3, PieChart, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
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
import type { AdminAiMetrics, AdminJobMetrics, AdminTimelinePoint } from "./types";

interface AdminChartsSectionProps {
  timeline: AdminTimelinePoint[];
  aiTools: AdminAiMetrics;
  jobs: AdminJobMetrics;
}

export function AdminChartsSection({
  timeline,
  aiTools,
  jobs,
}: AdminChartsSectionProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Data for AI Tools Distribution Bar Chart
  const aiDistributionData = [
    { name: "Fit Analysis", count: aiTools.fitAnalysisRuns, color: "#6366f1" },
    { name: "Cover Letters", count: aiTools.coverLettersGenerated, color: "#3b82f6" },
    { name: "ATS Scans", count: aiTools.atsChecksRuns, color: "#10b981" },
  ];

  // Data for Job Sources Breakdown
  const jobSourcesData = [
    { name: "Direct", count: jobs.bySource.direct || 0, color: "#6366f1" },
    { name: "LinkedIn", count: jobs.bySource.linkedin || 0, color: "#0077b5" },
    { name: "Indeed", count: jobs.bySource.indeed || 0, color: "#2164f3" },
    { name: "Glassdoor/Other", count: (jobs.bySource.glassdoor || 0) + (jobs.bySource.other || 0), color: "#0caa41" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left (2 Cols): Platform Activity Timeline Area Chart */}
      <div className="lg:col-span-2 card p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>Platform Trajectory & Activity</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Registration, applications, and outbound clicks velocity over time
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Applications</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Clicks</span>
            </div>
          </div>
        </div>

        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#334155" : "#f1f5f9"}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke={isDark ? "#64748b" : "#94a3b8"}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={isDark ? "#64748b" : "#94a3b8"}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#0f172a" : "#ffffff",
                  borderColor: isDark ? "#334155" : "#e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="applications"
                name="Applications"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#appGradient)"
              />
              <Area
                type="monotone"
                dataKey="clicks"
                name="External Clicks"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#clickGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right (1 Col): AI Tools Distribution */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Tools Demand</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Generative career tools consumption
          </p>
        </div>

        <div className="w-full h-48 sm:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aiDistributionData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? "#334155" : "#f1f5f9"} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                stroke={isDark ? "#94a3b8" : "#64748b"}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={85}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#0f172a" : "#ffffff",
                  borderColor: isDark ? "#334155" : "#e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" name="Generations" radius={[0, 8, 8, 0]}>
                {aiDistributionData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Job Sources Breakdown */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Job Platforms Distribution
          </span>
          <div className="grid grid-cols-2 gap-2">
            {jobSourcesData.map((src) => (
              <div
                key={src.name}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <span className="text-slate-600 dark:text-slate-400 font-medium truncate">
                  {src.name}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {src.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
