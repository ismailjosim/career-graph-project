"use client";

import { ArrowLeft, Heart, Plus } from "lucide-react";
import Link from "next/link";
import type { WishlistHeaderProps } from "./types";

export function WishlistHeader({
  totalCount,
  filteredCount,
  onAddJob,
}: WishlistHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            <span>Job Wishlist</span>
          </h1>
          <p className="section-subtitle">
            {filteredCount} {filteredCount === 1 ? "job" : "jobs"} saved
            {totalCount !== filteredCount &&
              ` (filtered from ${totalCount} total)`}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddJob}
        className="btn-primary flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap"
      >
        <Plus className="w-4 h-4" />
        <span>Add Job</span>
      </button>
    </div>
  );
}
