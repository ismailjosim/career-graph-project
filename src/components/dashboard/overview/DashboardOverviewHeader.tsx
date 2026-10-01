"use client";

import { Plus } from "lucide-react";
import type { DashboardOverviewHeaderProps } from "./types";

export function DashboardOverviewHeader({
  totalApplications,
  onAddApplication,
}: DashboardOverviewHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="section-title flex items-center gap-2.5">
          Dashboard Overview
          {totalApplications > 0 && (
            <span className="badge-primary text-xs font-semibold px-2.5 py-0.5">
              {totalApplications} {totalApplications === 1 ? "Job" : "Jobs"}{" "}
              Tracked
            </span>
          )}
        </h1>
        <p className="section-subtitle">
          Real-time insights into your job hunt pipeline and interview success
        </p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          type="button"
          onClick={onAddApplication}
          className="btn-primary flex-1 md:flex-initial shadow-lg hover:shadow-xl cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Application</span>
        </button>
      </div>
    </div>
  );
}
