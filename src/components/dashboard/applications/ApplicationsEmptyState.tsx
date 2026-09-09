import { Briefcase, FilterX, Plus } from "lucide-react";
import Link from "next/link";
import type { ApplicationsEmptyStateProps } from "./types";

export function ApplicationsEmptyState({
  hasFilters,
  onResetFilters,
}: ApplicationsEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="card p-12 text-center space-y-3">
        <FilterX className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
          No matching applications
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          We couldn't find any applications matching your current search or
          status filters.
        </p>
        {onResetFilters && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onResetFilters}
              className="btn-secondary text-sm py-2 px-4 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card p-12 text-center space-y-3">
      <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
        No applications tracked yet
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        Start tracking your job search journey by adding your first job
        application.
      </p>
      <div className="pt-2 flex justify-center">
        <Link
          href="/applications/new"
          className="btn-primary text-sm py-2 px-4 shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add First Application</span>
        </Link>
      </div>
    </div>
  );
}
