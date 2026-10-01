"use client";

import {
  ArrowUpDown,
  Building,
  Globe,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import {
  EXPERIENCE_LEVELS,
  JOB_SOURCE_PLATFORMS,
  WORKPLACE_TYPES,
} from "@/lib/validation";
import type { JobFiltersProps, JobSortOption } from "./types";

export function JobFilters({
  filters,
  onFilterChange,
  onReset,
  totalFiltered,
}: JobFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.workplaceType !== "all" ||
    filters.employmentType !== "all" ||
    filters.experienceLevel !== "all" ||
    filters.sourcePlatform !== "all" ||
    filters.sortBy !== "newest";

  return (
    <div className="card p-4 sm:p-5 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Top Search & Primary Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search Input (5 cols on lg) */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, company, skills..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="input pl-10 pr-9 text-sm h-10 w-full"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Workplace Type (Remote / Hybrid / Onsite) */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={filters.workplaceType}
              onChange={(e) =>
                onFilterChange(
                  "workplaceType",
                  e.target.value as typeof filters.workplaceType,
                )
              }
              className="input pl-8 pr-7 text-xs sm:text-sm h-10 w-full appearance-none cursor-pointer capitalize"
            >
              <option value="all">All Workplace</option>
              {WORKPLACE_TYPES.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Source Platform (LinkedIn, Indeed, Direct) */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={filters.sourcePlatform}
              onChange={(e) =>
                onFilterChange(
                  "sourcePlatform",
                  e.target.value as typeof filters.sourcePlatform,
                )
              }
              className="input pl-8 pr-7 text-xs sm:text-sm h-10 w-full appearance-none cursor-pointer capitalize"
            >
              <option value="all">All Platforms</option>
              {JOB_SOURCE_PLATFORMS.map((src) => (
                <option key={src} value={src} className="capitalize">
                  {src === "direct" ? "Platform Direct" : src}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience Level */}
        <div className="lg:col-span-2">
          <select
            value={filters.experienceLevel}
            onChange={(e) =>
              onFilterChange(
                "experienceLevel",
                e.target.value as typeof filters.experienceLevel,
              )
            }
            className="input px-3 text-xs sm:text-sm h-10 w-full appearance-none cursor-pointer capitalize"
          >
            <option value="all">All Experience</option>
            {EXPERIENCE_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl} className="capitalize">
                {lvl} Level
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="lg:col-span-2">
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange("sortBy", e.target.value as JobSortOption)
              }
              className="input pl-8 pr-6 text-xs sm:text-sm h-10 w-full appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Viewed</option>
              <option value="tokens_asc">Lowest Tokens</option>
              <option value="tokens_desc">Highest Tokens</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Clear */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Found {totalFiltered} {totalFiltered === 1 ? "job" : "jobs"}:
          </span>

          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
              Keyword: &quot;{filters.search}&quot;
              <button
                type="button"
                onClick={() => onFilterChange("search", "")}
                className="hover:text-blue-900 dark:hover:text-blue-100 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.workplaceType !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 capitalize">
              Workplace: {filters.workplaceType}
              <button
                type="button"
                onClick={() => onFilterChange("workplaceType", "all")}
                className="hover:text-indigo-900 dark:hover:text-indigo-100 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.sourcePlatform !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 capitalize">
              Platform: {filters.sourcePlatform}
              <button
                type="button"
                onClick={() => onFilterChange("sourcePlatform", "all")}
                className="hover:text-purple-900 dark:hover:text-purple-100 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-medium ml-auto cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
