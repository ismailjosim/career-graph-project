export interface TemplateFormData {
  _id?: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  category: "tech" | "creative" | "executive" | "general";
  layoutArchetype:
    | "single_column"
    | "sidebar_left"
    | "executive_classic"
    | "minimal_tech";
  thumbnailUrl?: string;
  badge?: string;
  isPro: boolean;
  tokenCost: number;
  defaultTheme: {
    accentColor: string;
    fontFamily: "sans" | "serif" | "mono";
    layoutDensity: "compact" | "normal" | "spacious";
  };
  isActive: boolean;
  sortOrder: number;
}

export const PRESET_COLORS = [
  { name: "Royal Indigo", hex: "#4f46e5" },
  { name: "Slate Corporate", hex: "#0f172a" },
  { name: "Emerald Tech", hex: "#059669" },
  { name: "Electric Blue", hex: "#2563eb" },
  { name: "Crimson Bold", hex: "#dc2626" },
  { name: "Royal Purple", hex: "#7c3aed" },
  { name: "Teal Modern", hex: "#0d9488" },
  { name: "Amber Warm", hex: "#d97706" },
];

export const DEFAULT_FORM_DATA: TemplateFormData = {
  slug: "",
  name: "",
  subtitle: "",
  description: "",
  category: "general",
  layoutArchetype: "single_column",
  thumbnailUrl: "",
  badge: "",
  isPro: false,
  tokenCost: 0,
  defaultTheme: {
    accentColor: "#4f46e5",
    fontFamily: "sans",
    layoutDensity: "normal",
  },
  isActive: true,
  sortOrder: 0,
};
