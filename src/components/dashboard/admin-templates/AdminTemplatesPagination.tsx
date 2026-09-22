"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationState } from "./types";

interface AdminTemplatesPaginationProps {
  pagination: PaginationState;
  onPageChange: (newPage: number) => void;
}

export function AdminTemplatesPagination({
  pagination,
  onPageChange,
}: AdminTemplatesPaginationProps) {
  return (
    <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Showing {(pagination.page - 1) * pagination.limit + 1}–
        {Math.min(
          pagination.page * pagination.limit,
          pagination.totalTemplates,
        )}{" "}
        of {pagination.totalTemplates} templates
      </span>

      <div className="flex items-center gap-1.5">
        {/* Previous Page */}
        <button
          type="button"
          disabled={!pagination.hasPrevPage}
          onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {/* Numbered Page Buttons */}
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
          (pNum) => (
            <button
              key={pNum}
              type="button"
              onClick={() => onPageChange(pNum)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pagination.page === pNum
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {pNum}
            </button>
          ),
        )}

        {/* Next Page */}
        <button
          type="button"
          disabled={!pagination.hasNextPage}
          onClick={() =>
            onPageChange(Math.min(pagination.totalPages, pagination.page + 1))
          }
          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
