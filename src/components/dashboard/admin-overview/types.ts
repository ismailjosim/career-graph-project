export interface AdminUserMetrics {
  total: number;
  byRole: {
    job_seeker: number;
    recruiter: number;
    employer: number;
    admin: number;
    super_admin: number;
  };
  byStatus: {
    active: number;
    inactive: number;
    blocked: number;
  };
  verified: number;
  unverified: number;
  tokensCirculating: number;
}

export interface AdminApplicationMetrics {
  total: number;
  byStatus: Record<string, number>;
  offerConversionRate: number;
}

export interface AdminJobMetrics {
  total: number;
  active: number;
  closed: number;
  bySource: Record<string, number>;
  totalViews: number;
  totalExternalClicks: number;
  outboundCtr: number;
}

export interface AdminTopJob {
  id: string;
  title: string;
  company: string;
  location: string;
  sourcePlatform: string;
  workplaceType: string;
  externalClicksCount: number;
  viewsCount: number;
  applicantsCount: number;
  originalJobUrl?: string;
}

export interface AdminAiMetrics {
  coverLettersGenerated: number;
  fitAnalysisRuns: number;
  atsChecksRuns: number;
  totalAiRuns: number;
}

export interface AdminResumeMetrics {
  downloadsCount: number;
  printRequestsCount: number;
  resumesUploaded: number;
}

export interface AdminReviewMetrics {
  total: number;
  pending: number;
  averageRating: number;
}

export interface AdminOverviewMetrics {
  users: AdminUserMetrics;
  applications: AdminApplicationMetrics;
  jobs: AdminJobMetrics;
  topClickedJobs: AdminTopJob[];
  aiTools: AdminAiMetrics;
  resumeBuilder: AdminResumeMetrics;
  communityReviews: AdminReviewMetrics;
}

export interface AdminTimelinePoint {
  date: string;
  users: number;
  applications: number;
  clicks: number;
}

export interface AdminRecentActivity {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string | Date;
  }>;
  applications: Array<{
    id: string;
    jobTitle: string;
    company: string;
    status: string;
    appliedAt: string | Date;
  }>;
}

export interface AdminOverviewResponse {
  metrics: AdminOverviewMetrics;
  timeline: AdminTimelinePoint[];
  recentActivity: AdminRecentActivity;
}
