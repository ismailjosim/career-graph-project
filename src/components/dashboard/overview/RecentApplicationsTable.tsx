"use client";

import { Briefcase, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import type { RecentApplicationsTableProps } from "./types";

export function RecentApplicationsTable({
  applications,
  onAddApplication,
}: RecentApplicationsTableProps) {
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "offer_received":
        return "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50";
      case "interview_scheduled":
      case "interviewed":
        return "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50";
      case "rejected":
        return "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50";
      default:
        return "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50";
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
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
        <div className="p-8 sm:p-12 text-center space-y-3">
          <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
            No applications tracked yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Start tracking your job search journey by adding your first
            application.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onAddApplication}
              className="btn-primary text-xs sm:text-sm py-2 px-4 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Job</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card List View (< sm) */}
          <div className="divide-y divide-slate-200 dark:divide-slate-800 sm:hidden">
            {applications.slice(0, 6).map((app) => (
              <div key={app._id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {app.jobTitle}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                      {app.company}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${getStatusBadgeStyle(
                      app.status,
                    )}`}
                  >
                    {app.status?.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    {app.fitScore ? (
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {app.fitScore}% Fit
                      </span>
                    ) : (
                      <span>No fit score</span>
                    )}
                    <span>•</span>
                    <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <Link
                    href={`/applications/${app._id}`}
                    className="text-blue-600 dark:text-blue-400 font-semibold text-xs hover:underline flex items-center gap-0.5"
                  >
                    <span>Details</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop & Tablet Table View (>= sm) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm min-w-145">
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
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeStyle(
                          app.status,
                        )}`}
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
        </>
      )}
    </div>
  );
}
