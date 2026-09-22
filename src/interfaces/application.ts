import type { JobApplication, MonthlyStats } from "@/lib/validation";

export type { JobApplication, MonthlyStats };

export type ApplicationStatus =
  | "applied"
  | "interview_scheduled"
  | "interviewed"
  | "offer_received"
  | "rejected"
  | "withdrawn";

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship";
