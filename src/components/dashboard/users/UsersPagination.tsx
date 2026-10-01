"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface UsersPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function UsersPagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
}: UsersPaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 text-xs text-slate-500">
      <div>
        Showing{" "}
        <span className="font-bold text-slate-700 dark:text-slate-300">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-bold text-slate-700 dark:text-slate-300">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-bold text-slate-700 dark:text-slate-300">
          {total}
        </span>{" "}
        users
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-2.5 py-1 text-xs font-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
