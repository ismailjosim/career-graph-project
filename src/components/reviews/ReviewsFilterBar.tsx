import {
  ArrowUpDown,
  Briefcase,
  Building2,
  Filter,
  Search,
  UserCheck,
  X,
} from "lucide-react";
import type { ReviewRole } from "@/lib/validation";
import type { ReviewStats } from "./reviews.types";

interface ReviewsFilterBarProps {
  stats: ReviewStats;
  selectedRole: "all" | ReviewRole;
  onSelectRole: (role: "all" | ReviewRole) => void;
  selectedRating: string;
  onSelectRating: (rating: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sortBy: "featured" | "highest" | "recent";
  onSortChange: (sort: "featured" | "highest" | "recent") => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function ReviewsFilterBar({
  stats,
  selectedRole,
  onSelectRole,
  selectedRating,
  onSelectRating,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onResetFilters,
}: ReviewsFilterBarProps) {
  return (
    <div
      id="reviews-grid"
      className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
    >
      {/* Top row: Role tabs & Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Role / Persona Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-800 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => onSelectRole("all")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>All Stories</span>
            <span className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300">
              {stats.roleCounts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectRole("job_seeker")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === "job_seeker"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Job Seekers</span>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-[10px] text-blue-700 dark:text-blue-300">
              {stats.roleCounts.job_seeker}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectRole("recruiter")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === "recruiter"
                ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Recruiters</span>
            <span className="px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/60 text-[10px] text-teal-700 dark:text-teal-300">
              {stats.roleCounts.recruiter}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectRole("employer")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === "employer"
                ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Employers</span>
            <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-[10px] text-purple-700 dark:text-purple-300">
              {stats.roleCounts.employer}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reviews, outcome, company..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Rating dropdown & Sort selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Rating:</span>
          </span>
          <div className="flex items-center gap-1">
            {["all", "5", "4", "3"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => onSelectRating(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedRating === r
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {r === "all" ? "All Stars" : `${r} ★`}
              </button>
            ))}
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            <span>Sort by:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as "featured" | "highest" | "recent")
            }
            aria-label="Sort reviews"
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="featured">Featured Stories</option>
            <option value="highest">Highest Rated</option>
            <option value="recent">Most Recent</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
