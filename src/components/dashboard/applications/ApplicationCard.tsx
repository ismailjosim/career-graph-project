import { Briefcase, Building2, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";
import { formatStatusLabel, getStatusBadgeClass } from "./applications.utils";
import type { ApplicationCardProps } from "./types";

export function ApplicationCard({ application }: ApplicationCardProps) {
  const formattedDate = application.appliedAt
    ? new Date(application.appliedAt).toLocaleDateString()
    : "Recently";

  return (
    <Link
      href={`/applications/${application._id}`}
      className="card-hover p-6 group cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {application.jobTitle}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 truncate">
              {application.company}
            </p>
          </div>
        </div>

        {/* Status & Fit Score */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`badge text-xs ${getStatusBadgeClass(application.status)}`}
          >
            {formatStatusLabel(application.status)}
          </span>
          {application.fitScore !== undefined &&
            application.fitScore !== null && (
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                {application.fitScore}% fit
              </span>
            )}
        </div>

        {/* Meta Details */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-4">
          {application.location && (
            <p className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{application.location}</span>
            </p>
          )}
          {application.salary && (
            <p className="flex items-center gap-1.5 truncate">
              <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{application.salary}</span>
            </p>
          )}
          {application.employmentType && (
            <p className="flex items-center gap-1.5 truncate capitalize">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{application.employmentType}</span>
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Briefcase className="w-3 h-3 text-slate-400" />
          <span>Applied {formattedDate}</span>
        </span>
        <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
          View details →
        </span>
      </div>
    </Link>
  );
}
