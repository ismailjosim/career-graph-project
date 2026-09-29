import type { SavedResumeOption } from "./resume";

export type AtsSeverity = "high" | "medium" | "low";
export type AtsRating = "excellent" | "good" | "needs_improvement" | "poor";
export type AtsInputMode = "saved" | "upload" | "text";
export type AtsRegionStandard =
  | "us_canada"
  | "uk_commonwealth"
  | "european_europass"
  | "apac_global";

export interface AtsIssue {
  id: string;
  section: string;
  severity: AtsSeverity;
  title: string;
  issue: string;
  recommendation: string;
}

export interface AtsCategoryScores {
  formatting: number;
  keywords: number;
  contentImpact: number;
  structure: number;
}

export interface AtsCategoryFeedback {
  formatting: string;
  keywords: string;
  contentImpact: string;
  structure: string;
}

export interface AtsAiReadiness {
  score: number;
  level:
    | "agentic_native"
    | "ai_augmented"
    | "emerging"
    | "traditional_outdated";
  headline: string;
  detectedAiSkills: string[];
  missingModernSkills: string[];
  suggestions: string[];
}

export interface AtsAnalysisResult {
  overallScore: number;
  rating: AtsRating;
  badge: string;
  executiveSummary: string;
  quickWins: string[];
  categoryScores: AtsCategoryScores;
  categoryFeedback: AtsCategoryFeedback;
  criticalIssues: AtsIssue[];
  detectedKeywords: string[];
  missingKeywords: string[];
  actionVerbCount: number;
  quantifiableMetricsScore: number;
  aiReadiness?: AtsAiReadiness;
  regionStandard?: AtsRegionStandard;
}

export interface AtsTargetJob {
  title?: string;
  description?: string;
  regionStandard?: AtsRegionStandard;
}

export type { SavedResumeOption };
