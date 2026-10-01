import type { ReviewRole, ReviewStatus } from "@/lib/validation";

export type { ReviewRole, ReviewStatus };

export interface AdminReview {
  _id: string;
  userId: string;
  authorName: string;
  authorImage?: string;
  role: ReviewRole;
  rating: number;
  content: string;
  headline?: string;
  companyOrTarget?: string;
  verifiedOutcome?: string;
  tags?: string[];
  status: ReviewStatus;
  helpfulVotes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewItem {
  _id: string;
  userId: string;
  authorName: string;
  authorImage?: string;
  role: ReviewRole;
  rating: number;
  content: string;
  headline?: string;
  companyOrTarget?: string;
  verifiedOutcome?: string;
  tags?: string[];
  status?: string;
  createdAt: string;
}

export interface ReviewMetrics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  featured: number;
  averageRating: number;
  roleBreakdown: {
    job_seeker: number;
    recruiter: number;
    employer: number;
  };
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  roleCounts: {
    all: number;
    job_seeker: number;
    recruiter: number;
    employer: number;
  };
  ratingCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface SubmitReviewInput {
  role: ReviewRole;
  rating: number;
  content: string;
  headline?: string;
  companyOrTarget?: string;
  verifiedOutcome?: string;
  tags?: string[];
}
