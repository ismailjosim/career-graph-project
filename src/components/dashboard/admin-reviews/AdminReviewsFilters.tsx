"use client";

import { Search } from "lucide-react";

interface AdminReviewsFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedRole: string;
  onRoleChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
}

export function AdminReviewsFilters({
  search,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
}: AdminReviewsFiltersProps) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reviewer, outcome, content..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Selectors */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            aria-label="Filter by reviewer role"
            className="flex-1 sm:flex-none px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="job_seeker">Job Seekers</option>
            <option value="recruiter">Recruiters</option>
            <option value="employer">Employers</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by review status"
            className="flex-1 sm:flex-none px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="featured">Featured</option>
          </select>
        </div>
      </div>
    </div>
  );
}
