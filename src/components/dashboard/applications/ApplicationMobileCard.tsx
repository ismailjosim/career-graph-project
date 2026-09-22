"use client";

import {
  Building2,
  Calendar,
  DollarSign,
  ExternalLink,
  Eye,
  MapPin,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { JobApplication } from "@/lib/validation";
import {
  formatEmploymentType,
  formatStatusLabel,
  getFitScoreColor,
  getStatusBadgeClass,
  getStatusDotClass,
} from "./applications.utils";

interface ApplicationMobileCardProps {
  app: JobApplication;
  isDeleting: boolean;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}

export function ApplicationMobileCard({
  app,
  isDeleting,
  onDelete,
}: ApplicationMobileCardProps) {
  const fitColor = getFitScoreColor(app.fitScore);

  return (
    <div className="p-4 space-y-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      {/* Header: Company Avatar, Title, Link & Actions */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-xs shrink-0">
            {app.company.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/applications/${app._id}`}
              className="font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block transition-colors"
            >
              {app.jobTitle}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="font-medium">{app.company}</span>
              {app.jobLink && (
                <a
                  href={app.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-1"
                  title="Open Job Post URL"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            href={`/applications/${app._id}`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {onDelete && (
            <button
              type="button"
              onClick={(e) => onDelete(app._id as string, e)}
              disabled={isDeleting}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors disabled:opacity-50 cursor-pointer"
              title="Delete application"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Badges: Status & Fit Score */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
            app.status,
          )}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ring-2 ${getStatusDotClass(
              app.status,
            )}`}
          />
          {formatStatusLabel(app.status)}
        </span>

        {app.fitScore !== undefined && app.fitScore !== null ? (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${fitColor.badge}`}
          >
            <Zap className="w-3 h-3 shrink-0" />
            {app.fitScore}% Fit
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </div>

      {/* Metadata Footprint: Location, Date & Salary */}
      <div className="flex flex-wrap items-center justify-between gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate max-w-40">
            {app.location || "Remote"} •{" "}
            {formatEmploymentType(app.employmentType)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {app.salary && (
            <div className="flex items-center gap-0.5 text-slate-700 dark:text-slate-300 font-medium">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              <span>{app.salary}</span>
            </div>
          )}

          {app.appliedAt && (
            <div className="flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>
                {new Date(app.appliedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
