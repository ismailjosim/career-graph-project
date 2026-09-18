"use client";

import {
  ArrowLeft,
  Check,
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
import { useState } from "react";
import {
  AVAILABLE_TEMPLATES,
  COLOR_SWATCHES,
  FONT_OPTIONS,
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

  const currentTemplate = AVAILABLE_TEMPLATES.find(
    (t) => t.id === selectedTemplate,
  );

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-3 sm:px-6 py-2.5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Back Link & Resume Name */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/resumes"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
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
              className="font-bold text-sm sm:text-base text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 py-0.5 max-w-40 sm:max-w-xs truncate"
            />
            {hasUnsavedChanges ? (
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full shrink-0">
                Unsaved
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Center: Template & Style Selectors */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Template Switcher Button */}
          <button
            type="button"
            onClick={() => setShowTemplateModal(!showTemplateModal)}
            className="btn-secondary text-xs py-1.5 px-2.5 sm:px-3 flex items-center gap-1.5 cursor-pointer relative"
          >
            <Layout className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Template:</span>
            <span className="font-bold">{currentTemplate?.name}</span>
            {currentTemplate?.isPro && (
              <span className="text-[9px] font-bold bg-amber-500 text-white px-1 rounded-sm ml-0.5">
                PRO
              </span>
            )}
          </button>

          {/* Style Customizer (Color & Font) */}
          <button
            type="button"
            onClick={() => setShowThemeModal(!showThemeModal)}
            className="btn-secondary text-xs py-1.5 px-2.5 sm:px-3 flex items-center gap-1.5 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden sm:inline">Style & Theme</span>
          </button>

          {/* Load Sample Data */}
          <button
            type="button"
            onClick={onLoadDemoData}
            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Load Pre-filled Sample Data"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Demo Data</span>
          </button>

          {/* Reset Data */}
          <button
            type="button"
            onClick={onResetData}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs cursor-pointer transition-colors"
            title="Clear all fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Export & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* ATS Score Cross-Check */}
          <button
            type="button"
            onClick={onAtsCheck}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors border border-slate-200 dark:border-slate-800"
            title="Audit Resume with 4-Pillar ATS Engine"
          >
            <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden lg:inline">ATS Check</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={onPrint}
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-800 transition-colors"
            title="Print Resume"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={onDownloadPdf}
            className="btn-secondary text-xs py-1.5 px-2.5 sm:px-3 flex items-center gap-1.5 font-bold cursor-pointer text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            title="Download PDF format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Save Button */}
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
      {showTemplateModal && (
        <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl animate-fade-in z-30">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Choose a Resume Template
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Every template is crafted for optimal recruiter scanning and
                  ATS compatibility.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AVAILABLE_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      onSelectTemplate(tmpl.id);
                      setShowTemplateModal(false);
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
      )}

      {/* Theme & Style Customizer Modal Dropdown */}
      {showThemeModal && (
        <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl animate-fade-in z-30">
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Document Styling & Typography
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tailor accent colors and font pairings to your personal
                  branding.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Close ✕
              </button>
            </div>

            {/* Accent Colors */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                Primary Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {COLOR_SWATCHES.map((swatch) => {
                  const isSelected = themeConfig.accentColor === swatch.hex;
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() =>
                        onThemeConfigChange({
                          ...themeConfig,
                          accentColor: swatch.hex,
                        })
                      }
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "border-slate-900 dark:border-white shadow-sm ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="text-slate-800 dark:text-slate-200">
                        {swatch.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                Font Family
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FONT_OPTIONS.map((font) => {
                  const isSelected = themeConfig.fontFamily === font.id;
                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() =>
                        onThemeConfigChange({
                          ...themeConfig,
                          fontFamily: font.id,
                        })
                      }
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${font.fontClass}`}>
                          {font.name}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">
                        {font.sample}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
