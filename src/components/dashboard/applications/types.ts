import type { JobApplication } from "@/lib/validation";

export type ApplicationFilterStatus =
  | "all"
  | "applied"
  | "interview_scheduled"
  | "interviewed"
  | "offer_received"
  | "rejected"
  | "withdrawn";

export interface StatusOption {
  value: ApplicationFilterStatus;
  label: string;
}

export interface ApplicationsHeaderProps {
  totalCount: number;
  filteredCount: number;
}

export interface ApplicationsFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: ApplicationFilterStatus;
  onFilterStatusChange: (status: ApplicationFilterStatus) => void;
  statusOptions?: StatusOption[];
}

export interface ApplicationCardProps {
  application: JobApplication;
}

export interface ApplicationsGridProps {
  applications: JobApplication[];
  onResetFilters?: () => void;
}

export interface ApplicationsEmptyStateProps {
  hasFilters: boolean;
  onResetFilters?: () => void;
}
