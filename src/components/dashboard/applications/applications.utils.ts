import type { JobApplication } from "@/lib/validation";
import type {
  ApplicationEmploymentType,
  ApplicationFilterStatus,
  SortOption,
  StatusOption,
} from "./types";

export const DEFAULT_STATUS_OPTIONS: StatusOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "applied", label: "Applied" },
  { value: "interview_scheduled", label: "Interview Scheduled" },
  { value: "interviewed", label: "Interviewed" },
  { value: "offer_received", label: "Offer Received" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

export const DEFAULT_EMPLOYMENT_TYPE_OPTIONS: {
  value: ApplicationEmploymentType;
  label: string;
}[] = [
  { value: "all", label: "All Types" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { label: "Newest Applied", sortBy: "appliedAt", sortOrder: "desc" },
  { label: "Oldest Applied", sortBy: "appliedAt", sortOrder: "asc" },
  { label: "Highest Fit Score", sortBy: "fitScore", sortOrder: "desc" },
  { label: "Company (A-Z)", sortBy: "company", sortOrder: "asc" },
  { label: "Job Title (A-Z)", sortBy: "jobTitle", sortOrder: "asc" },
];

/**
 * Filter applications client-side (for backwards compatibility if needed).
 */
export function filterApplications(
  applications: JobApplication[],
  searchTerm: string,
  filterStatus: ApplicationFilterStatus,
): JobApplication[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return applications.filter((app) => {
    const matchesSearch =
      !normalizedSearch ||
      app.jobTitle.toLowerCase().includes(normalizedSearch) ||
      app.company.toLowerCase().includes(normalizedSearch);

    const matchesStatus = filterStatus === "all" || app.status === filterStatus;

    return matchesSearch && matchesStatus;
  });
}

/**
 * Returns the badge CSS class corresponding to the application status.
 */
export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "applied":
      return "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40";
    case "interview_scheduled":
    case "interviewed":
      return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40";
    case "offer_received":
      return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40";
    case "rejected":
      return "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40";
    case "withdrawn":
      return "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    default:
      return "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  }
}

/**
 * Returns dot indicator CSS class for table rows.
 */
export function getStatusDotClass(status: string): string {
  switch (status) {
    case "applied":
      return "bg-blue-500 ring-blue-500/20";
    case "interview_scheduled":
    case "interviewed":
      return "bg-amber-500 ring-amber-500/20";
    case "offer_received":
      return "bg-emerald-500 ring-emerald-500/20";
    case "rejected":
      return "bg-rose-500 ring-rose-500/20";
    case "withdrawn":
      return "bg-slate-400 ring-slate-400/20";
    default:
      return "bg-slate-400 ring-slate-400/20";
  }
}

/**
 * Formats a status string for display.
 */
export function formatStatusLabel(status?: string): string {
  if (!status) return "UNKNOWN";
  switch (status) {
    case "interview_scheduled":
      return "Interview Scheduled";
    case "offer_received":
      return "Offer Received";
    default:
      return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

/**
 * Formats employment type with clean capitalization.
 */
export function formatEmploymentType(type?: string): string {
  if (!type) return "Full-time";
  switch (type.toLowerCase()) {
    case "full-time":
      return "Full-time";
    case "part-time":
      return "Part-time";
    case "contract":
      return "Contract";
    case "internship":
      return "Internship";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

/**
 * Returns color classes for fit score display.
 */
export function getFitScoreColor(score?: number): {
  badge: string;
  bar: string;
  label: string;
} {
  if (score === undefined || score === null) {
    return {
      badge:
        "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
      bar: "bg-slate-400",
      label: "N/A",
    };
  }

  if (score >= 80) {
    return {
      badge:
        "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40",
      bar: "bg-emerald-500",
      label: "Strong Match",
    };
  }
  if (score >= 60) {
    return {
      badge:
        "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40",
      bar: "bg-blue-500",
      label: "Moderate Match",
    };
  }
  return {
    badge:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40",
    bar: "bg-amber-500",
    label: "Low Match",
  };
}
