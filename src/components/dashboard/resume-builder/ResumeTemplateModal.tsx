"use client";

import { Check } from "lucide-react";
import type { TemplateId, TemplateMetadata } from "./types";

interface ResumeTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: TemplateMetadata[];
  selectedTemplate: TemplateId;
  onSelectTemplate: (id: TemplateId) => void;
}

export function ResumeTemplateModal({
  isOpen,
  onClose,
  templates,
  selectedTemplate,
  onSelectTemplate,
}: ResumeTemplateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl animate-fade-in z-30">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-space-grotesk">
              Choose a Resume Template
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Every template is crafted for optimal recruiter scanning and ATS
              compatibility.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Close ✕
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => {
                  onSelectTemplate(tmpl.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-md ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                }`}
              >
                {tmpl.badge && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                    {tmpl.badge}
                  </span>
                )}

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {tmpl.name}
                  </h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                    {tmpl.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {isSelected ? "Active Template" : "Select"}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
