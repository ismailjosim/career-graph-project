import type { LucideIcon } from "lucide-react";
import type { JobApplication } from "@/lib/validation";

export interface AddApplicationForm {
  jobTitle: string;
  company: string;
  description: string;
  jobLink: string;
  fitScore: string;
  notes: string;
  status: string;
  salary: string;
  location: string;
  employmentType: string;
}

export interface DashboardTrends {
  total: number;
  responses: number;
  rejections: number;
  interviews: number;
}

export interface DashboardMetrics {
  total: number;
  positiveResponses: number;
  rejections: number;
  interviews: number;
  offers: number;
  appliedOnly: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  trends: DashboardTrends;
  thisMonthTotal: number;
}

export interface MetricChartItem {
  name: string;
  applications: number;
  fill: string;
}

export interface TimelineChartItem {
  name: string;
  applied: number;
  responses: number;
  offers: number;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend?: number;
}

export interface DashboardOverviewHeaderProps {
  totalApplications: number;
  onAddApplication: () => void;
}

export interface DashboardStatsGridProps {
  metrics: DashboardMetrics;
}

export interface PerformanceChartProps {
  metricsChartData: MetricChartItem[];
  timelineChartData: TimelineChartItem[];
  chartView: "metrics" | "timeline";
  onChartViewChange: (view: "metrics" | "timeline") => void;
}

export interface QuickInsightsCardProps {
  metrics: DashboardMetrics;
}

export interface RecentApplicationsTableProps {
  applications: JobApplication[];
  onAddApplication: () => void;
}

export interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  createApplication: (
    data: Omit<JobApplication, "_id" | "userId" | "appliedAt">,
  ) => Promise<JobApplication>;
  onSuccess?: () => Promise<void> | void;
}
