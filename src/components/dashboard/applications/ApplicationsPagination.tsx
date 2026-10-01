"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ApplicationsPaginationProps } from "./types";

export function ApplicationsPagination({
  pagination,
  onPageChange,
  loading = false,
}: ApplicationsPaginationProps) {
  const { total, page, limit, totalPages, hasNextPage, hasPrevPage } =
    pagination;

  if (total === 0) return null;

  const startEntry = (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total);

  type PageItem =
    | { type: "page"; value: number; key: string }
    | { type: "ellipsis"; key: string };

  // Generate intelligent page numbers list with stable unique keys
  const getPageItems = (): PageItem[] => {
    const items: PageItem[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push({ type: "page", value: i, key: `page-${i}` });
      }
    } else {
      items.push({ type: "page", value: 1, key: "page-1" });

      if (page > 3) {
        items.push({ type: "ellipsis", key: "ellipsis-start" });
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push({ type: "page", value: i, key: `page-${i}` });
      }

      if (page < totalPages - 2) {
        items.push({ type: "ellipsis", key: "ellipsis-end" });
      }

      items.push({
        type: "page",
        value: totalPages,
        key: `page-${totalPages}`,
      });
    }

    return items;
  };

  const pageItems = getPageItems();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1 text-sm">
      {/* Left: Summary Count */}
      <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {startEntry}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {endEntry}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {total}
        </span>{" "}
        applications (10 per page)
      </div>

      {/* Right: Navigation Controls */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-full">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage || loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {pageItems.map((item) => {
            if (item.type === "ellipsis") {
              return (
                <span
                  key={item.key}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs"
                >
                  •••
                </span>
              );
            }

            const isActive = item.value === page;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onPageChange(item.value)}
                disabled={loading}
                className={`w-8 h-8 rounded-xl text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs shadow-blue-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60"
                }`}
              >
                {item.value}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage || loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
