import { FilterX, Heart, Plus } from "lucide-react";
import type { WishlistEmptyStateProps } from "./types";

export function WishlistEmptyState({
  hasFilters,
  onResetFilters,
  onAddJob,
}: WishlistEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="card p-12 text-center space-y-3">
        <FilterX className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
          No matching saved jobs
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          We couldn't find any saved jobs matching your current search or status
          filter.
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
      <Heart className="w-12 h-12 text-rose-300 dark:text-rose-900/60 mx-auto" />
      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
        No jobs saved yet
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        Save interesting job posts to review them later before applying.
      </p>
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={onAddJob}
          className="btn-primary text-sm py-2 px-4 shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add First Job</span>
        </button>
      </div>
    </div>
  );
}
