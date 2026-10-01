import type {
  FitAnalysisResponse,
  ResumeAdjustment,
} from "@/interfaces/fit-analysis";

export interface FitResultHeroProps {
  result: FitAnalysisResponse;
}

export interface QuickApplyBannerProps {
  onApply: () => Promise<void>;
  applying: boolean;
  appliedSuccess: boolean;
}

export interface ExecutiveSummaryCardProps {
  summary: string;
}

export interface SkillsComparisonCardProps {
  strengths: string[];
  missingSkills: string[];
}

export interface ResumeAdjustmentsListProps {
  adjustments: ResumeAdjustment[];
  onCopyAdjustment: (text: string, key: string) => void;
  copiedKey: string | null;
  onCopyAll: () => void;
  copiedAll: boolean;
}

export interface InterviewTipsCardProps {
  tips: string[];
}
