"use client";

import { ArrowLeft, ArrowRight, Check, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ResumeDocumentPreview } from "./ResumeDocumentPreview";
import { DEMO_RESUME_DATA } from "./resumeBuilder.utils";
import {
  AVAILABLE_TEMPLATES,
  type ResumeThemeConfig,
  type TemplateId,
} from "./types";

export function TemplateSelectionPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("modern");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId | null>(
    null,
  );

  const previewThemeConfig: ResumeThemeConfig = {
    accentColor:
      selectedTemplate === "modern"
        ? "#4f46e5"
        : selectedTemplate === "executive"
          ? "#0f172a"
          : selectedTemplate === "tech"
            ? "#059669"
            : "#2563eb",
    fontFamily:
      selectedTemplate === "executive"
        ? "serif"
        : selectedTemplate === "tech"
          ? "mono"
          : "sans",
    layoutDensity: "normal",
  };

  const handleNext = () => {
    router.push(`/resumes/builder?template=${selectedTemplate}`);
  };

  const currentSelectedMeta = AVAILABLE_TEMPLATES.find(
    (t) => t.id === selectedTemplate,
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Top Breadcrumb & Step Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/resumes"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-600 dark:text-slate-400"
            title="Back to Resumes"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 uppercase tracking-wider">
                Step 1 of 2
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Template Selection
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Select Your Resume Template
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Choose a structure that matches your career level. You can
              customize colors, fonts, and content on the next page.
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={handleNext}
          className="btn-primary py-2.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 cursor-pointer bg-linear-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm"
        >
          <span>Next: Edit Resume</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AVAILABLE_TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;

          return (
            <div
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl.id)}
              className={`rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative group ${
                isSelected
                  ? "border-indigo-600 bg-white dark:bg-slate-900 shadow-xl ring-4 ring-indigo-500/15 scale-[1.02]"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Top Badge */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                {tmpl.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-white shadow-xs ${
                      tmpl.isPro
                        ? "bg-linear-to-r from-amber-500 to-orange-500"
                        : "bg-indigo-600"
                    }`}
                  >
                    {tmpl.badge}
                  </span>
                )}
                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Graphical Miniature Preview */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-center relative min-h-47.5">
                {/* Visual Representation of Template */}
                {tmpl.id === "modern" && (
                  <div className="w-40 h-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm p-2 flex flex-col justify-between pointer-events-none">
                    <div>
                      <div className="h-2 w-16 bg-indigo-600 rounded-sm mb-1" />
                      <div className="h-1 w-24 bg-slate-400 rounded-xs mb-2" />
                      <div className="h-0.5 w-full bg-indigo-200 mb-2" />
                      <div className="h-1 w-12 bg-indigo-500 rounded-xs mb-1" />
                      <div className="h-1 w-full bg-slate-200 rounded-xs mb-0.5" />
                      <div className="h-1 w-32 bg-slate-200 rounded-xs mb-2" />
                      <div className="h-1 w-14 bg-indigo-500 rounded-xs mb-1" />
                      <div className="h-1 w-28 bg-slate-300 rounded-xs mb-0.5" />
                      <div className="h-1 w-full bg-slate-200 rounded-xs mb-0.5" />
                      <div className="h-1 w-36 bg-slate-200 rounded-xs" />
                    </div>
                    <div className="flex gap-1 pt-1 border-t border-slate-100">
                      <div className="h-1.5 w-6 bg-slate-300 rounded-xs" />
                      <div className="h-1.5 w-8 bg-slate-300 rounded-xs" />
                      <div className="h-1.5 w-6 bg-slate-300 rounded-xs" />
                    </div>
                  </div>
                )}

                {tmpl.id === "executive" && (
                  <div className="w-40 h-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm p-2 flex flex-col justify-between pointer-events-none">
                    <div className="text-center">
                      <div className="h-2 w-20 bg-slate-800 dark:bg-slate-200 rounded-sm mx-auto mb-1" />
                      <div className="h-1 w-28 bg-slate-400 rounded-xs mx-auto mb-1.5" />
                      <div className="h-0.5 w-full bg-slate-400 mb-2" />
                      <div className="h-1 w-16 bg-slate-700 rounded-xs mb-1 text-left" />
                      <div className="h-1 w-full bg-slate-200 rounded-xs mb-0.5" />
                      <div className="h-1 w-full bg-slate-200 rounded-xs mb-0.5" />
                      <div className="h-1 w-28 bg-slate-200 rounded-xs mb-2" />
                      <div className="h-1 w-20 bg-slate-700 rounded-xs mb-1 text-left" />
                      <div className="h-1 w-full bg-slate-200 rounded-xs mb-0.5" />
                      <div className="h-1 w-36 bg-slate-200 rounded-xs" />
                    </div>
                    <div className="h-1 w-24 bg-slate-400 rounded-xs mx-auto" />
                  </div>
                )}

                {tmpl.id === "tech" && (
                  <div className="w-40 h-44 bg-slate-900 border border-slate-700 rounded shadow-sm p-2 flex flex-col justify-between pointer-events-none font-mono">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[9px] text-emerald-400 font-bold">
                          &gt;
                        </span>
                        <div className="h-2 w-16 bg-white rounded-sm" />
                      </div>
                      <div className="h-1 w-20 bg-slate-500 rounded-xs mb-2" />
                      <div className="flex gap-1 mb-2">
                        <div className="h-1.5 w-6 bg-slate-800 border border-slate-700 rounded-xs" />
                        <div className="h-1.5 w-7 bg-slate-800 border border-slate-700 rounded-xs" />
                        <div className="h-1.5 w-6 bg-slate-800 border border-slate-700 rounded-xs" />
                      </div>
                      <div className="h-1 w-14 bg-emerald-400 rounded-xs mb-1" />
                      <div className="h-1 w-full bg-slate-700 rounded-xs mb-0.5" />
                      <div className="h-1 w-28 bg-slate-700 rounded-xs mb-2" />
                      <div className="h-1 w-12 bg-emerald-400 rounded-xs mb-1" />
                      <div className="h-1 w-full bg-slate-700 rounded-xs" />
                    </div>
                    <div className="h-1 w-28 bg-slate-600 rounded-xs" />
                  </div>
                )}

                {tmpl.id === "creative" && (
                  <div className="w-40 h-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm flex pointer-events-none overflow-hidden">
                    {/* Left Mini Sidebar */}
                    <div className="w-[35%] bg-slate-100 dark:bg-slate-800 p-1.5 flex flex-col justify-between border-r border-slate-200 dark:border-slate-700">
                      <div>
                        <div className="h-2 w-8 bg-blue-600 rounded-xs mb-1" />
                        <div className="h-1 w-10 bg-slate-400 rounded-xs mb-2" />
                        <div className="h-1 w-6 bg-slate-500 rounded-xs mb-1" />
                        <div className="h-1 w-8 bg-slate-300 rounded-xs mb-0.5" />
                        <div className="h-1 w-7 bg-slate-300 rounded-xs mb-2" />
                      </div>
                      <div className="h-1 w-8 bg-slate-400 rounded-xs" />
                    </div>
                    {/* Right Mini Content */}
                    <div className="w-[65%] p-1.5">
                      <div className="h-1.5 w-14 bg-blue-600 rounded-xs mb-1" />
                      <div className="h-1 w-full bg-slate-200 rounded-xs mb-0.5" />
                      <div className="h-1 w-16 bg-slate-200 rounded-xs mb-2" />
                      <div className="h-1.5 w-12 bg-blue-600 rounded-xs mb-1" />
                      <div className="h-1 w-full bg-slate-200 rounded-xs mb-0.5" />
                      <div className="h-1 w-20 bg-slate-200 rounded-xs" />
                    </div>
                  </div>
                )}

                {/* Quick Full Preview Trigger Hover Overlay */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(tmpl.id);
                  }}
                  className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-all opacity-90 hover:opacity-100"
                  title="View full A4 sample preview"
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {tmpl.subtitle}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                {/* Select / Active Indicator */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      isSelected
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        Selected
                      </>
                    ) : (
                      "Click to Select"
                    )}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400">
                    ATS 100%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating / Sticky Bottom Navigation Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/resumes"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">
              |
            </span>
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-500">Selected Template:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {currentSelectedMeta?.name}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                ({currentSelectedMeta?.subtitle})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="btn-primary py-2.5 px-6 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer bg-linear-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm"
          >
            <span>Next: Edit Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full Sample Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Template Preview:{" "}
                  {
                    AVAILABLE_TEMPLATES.find((t) => t.id === previewTemplate)
                      ?.name
                  }
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sample document rendered at full resolution.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(previewTemplate);
                    setPreviewTemplate(null);
                    handleNext();
                  }}
                  className="btn-primary text-xs py-1.5 px-4 font-bold flex items-center gap-1.5"
                >
                  <span>Select & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Document Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950 flex justify-center">
              <div className="w-[210mm] max-w-full bg-white text-slate-900 shadow-xl rounded-sm p-[14mm_16mm]">
                <ResumeDocumentPreview
                  data={DEMO_RESUME_DATA}
                  templateId={previewTemplate}
                  themeConfig={previewThemeConfig}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
