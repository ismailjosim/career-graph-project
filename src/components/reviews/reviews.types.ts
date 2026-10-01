import { Briefcase, Building2, UserCheck } from "lucide-react";
import type { ReviewItem, ReviewRole, ReviewStats } from "@/interfaces";

export type { ReviewItem, ReviewRole, ReviewStats };

export const ROLE_BADGES: Record<
  ReviewRole,
  { label: string; color: string; icon: typeof UserCheck }
> = {
  job_seeker: {
    label: "Candidate",
    color:
      "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
    icon: UserCheck,
  },
  recruiter: {
    label: "Recruiter",
    color:
      "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60",
    icon: Briefcase,
  },
  employer: {
    label: "Employer",
    color:
      "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
    icon: Building2,
  },
};

export const AVATAR_GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-purple-600 to-pink-600",
  "from-teal-600 to-emerald-600",
  "from-amber-600 to-orange-600",
  "from-rose-600 to-red-600",
  "from-cyan-600 to-blue-600",
];
