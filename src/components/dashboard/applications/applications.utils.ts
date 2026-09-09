import type { JobApplication } from "@/lib/validation";
import type { ApplicationFilterStatus, StatusOption } from "./types";

export const DEFAULT_STATUS_OPTIONS: StatusOption[] = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "interview_scheduled", label: "Interview" },
  { value: "offer_received", label: "Offers" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

/**
 * Filter applications by search term (job title or company) and status.
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
      return "badge-primary";
    case "interview_scheduled":
    case "interviewed":
      return "badge-warning";
    case "offer_received":
      return "badge-success";
    case "rejected":
      return "badge-danger";
    default:
      return "badge-neutral";
  }
}

/**
 * Formats a status string for display.
 */
export function formatStatusLabel(status?: string): string {
  if (!status) return "UNKNOWN";
  return status.replace(/_/g, " ").toUpperCase();
}
