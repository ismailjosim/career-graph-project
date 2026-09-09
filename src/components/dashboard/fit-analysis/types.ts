export interface StoredResume {
  _id: string;
  name: string;
  fileName: string;
  fileUrl?: string;
  isDefault?: boolean;
  uploadedAt?: string;
}

export interface PreviousAnalysisResult {
  jobTitle?: string;
  company?: string;
  fitScore?: number;
}

export type JobInputMode = "paste" | "link";
export type ResumeInputMode = "saved" | "upload" | "text";

export interface JobPostInput {
  title: string;
  company: string;
  description: string;
}

export interface UploadedResumeFile {
  name: string;
  size: number;
  base64: string;
  mimeType: string;
}

export interface FitAnalysisHeaderProps {
  previousResult: PreviousAnalysisResult | null;
}

export interface JobPostingSectionProps {
  jobMode: JobInputMode;
  onJobModeChange: (mode: JobInputMode) => void;
  jobLink: string;
  onJobLinkChange: (url: string) => void;
  fetchingJobLink: boolean;
  onFetchJobUrl: () => Promise<void>;
  jobLinkError: string | null;
  jobInput: JobPostInput;
  onJobInputChange: (input: JobPostInput) => void;
}

export interface CandidateResumeSectionProps {
  resumeMode: ResumeInputMode;
  onResumeModeChange: (mode: ResumeInputMode) => void;
  resumes: StoredResume[];
  loadingResumes: boolean;
  selectedResumeId: string;
  onSelectResumeId: (id: string) => void;
  uploadedFile: UploadedResumeFile | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  saveToAccount: boolean;
  onSaveToAccountChange: (save: boolean) => void;
  customResumeName: string;
  onCustomResumeNameChange: (name: string) => void;
  resumeText: string;
  onResumeTextChange: (text: string) => void;
}

export interface SavedResumesListProps {
  resumes: StoredResume[];
  loading: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onSwitchToUpload: () => void;
}

export interface ResumeUploadAreaProps {
  uploadedFile: UploadedResumeFile | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  saveToAccount: boolean;
  onSaveToAccountChange: (save: boolean) => void;
  customResumeName: string;
  onCustomResumeNameChange: (name: string) => void;
}

export interface AnalysisProgressCardProps {
  currentStepIndex: number;
  steps: string[];
}

export interface AnalysisSubmitButtonProps {
  analyzing: boolean;
  analysisError: string | null;
}
