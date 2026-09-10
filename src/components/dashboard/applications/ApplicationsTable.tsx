"use client";

import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  ExternalLink,
  Eye,
  MapPin,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { confirmAction } from "@/lib/alerts";
import {
  formatEmploymentType,
  formatStatusLabel,
  getFitScoreColor,
  getStatusBadgeClass,
  getStatusDotClass,
} from "./applications.utils";
import type { ApplicationsTableProps } from "./types";

const SKELETON_ROW_KEYS = [
  "table-sk-1",
  "table-sk-2",
  "table-sk-3",
  "table-sk-4",
  "table-sk-5",
  "table-sk-6",
  "table-sk-7",
  "table-sk-8",
  "table-sk-9",
  "table-sk-10",
];

export function ApplicationsTable({
  applications,
  loading = false,
  onDelete,
  onResetFilters,
  hasActiveFilters = false,
}: ApplicationsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onDelete) return;

    const confirmed = await confirmAction({
      title: "Delete Application?",
      text: "Are you sure you want to delete this job application? This cannot be undone.",
      isDestructive: true,
      confirmButtonText: "Delete Application",
    });

    if (!confirmed) return;

    setDeletingId(id);
    try {
      await onDelete(id);
      toast.success("Application deleted successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete application",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Empty State (Unified across mobile & desktop) */}
      {!loading && applications.length === 0 ? (
        <div className="py-12 sm:py-16 px-4 text-center">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-xs">
              <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {hasActiveFilters
                ? "No matching applications"
                : "No job applications recorded yet"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {hasActiveFilters
                ? "Try adjusting your search criteria or clear your active filters to view all records."
                : "Start organizing your job search by adding your first submitted application."}
            </p>
            <div className="mt-5 flex gap-3">
              {hasActiveFilters && onResetFilters ? (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="btn-secondary text-xs px-4 py-2 cursor-pointer"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  href="/applications/new"
                  className="btn-primary text-xs px-4 py-2 cursor-pointer shadow-sm"
                >
                  Add Application
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card List View (< md) */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
            {loading
              ? SKELETON_ROW_KEYS.slice(0, 5).map((rowKey) => (
                  <div
                    key={`m-${rowKey}`}
                    className="p-4 space-y-3 animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                      <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                  </div>
                ))
              : applications.map((app) => {
                  const fitColor = getFitScoreColor(app.fitScore);
                  const isDeleting = deletingId === app._id;

                  return (
                    <div
                      key={`mobile-${app._id}`}
                      className="p-4 space-y-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Header: Company Avatar, Title, Link & Actions */}
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-xs shrink-0">
                            {app.company.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/applications/${app._id}`}
                              className="font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block transition-colors"
                            >
                              {app.jobTitle}
                            </Link>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                              <Building2 className="w-3 h-3 shrink-0" />
                              <span className="font-medium">{app.company}</span>
                              {app.jobLink && (
                                <a
                                  href={app.jobLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-1"
                                  title="Open Job Post URL"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Link
                            href={`/applications/${app._id}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {onDelete && (
                            <button
                              type="button"
                              onClick={(e) =>
                                handleDelete(app._id as string, e)
                              }
                              disabled={isDeleting}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors disabled:opacity-50"
                              title="Delete application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Status Badge & Fit Score */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                            app.status,
                          )}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ring-2 ${getStatusDotClass(
                              app.status,
                            )}`}
                          />
                          {formatStatusLabel(app.status)}
                        </span>

                        {app.fitScore !== undefined &&
                          app.fitScore !== null && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${fitColor.badge}`}
                            >
                              <Zap className="w-3 h-3 shrink-0" />
                              {app.fitScore}% Match
                            </span>
                          )}
                      </div>

                      {/* Meta details: Location, Date, Salary */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{app.location || "Remote / Unspecified"}</span>
                        </div>
                        <span>•</span>
                        <span>{formatEmploymentType(app.employmentType)}</span>
                        {app.salary && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                              <DollarSign className="w-3 h-3 shrink-0" />
                              <span>{app.salary}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* Desktop & Tablet Table View (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[540px]">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/60 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th scope="col" className="py-3.5 px-4 sm:px-6">
                    Company & Role
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Fit Score
                  </th>
                  <th scope="col" className="py-3.5 px-4 hidden md:table-cell">
                    Location & Type
                  </th>
                  <th scope="col" className="py-3.5 px-4 hidden lg:table-cell">
                    Applied Date
                  </th>
                  <th scope="col" className="py-3.5 px-4 hidden xl:table-cell">
                    Salary
                  </th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {loading
                  ? SKELETON_ROW_KEYS.map((rowKey) => (
                      <tr key={rowKey} className="animate-pulse">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                            <div className="space-y-2 flex-1">
                              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                        </td>
                        <td className="py-4 px-4 hidden xl:table-cell">
                          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
                        </td>
                      </tr>
                    ))
                  : applications.map((app) => {
                      const fitColor = getFitScoreColor(app.fitScore);
                      const isDeleting = deletingId === app._id;

                      return (
                        <tr
                          key={app._id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* Company & Role */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                                {app.company.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={`/applications/${app._id}`}
                                  className="font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block transition-colors"
                                >
                                  {app.jobTitle}
                                </Link>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                                  <Building2 className="w-3 h-3 shrink-0" />
                                  <span className="font-medium">
                                    {app.company}
                                  </span>
                                  {app.jobLink && (
                                    <a
                                      href={app.jobLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-1"
                                      title="Open Job Post URL"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                                app.status,
                              )}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ring-2 ${getStatusDotClass(
                                  app.status,
                                )}`}
                              />
                              {formatStatusLabel(app.status)}
                            </span>
                          </td>

                          {/* Fit Score */}
                          <td className="py-3.5 px-4">
                            {app.fitScore !== undefined &&
                            app.fitScore !== null ? (
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${fitColor.badge}`}
                                >
                                  <Zap className="w-3 h-3 shrink-0" />
                                  {app.fitScore}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                —
                              </span>
                            )}
                          </td>

                          {/* Location & Type */}
                          <td className="py-3.5 px-4 hidden md:table-cell">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 font-medium truncate max-w-44">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>
                                  {app.location || "Remote / Unspecified"}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-normal">
                                {formatEmploymentType(app.employmentType)}
                              </span>
                            </div>
                          </td>

                          {/* Applied Date */}
                          <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>
                                {app.appliedAt
                                  ? new Date(app.appliedAt).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      },
                                    )
                                  : "—"}
                              </span>
                            </div>
                          </td>

                          {/* Salary */}
                          <td className="py-3.5 px-4 hidden xl:table-cell text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {app.salary ? (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span>{app.salary}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500">
                                —
                              </span>
                            )}
                          </td>

                          {/* Action buttons */}
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/applications/${app._id}`}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                title="View application details"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              {onDelete && (
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handleDelete(app._id as string, e)
                                  }
                                  disabled={isDeleting}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
                                  title="Delete application"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
