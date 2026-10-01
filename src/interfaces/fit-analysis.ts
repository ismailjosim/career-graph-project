// Types related to the AI fit analysis feature
export interface ResumeAdjustment {
  section: string;
  issue: string;
  suggestion: string;
  impact: "high" | "medium" | "low";
}

export interface FitAnalysisResponse {
  fitScore: number;
  verdict: {
    decision:
      | "strongly_recommended"
      | "recommended"
      | "proceed_with_caution"
      | "not_recommended";
    badge: string;
    rationale: string;
  };
  scoreBreakdown: {
    skillsMatch: number;
    experienceMatch: number;
    requirementsMatch: number;
  };
  executiveSummary: string;
  strengths: string[];
  missingSkills: string[];
  resumeAdjustments: ResumeAdjustment[];
  interviewTips: string[];
}

export interface StoredAnalysisPayload {
  result: FitAnalysisResponse;
  meta?: {
    jobTitle?: string;
    company?: string;
    savedResumeId?: string;
  };
  jobInput?: {
    title?: string;
    company?: string;
    description?: string;
    link?: string;
  };
  analyzedAt?: string;
}
