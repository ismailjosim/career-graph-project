"use client";

import { Search, X } from "lucide-react";
import { DEFAULT_STATUS_OPTIONS } from "./applications.utils";
import type { LegacyApplicationsFilterBarProps, StatusOption } from "./types";

export function ApplicationsFilterBar({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  statusOptions = DEFAULT_STATUS_OPTIONS,
}: LegacyApplicationsFilterBarProps) {
  return (
    <div className="card p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-12 pr-10"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {statusOptions.map((status: StatusOption) => {
            const isActive = filterStatus === status.value;
            return (
              <button
                key={status.value}
                type="button"
                onClick={() => onFilterStatusChange(status.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
