import type {
  ResumeBuilderData,
  ResumeThemeConfig,
  TemplateId,
} from "../types";
import { CreativeSidebarTemplate } from "./CreativeSidebarTemplate";
import { ExecutiveClassicTemplate } from "./ExecutiveClassicTemplate";
import { ModernCleanTemplate } from "./ModernCleanTemplate";
import { TechMinimalistTemplate } from "./TechMinimalistTemplate";

interface ResumeTemplateRendererProps {
  templateId: TemplateId;
  layoutArchetype?: string;
  data: ResumeBuilderData;
  themeConfig: ResumeThemeConfig;
}

export function ResumeTemplateRenderer({
  templateId,
  layoutArchetype,
  data,
  themeConfig,
}: ResumeTemplateRendererProps) {
  // Select typography based on themeConfig.fontFamily
  const fontClass =
    themeConfig.fontFamily === "serif"
      ? "font-serif"
      : themeConfig.fontFamily === "mono"
        ? "font-mono"
        : "font-sans";

  // Determine which layout component to render
  const isExecutive =
    templateId === "executive" ||
    layoutArchetype === "executive_classic" ||
    templateId.includes("executive");

  const isTech =
    templateId === "tech" ||
    layoutArchetype === "minimal_tech" ||
    templateId.includes("tech") ||
    templateId.includes("minimal");

  const isCreative =
    templateId === "creative" ||
    layoutArchetype === "sidebar_left" ||
    templateId.includes("creative") ||
    templateId.includes("sidebar");

  return (
    <div className={`w-full bg-white text-slate-900 ${fontClass}`}>
      {isExecutive ? (
        <ExecutiveClassicTemplate data={data} themeConfig={themeConfig} />
      ) : isTech ? (
        <TechMinimalistTemplate data={data} themeConfig={themeConfig} />
      ) : isCreative ? (
        <CreativeSidebarTemplate data={data} themeConfig={themeConfig} />
      ) : (
        <ModernCleanTemplate data={data} themeConfig={themeConfig} />
      )}
    </div>
  );
}
