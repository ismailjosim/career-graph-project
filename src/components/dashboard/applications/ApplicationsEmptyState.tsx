"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";

interface ApplicationsEmptyStateProps {
  hasActiveFilters?: boolean;
  hasFilters?: boolean;
  onResetFilters?: () => void;
}

export function ApplicationsEmptyState({
  hasActiveFilters,
  hasFilters,
  onResetFilters,
}: ApplicationsEmptyStateProps) {
  const isFiltered = hasActiveFilters || hasFilters;
  return (
    <div className="py-12 sm:py-16 px-4 text-center">
      <div className="max-w-md mx-auto flex flex-col items-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-xs">
          <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
          {isFiltered
            ? "No matching applications"
            : "No job applications recorded yet"}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          {isFiltered
            ? "Try adjusting your search criteria or clear your active filters to view all records."
            : "Start organizing your job search by adding your first submitted application."}
        </p>
        <div className="mt-5 flex gap-3">
          {isFiltered && onResetFilters ? (
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
  );
}
