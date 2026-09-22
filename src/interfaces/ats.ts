import type { SavedResumeOption } from "./resume";

export type AtsSeverity = "high" | "medium" | "low";
export type AtsRating = "excellent" | "good" | "needs_improvement" | "poor";
export type AtsInputMode = "saved" | "upload" | "text";

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
}

export interface AtsTargetJob {
  title?: string;
  description?: string;
}

export type { SavedResumeOption };
