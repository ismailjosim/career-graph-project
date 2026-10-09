"use client";

import { Eye } from "lucide-react";
import { DEMO_RESUME_DATA } from "./demoResumeData";
import { ResumeDocumentPreview } from "./ResumeDocumentPreview";
import type { TemplateId, TemplateMetadata } from "./types";

interface TemplateSelectionPreviewModalProps {
  previewTemplate: TemplateId | null;
  templates: TemplateMetadata[];
  customVariants: Record<
    string,
    { color: string; font: "sans" | "serif" | "mono" }
  >;
  onClose: () => void;
  onApplyAndContinue: (templateId: TemplateId) => void;
}

export function TemplateSelectionPreviewModal({
  previewTemplate,
  templates,
  customVariants,
  onClose,
  onApplyAndContinue,
}: TemplateSelectionPreviewModalProps) {
  if (!previewTemplate) return null;

  const currentTemplate = templates.find((t) => t.id === previewTemplate);
  const accentColor =
    customVariants[previewTemplate]?.color ||
    currentTemplate?.defaultTheme?.accentColor ||
    "#4f46e5";
  const fontFamily =
    customVariants[previewTemplate]?.font ||
    currentTemplate?.defaultTheme?.fontFamily ||
    "sans";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-space-grotesk">
              <Eye className="w-5 h-5 text-indigo-600" />
              <span>Full Preview: {currentTemplate?.name || "Template"}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive ATS document rendered with sample professional
              candidate layout.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onApplyAndContinue(previewTemplate)}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Use This Template
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Live Document Preview Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950 flex justify-center">
          <ResumeDocumentPreview
            data={DEMO_RESUME_DATA}
            templateId={previewTemplate}
            layoutArchetype={currentTemplate?.layoutArchetype}
            themeConfig={{
              accentColor,
              fontFamily,
              layoutDensity: "normal",
            }}
          />
        </div>
      </div>
    </div>
  );
}
