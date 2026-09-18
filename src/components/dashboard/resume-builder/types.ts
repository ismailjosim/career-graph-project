import type {
  ResumeBuilderData,
  ResumeCertificationItem,
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumePersonalInfo,
  ResumeProjectItem,
  ResumeSkillGroup,
  ResumeThemeConfig,
} from "@/lib/validation";

export type {
  ResumeBuilderData,
  ResumePersonalInfo,
  ResumeExperienceItem,
  ResumeEducationItem,
  ResumeSkillGroup,
  ResumeProjectItem,
  ResumeCertificationItem,
  ResumeThemeConfig,
};

export type TemplateId = "modern" | "executive" | "tech" | "creative";

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  subtitle: string;
  badge?: string;
  isPro?: boolean;
  description: string;
}

export const AVAILABLE_TEMPLATES: TemplateMetadata[] = [
  {
    id: "modern",
    name: "Modern Clean",
    subtitle: "Recommended for Tech & Corporate",
    badge: "Popular",
    isPro: false,
    description:
      "Sleek single-column layout with subtle accent headers, optimal ATS machine readability, and clear chronological flow.",
  },
  {
    id: "executive",
    name: "Executive Classic",
    subtitle: "Management, Finance & Senior Roles",
    isPro: false,
    description:
      "Refined traditional serif typography, dense high-impact bullet sections, and formal corporate structure favored by senior recruiters.",
  },
  {
    id: "tech",
    name: "Tech Minimalist",
    subtitle: "Software Engineers & Data Science",
    badge: "PRO",
    isPro: true,
    description:
      "Developer-focused layout featuring categorized skill chips, repository & live demo links, and modern monospace accent tags.",
  },
  {
    id: "creative",
    name: "Creative Sidebar",
    subtitle: "Designers, Product & Marketing",
    badge: "PRO",
    isPro: true,
    description:
      "Contemporary 2-column layout with an eye-catching contact and skills sidebar, paired with an expansive career timeline.",
  },
];

export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  bgClass: string;
  borderClass: string;
}

export const COLOR_SWATCHES: ColorSwatch[] = [
  {
    id: "indigo",
    name: "Royal Indigo",
    hex: "#4f46e5",
    bgClass: "bg-indigo-600",
    borderClass: "border-indigo-600",
  },
  {
    id: "slate",
    name: "Executive Slate",
    hex: "#0f172a",
    bgClass: "bg-slate-900",
    borderClass: "border-slate-900",
  },
  {
    id: "emerald",
    name: "Modern Emerald",
    hex: "#059669",
    bgClass: "bg-emerald-600",
    borderClass: "border-emerald-600",
  },
  {
    id: "blue",
    name: "Corporate Blue",
    hex: "#2563eb",
    bgClass: "bg-blue-600",
    borderClass: "border-blue-600",
  },
  {
    id: "crimson",
    name: "Bold Crimson",
    hex: "#dc2626",
    bgClass: "bg-red-600",
    borderClass: "border-red-600",
  },
  {
    id: "amber",
    name: "Warm Amber",
    hex: "#d97706",
    bgClass: "bg-amber-600",
    borderClass: "border-amber-600",
  },
];

export interface FontOption {
  id: "sans" | "serif" | "mono";
  name: string;
  fontClass: string;
  sample: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "sans",
    name: "Inter (Modern Sans)",
    fontClass: "font-sans",
    sample: "Clean & readable",
  },
  {
    id: "serif",
    name: "Merriweather (Classic Serif)",
    fontClass: "font-serif",
    sample: "Formal & elegant",
  },
  {
    id: "mono",
    name: "Space Grotesk / Mono",
    fontClass: "font-mono",
    sample: "Technical & precise",
  },
];
