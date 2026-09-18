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
  data: ResumeBuilderData;
  themeConfig: ResumeThemeConfig;
}

export function ResumeTemplateRenderer({
  templateId,
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

  return (
    <div className={`w-full bg-white text-slate-900 ${fontClass}`}>
      {templateId === "executive" && (
        <ExecutiveClassicTemplate data={data} themeConfig={themeConfig} />
      )}
      {templateId === "tech" && (
        <TechMinimalistTemplate data={data} themeConfig={themeConfig} />
      )}
      {templateId === "creative" && (
        <CreativeSidebarTemplate data={data} themeConfig={themeConfig} />
      )}
      {templateId === "modern" && (
        <ModernCleanTemplate data={data} themeConfig={themeConfig} />
      )}
    </div>
  );
}
