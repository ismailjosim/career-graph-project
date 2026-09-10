import type {
  ExperienceLevel,
  JobPosting,
  JobSourcePlatform,
  WorkplaceType,
} from "@/lib/validation";

export type JobSortOption = "newest" | "popular" | "tokens_asc" | "tokens_desc";

export interface JobFilterState {
  search: string;
  workplaceType: WorkplaceType | "all";
  employmentType: string;
  experienceLevel: ExperienceLevel | "all";
  sourcePlatform: JobSourcePlatform | "all";
  sortBy: JobSortOption;
}

export interface JobCardProps {
  job: JobPosting;
  onApply?: (job: JobPosting) => void;
  onSaveToggle?: (job: JobPosting) => void;
  isSaved?: boolean;
  hasApplied?: boolean;
}

export interface JobFiltersProps {
  filters: JobFilterState;
  onFilterChange: <K extends keyof JobFilterState>(
    key: K,
    value: JobFilterState[K],
  ) => void;
  onReset: () => void;
  totalFiltered: number;
}

export interface JobApplyModalProps {
  job: JobPosting | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (applicationId: string, newBalance: number) => void;
}
