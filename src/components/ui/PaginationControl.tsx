"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemName?: string;
  className?: string;
}

export function PaginationControl({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemName = "items",
  className = "",
}: PaginationControlProps) {
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalItems);

  type PageItem =
    | { type: "page"; value: number; key: string }
    | { type: "ellipsis"; key: string };

  const getPageItems = (): PageItem[] => {
    const items: PageItem[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push({ type: "page", value: i, key: `page-${i}` });
      }
    } else {
      items.push({ type: "page", value: 1, key: "page-1" });

      if (currentPage > 3) {
        items.push({ type: "ellipsis", key: "ellipsis-start" });
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push({ type: "page", value: i, key: `page-${i}` });
      }

      if (currentPage < totalPages - 2) {
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
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-2 text-sm border-t border-slate-200 dark:border-slate-800 ${className}`}
    >
      {/* Left: Summary */}
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
          {totalItems}
        </span>{" "}
        {itemName}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shrink-0"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
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

            const isActive = item.value === currentPage;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onPageChange(item.value)}
                className={`w-8 h-8 rounded-xl text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white font-bold shadow-xs shadow-blue-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                }`}
                aria-label={`Go to page ${item.value}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.value}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shrink-0"
          aria-label="Next page"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
