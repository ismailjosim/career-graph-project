"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useState } from "react";
import type { AtsIssue, AtsSeverity } from "./types";

interface AtsIssuesListProps {
  issues: AtsIssue[];
}

export function AtsIssuesList({ issues }: AtsIssuesListProps) {
  const [filter, setFilter] = useState<"all" | AtsSeverity>("all");

  const filteredIssues =
    filter === "all" ? issues : issues.filter((i) => i.severity === filter);

  const getSeverityBadge = (severity: AtsSeverity) => {
    switch (severity) {
      case "high":
        return {
          label: "High Priority",
          icon: AlertCircle,
          badge:
            "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
        };
      case "medium":
        return {
          label: "Medium Priority",
          icon: AlertTriangle,
          badge:
            "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
        };
      case "low":
        return {
          label: "Low Priority",
          icon: Info,
          badge:
            "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
        };
    }
  };

  const highCount = issues.filter((i) => i.severity === "high").length;
  const mediumCount = issues.filter((i) => i.severity === "medium").length;
  const lowCount = issues.filter((i) => i.severity === "low").length;

  return (
    <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Identified Issues & Recommendations ({issues.length})
          </h2>
          <p className="text-xs text-slate-500">
            Fix these high and medium priority items to eliminate ATS parser red
            flags.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              filter === "all"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            All ({issues.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("high")}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              filter === "high"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100"
            }`}
          >
            High ({highCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("medium")}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              filter === "medium"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-100"
            }`}
          >
            Medium ({mediumCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("low")}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              filter === "low"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100"
            }`}
          >
            Low ({lowCount})
          </button>
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="p-8 text-center border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No issues found for this category!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => {
            const sev = getSeverityBadge(issue.severity);
            const SevIcon = sev.icon;

            return (
              <div
                key={issue.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border flex items-center gap-1 ${sev.badge}`}
                    >
                      <SevIcon className="w-3 h-3" />
                      <span>{sev.label}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {issue.title}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {issue.section}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-slate-700 dark:text-slate-300">
                    Problem:{" "}
                  </strong>
                  {issue.issue}
                </p>

                <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Recommended Fix: </span>
                    <span>{issue.recommendation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
