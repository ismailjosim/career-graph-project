import type { ApplicationsPaginationMeta } from "@/app/actions/applications";
import type { JobApplication } from "@/lib/validation";

export type ApplicationFilterStatus =
  | "all"
  | "applied"
  | "interview_scheduled"
  | "interviewed"
  | "offer_received"
  | "rejected"
  | "withdrawn";

export type ApplicationEmploymentType =
  | "all"
  | "full-time"
  | "part-time"
  | "contract"
  | "internship";

export type ApplicationSortBy =
  | "appliedAt"
  | "fitScore"
  | "company"
  | "jobTitle";

export type ApplicationSortOrder = "asc" | "desc";

export interface StatusOption {
  value: ApplicationFilterStatus;
  label: string;
}

export interface EmploymentTypeOption {
  value: ApplicationEmploymentType;
  label: string;
}

export interface SortOption {
  label: string;
  sortBy: ApplicationSortBy;
  sortOrder: ApplicationSortOrder;
}

export interface ApplicationsHeaderProps {
  totalCount: number;
  filteredCount: number;
}

export interface ApplicationsTableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: ApplicationFilterStatus;
  onFilterStatusChange: (status: ApplicationFilterStatus) => void;
  employmentType: ApplicationEmploymentType;
  onEmploymentTypeChange: (type: ApplicationEmploymentType) => void;
  sortBy: ApplicationSortBy;
  sortOrder: ApplicationSortOrder;
  onSortChange: (
    sortBy: ApplicationSortBy,
    sortOrder: ApplicationSortOrder,
  ) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalFiltered: number;
}

export type ApplicationsFilterBarProps = ApplicationsTableFiltersProps;

export interface LegacyApplicationsFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: ApplicationFilterStatus;
  onFilterStatusChange: (status: ApplicationFilterStatus) => void;
  statusOptions?: StatusOption[];
}

export interface ApplicationsTableProps {
  applications: JobApplication[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
}

export interface ApplicationsPaginationProps {
  pagination: ApplicationsPaginationMeta;
  onPageChange: (newPage: number) => void;
  loading?: boolean;
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
