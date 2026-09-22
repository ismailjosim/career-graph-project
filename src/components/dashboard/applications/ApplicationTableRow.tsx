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

interface ApplicationTableRowProps {
  app: JobApplication;
  isDeleting: boolean;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}

export function ApplicationTableRow({
  app,
  isDeleting,
  onDelete,
}: ApplicationTableRowProps) {
  const fitColor = getFitScoreColor(app.fitScore);

  return (
    <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
      {/* Company & Role */}
      <td className="py-3.5 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            {app.company.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="py-3.5 px-4">
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
      </td>

      {/* Fit Score */}
      <td className="py-3.5 px-4">
        {app.fitScore !== undefined && app.fitScore !== null ? (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${fitColor.badge}`}
            >
              <Zap className="w-3 h-3 shrink-0" />
              {app.fitScore}%
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
        )}
      </td>

      {/* Location & Type */}
      <td className="py-3.5 px-4 hidden md:table-cell">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 font-medium truncate max-w-44">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{app.location || "Remote / Unspecified"}</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-normal">
            {formatEmploymentType(app.employmentType)}
          </span>
        </div>
      </td>

      {/* Applied Date */}
      <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {app.appliedAt
              ? new Date(app.appliedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </span>
        </div>
      </td>

      {/* Salary */}
      <td className="py-3.5 px-4 hidden xl:table-cell text-xs text-slate-700 dark:text-slate-300 font-medium">
        {app.salary ? (
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>{app.salary}</span>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500">—</span>
        )}
      </td>

      {/* Action buttons */}
      <td className="py-3.5 px-4 sm:px-6 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/applications/${app._id}`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 transition-colors cursor-pointer"
            title="View application details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {onDelete && (
            <button
              type="button"
              onClick={(e) => onDelete(app._id as string, e)}
              disabled={isDeleting}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
              title="Delete application"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
