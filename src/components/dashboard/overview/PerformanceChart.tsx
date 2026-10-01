"use client";

import { BarChart3, LineChart } from "lucide-react";
import { useTheme } from "next-themes";
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
import type { PerformanceChartProps } from "./types";

export function PerformanceChart({
  metricsChartData,
  timelineChartData,
  chartView,
  onChartViewChange,
}: PerformanceChartProps) {
  const { theme } = useTheme();

  return (
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
            onClick={() => onChartViewChange("metrics")}
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
            onClick={() => onChartViewChange("timeline")}
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
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
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
  );
}
