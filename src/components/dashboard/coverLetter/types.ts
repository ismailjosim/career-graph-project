import type { CoverLetter } from "@/lib/validation";

export interface CoverLetterFormData {
  title: string;
  content: string;
}

export interface CoverLetterHeaderProps {
  totalCount: number;
  filteredCount: number;
  onNewLetter: () => void;
}

export interface CoverLetterFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export interface CoverLetterCardProps {
  letter: CoverLetter;
  onEdit: (letter: CoverLetter) => void;
  onDelete: (id: string) => Promise<void>;
}

export interface CoverLetterListProps {
  letters: CoverLetter[];
  onEdit: (letter: CoverLetter) => void;
  onDelete: (id: string) => Promise<void>;
  onResetSearch?: () => void;
  onNewLetter: () => void;
}

export interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CoverLetter | null;
  initialAiData?: {
    jobTitle?: string;
    company?: string;
    jobDescription?: string;
    autoOpenAi?: boolean;
  };
  onSave: (data: CoverLetterFormData) => Promise<CoverLetter>;
}

export interface CoverLetterEmptyStateProps {
  hasSearch: boolean;
  onResetSearch?: () => void;
  onNewLetter: () => void;
}
