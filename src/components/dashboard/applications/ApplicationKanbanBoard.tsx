"use client";

import { Building2, Calendar, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import type { JobApplication } from "@/lib/validation";
import { ApplicationStatusDropdown } from "./ApplicationStatusDropdown";

interface ApplicationKanbanBoardProps {
  applications: JobApplication[];
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface ColumnConfig {
  id: JobApplication["status"];
  title: string;
  accent: string;
  badgeBg: string;
  headerBorder: string;
}

const KANBAN_COLUMNS: ColumnConfig[] = [
  {
    id: "applied",
    title: "Applied",
    accent: "text-blue-600 dark:text-blue-400",
    badgeBg:
      "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    headerBorder: "border-t-4 border-blue-500",
  },
  {
    id: "interview_scheduled",
    title: "Interview Scheduled",
    accent: "text-amber-600 dark:text-amber-400",
    badgeBg:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    headerBorder: "border-t-4 border-amber-500",
  },
  {
    id: "interviewed",
    title: "Interviewed",
    accent: "text-purple-600 dark:text-purple-400",
    badgeBg:
      "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    headerBorder: "border-t-4 border-purple-500",
  },
  {
    id: "offer_received",
    title: "Offer Received",
    accent: "text-emerald-600 dark:text-emerald-400",
    badgeBg:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    headerBorder: "border-t-4 border-emerald-500",
  },
  {
    id: "rejected",
    title: "Rejected / Closed",
    accent: "text-rose-600 dark:text-rose-400",
    badgeBg:
      "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    headerBorder: "border-t-4 border-rose-500",
  },
];

export function ApplicationKanbanBoard({
  applications,
  onStatusChange,
  onDelete: _onDelete,
}: ApplicationKanbanBoardProps) {
  // Format localized date
  const formatDate = (dateStr?: Date | string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
      }).format(d);
    } catch {
      return String(dateStr);
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="flex gap-4 min-w-250 items-start">
        {KANBAN_COLUMNS.map((col) => {
          const colApps = applications.filter((app) => {
            if (col.id === "rejected") {
              return app.status === "rejected" || app.status === "withdrawn";
            }
            return app.status === col.id;
          });

          return (
            <div
              key={col.id}
              className={`flex-1 min-w-62.5 max-w-100 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-3 flex flex-col gap-3 shadow-xs ${col.headerBorder}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1.5 py-1">
                <span
                  className={`text-xs font-black uppercase tracking-wider ${col.accent}`}
                >
                  {col.title}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${col.badgeBg}`}
                >
                  {colApps.length}
                </span>
              </div>

              {/* Cards in column */}
              <div className="space-y-3 min-h-96">
                {colApps.length === 0 ? (
                  <div className="h-32 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center p-4 text-center">
                    <span className="text-xs text-slate-400">
                      No applications in {col.title}
                    </span>
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app._id}
                      className="group p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
                    >
                      {/* Top Bar: Company + Status Dropdown */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{app.company}</span>
                          </div>
                          <Link
                            href={`/applications/${app._id}`}
                            className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 leading-snug transition-colors"
                          >
                            {app.jobTitle}
                          </Link>
                        </div>

                        {app.fitScore !== undefined &&
                          app.fitScore !== null && (
                            <span
                              className={`shrink-0 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                                app.fitScore >= 80
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                  : app.fitScore >= 60
                                    ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {app.fitScore}%
                            </span>
                          )}
                      </div>

                      {/* Metadata badges */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {app.location && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-25">
                              {app.location}
                            </span>
                          </span>
                        )}
                        {app.appliedAt && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(app.appliedAt)}</span>
                          </span>
                        )}
                      </div>

                      {/* Status changer & Link */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                        <ApplicationStatusDropdown
                          currentStatus={app.status || "applied"}
                          applicationId={app._id || ""}
                          onUpdateStatus={onStatusChange}
                        />

                        <Link
                          href={`/applications/${app._id}`}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View application details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
