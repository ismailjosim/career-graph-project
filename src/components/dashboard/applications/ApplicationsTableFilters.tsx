"use client";

import { ArrowUpDown, Filter, RotateCcw, Search, X } from "lucide-react";
import {
  DEFAULT_EMPLOYMENT_TYPE_OPTIONS,
  DEFAULT_SORT_OPTIONS,
  DEFAULT_STATUS_OPTIONS,
  formatEmploymentType,
  formatStatusLabel,
} from "./applications.utils";
import type {
  ApplicationEmploymentType,
  ApplicationFilterStatus,
  ApplicationSortBy,
  ApplicationSortOrder,
  ApplicationsFilterBarProps,
} from "./types";

export function ApplicationsTableFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  employmentType,
  onEmploymentTypeChange,
  sortBy,
  sortOrder,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
  totalFiltered,
}: ApplicationsFilterBarProps) {
  const currentSortKey = `${sortBy}-${sortOrder}`;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const [field, order] = val.split("-") as [
      ApplicationSortBy,
      ApplicationSortOrder,
    ];
    onSortChange(field, order);
  };

  return (
    <div className="card p-4 sm:p-5 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Top Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search Input (5 cols on lg) */}
        <div className="lg:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, company, location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10 pr-9 text-sm h-10 w-full"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Clear search text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown (3 cols on lg) */}
        <div className="lg:col-span-3">
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) =>
                onFilterStatusChange(e.target.value as ApplicationFilterStatus)
              }
              className="input pl-10 pr-8 text-sm h-10 w-full appearance-none cursor-pointer"
            >
              {DEFAULT_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employment Type Dropdown (2 cols on lg) */}
        <div className="lg:col-span-2">
          <select
            value={employmentType}
            onChange={(e) =>
              onEmploymentTypeChange(
                e.target.value as ApplicationEmploymentType,
              )
            }
            className="input px-3 text-sm h-10 w-full appearance-none cursor-pointer"
          >
            {DEFAULT_EMPLOYMENT_TYPE_OPTIONS.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown (2 cols on lg) */}
        <div className="lg:col-span-2">
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={currentSortKey}
              onChange={handleSortChange}
              className="input pl-9 pr-6 text-xs sm:text-sm h-10 w-full appearance-none cursor-pointer"
            >
              {DEFAULT_SORT_OPTIONS.map((opt) => (
                <option
                  key={`${opt.sortBy}-${opt.sortOrder}`}
                  value={`${opt.sortBy}-${opt.sortOrder}`}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Clear All */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active Filters ({totalFiltered} results):
          </span>

          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
              Query: &quot;{searchTerm}&quot;
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="hover:text-blue-900 dark:hover:text-blue-100 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterStatus !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
              Status: {formatStatusLabel(filterStatus)}
              <button
                type="button"
                onClick={() => onFilterStatusChange("all")}
                className="hover:text-indigo-900 dark:hover:text-indigo-100 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {employmentType !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/40">
              Type: {formatEmploymentType(employmentType)}
              <button
                type="button"
                onClick={() => onEmploymentTypeChange("all")}
                className="hover:text-violet-900 dark:hover:text-violet-100 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-medium ml-auto cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset all filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
