import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import type { ApplicationsHeaderProps } from "./types";

export function ApplicationsHeader({
  totalCount,
  filteredCount,
}: ApplicationsHeaderProps) {
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
          <h1 className="section-title">All Applications</h1>
          <p className="section-subtitle">
            {filteredCount}{" "}
            {filteredCount === 1 ? "application" : "applications"} found
            {totalCount !== filteredCount &&
              ` (filtered from ${totalCount} total)`}
          </p>
        </div>
      </div>

      <Link
        href="/applications/new"
        className="btn-primary flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>New Application</span>
      </Link>
    </div>
  );
}
