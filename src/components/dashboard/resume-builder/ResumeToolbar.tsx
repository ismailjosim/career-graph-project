"use client";

import {
  ArrowLeft,
  Download,
  FileCheck,
  Layout,
  Palette,
  Printer,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ResumeTemplateModal } from "./ResumeTemplateModal";
import { ResumeThemeModal } from "./ResumeThemeModal";
import {
  AVAILABLE_TEMPLATES,
  type ResumeThemeConfig,
  type TemplateId,
} from "./types";

interface ResumeToolbarProps {
  resumeName: string;
  onResumeNameChange: (name: string) => void;
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  themeConfig: ResumeThemeConfig;
  onThemeConfigChange: (config: ResumeThemeConfig) => void;
  onLoadDemoData: () => void;
  onResetData: () => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onAtsCheck: () => void;
}

export function ResumeToolbar({
  resumeName,
  onResumeNameChange,
  selectedTemplate,
  onSelectTemplate,
  themeConfig,
  onThemeConfigChange,
  onLoadDemoData,
  onResetData,
  onSave,
  isSaving,
  hasUnsavedChanges,
  onPrint,
  onDownloadPdf,
  onAtsCheck,
}: ResumeToolbarProps) {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [templateList, setTemplateList] = useState(AVAILABLE_TEMPLATES);

  useEffect(() => {
    fetch("/api/resumes/templates")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.templates?.length) {
          setTemplateList(data.templates);
        }
      })
      .catch(() => {});
  }, []);

  const currentTemplate =
    templateList.find((t) => t.id === selectedTemplate) ||
    AVAILABLE_TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-3 sm:px-6 py-2.5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Back Link & Resume Name */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/resumes"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Back to Resumes"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={resumeName}
              onChange={(e) => onResumeNameChange(e.target.value)}
              placeholder="Untitled Resume"
              className="font-bold text-sm sm:text-base text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:outline-hidden px-1 py-0.5 max-w-40 sm:max-w-xs truncate"
            />
            {hasUnsavedChanges ? (
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full shrink-0">
                Unsaved
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full shrink-0">
                Saved
              </span>
            )}
          </div>
        </div>

        {/* Center: Template & Theme Controls */}
        <div className="flex items-center gap-2">
          {/* Template Picker Dropdown Trigger */}
          <button
            type="button"
            onClick={() => {
              setShowTemplateModal(!showTemplateModal);
              setShowThemeModal(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Layout className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Template:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {currentTemplate?.name || "Modern"}
            </span>
          </button>

          {/* Theme & Styling Trigger */}
          <button
            type="button"
            onClick={() => {
              setShowThemeModal(!showThemeModal);
              setShowTemplateModal(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Theme</span>
            <span
              className="w-3 h-3 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: themeConfig.accentColor || "#4f46e5" }}
            />
          </button>

          {/* Load Sample Demo Data */}
          <button
            type="button"
            onClick={onLoadDemoData}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Pre-fill with rich dummy experience, skills, and projects"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Sample Data</span>
          </button>

          {/* Reset form */}
          <button
            type="button"
            onClick={onResetData}
            className="inline-flex items-center gap-1 p-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            title="Reset to blank canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions (ATS Check, Print, Export PDF, Save) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAtsCheck}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold transition-colors cursor-pointer"
            title="Analyze ATS keywords and compliance score"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ATS Check</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            title="Print document"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            title="Download PDF vector export"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="btn-primary text-xs py-1.5 px-3 sm:px-4 flex items-center gap-1.5 font-bold cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Template Selector Modal Dropdown */}
      <ResumeTemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templates={templateList}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={onSelectTemplate}
      />

      {/* Theme & Style Customizer Modal Dropdown */}
      <ResumeThemeModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        themeConfig={themeConfig}
        onThemeConfigChange={onThemeConfigChange}
      />
    </div>
  );
}
