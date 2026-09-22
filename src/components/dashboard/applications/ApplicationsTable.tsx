"use client";

import { useState } from "react";
import { toast } from "sonner";
import { confirmAction } from "@/lib/alerts";
import { ApplicationMobileCard } from "./ApplicationMobileCard";
import { ApplicationTableRow } from "./ApplicationTableRow";
import { ApplicationsEmptyState } from "./ApplicationsEmptyState";
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
        <ApplicationsEmptyState
          hasActiveFilters={hasActiveFilters}
          onResetFilters={onResetFilters}
        />
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
              : applications.map((app) => (
                  <ApplicationMobileCard
                    key={`mobile-${app._id}`}
                    app={app}
                    isDeleting={deletingId === app._id}
                    onDelete={onDelete ? handleDelete : undefined}
                  />
                ))}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th scope="col" className="py-3.5 px-4 sm:px-6">
                    Job & Company
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
                  : applications.map((app) => (
                      <ApplicationTableRow
                        key={app._id}
                        app={app}
                        isDeleting={deletingId === app._id}
                        onDelete={onDelete ? handleDelete : undefined}
                      />
                    ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
