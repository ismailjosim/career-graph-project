import {
  BookOpen,
  Bot,
  Briefcase,
  FileCheck,
  FileText,
  Globe,
  Heart,
  LayoutDashboard,
  Sparkles,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";

export interface MenuItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: Briefcase,
        label: "Applications",
        href: "/applications",
      },
    ],
  },
  {
    id: "discovery",
    label: "Job Discovery",
    items: [
      {
        icon: Sparkles,
        label: "Daily AI Matches",
        href: "/daily-matches",
        badge: "New",
      },
      {
        icon: Briefcase,
        label: "Job Portal",
        href: "/jobs",
      },
      {
        icon: Heart,
        label: "Wishlist",
        href: "/wishlist",
      },
      {
        icon: Globe,
        label: "Job Market",
        href: "/job-market",
      },
    ],
  },
  {
    id: "ai-tools",
    label: "AI Career Tools",
    items: [
      {
        icon: BookOpen,
        label: "Resumes & Builder",
        href: "/resumes",
      },
      {
        icon: FileText,
        label: "Cover Letters",
        href: "/cover-letters",
      },
      {
        icon: Zap,
        label: "Fit Analysis",
        href: "/fit-analysis",
      },
      {
        icon: FileCheck,
        label: "ATS Checker",
        href: "/ats-checker",
      },
      {
        icon: Bot,
        label: "Mock Interview",
        href: "/mock-interview",
        badge: "AI",
      },
    ],
  },
];
