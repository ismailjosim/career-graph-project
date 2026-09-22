import type { ComponentType } from "react";
import {
  BookOpen,
  Bot,
  Briefcase,
  Coins,
  FileCheck,
  FileText,
  Globe,
  Heart,
  LayoutDashboard,
  Settings,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

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
  {
    id: "account",
    label: "Account & Billing",
    items: [
      {
        icon: Coins,
        label: "Tokens & Packages",
        href: "/pricing",
      },
      {
        icon: User,
        label: "Profile",
        href: "/profile",
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/settings",
      },
    ],
  },
];
