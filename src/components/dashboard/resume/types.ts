import type { Resume } from "@/lib/validation";

export interface ResumeFormData {
  name: string;
  fileName: string;
  fileUrl: string;
  cloudinaryPublicId?: string;
  fileSize?: number;
}

export interface ResumeHeaderProps {
  totalCount: number;
  filteredCount: number;
  onAddResume: () => void;
}

export interface ResumeFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export interface ResumeCardProps {
  resume: Resume;
  onSetDefault: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export interface ResumeListProps {
  resumes: Resume[];
  onSetDefault: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onResetSearch?: () => void;
  onAddResume: () => void;
}

export interface AddResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: ResumeFormData) => Promise<Resume>;
  resumes?: Resume[];
  onDeleteResume?: (id: string) => Promise<void>;
}

export interface ResumeEmptyStateProps {
  hasSearch: boolean;
  onResetSearch?: () => void;
  onAddResume: () => void;
}
