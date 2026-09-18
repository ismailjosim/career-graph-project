"use client";

import { Eye, FileEdit } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ResumeDocumentPreview } from "./ResumeDocumentPreview";
import { ResumeFormEditor } from "./ResumeFormEditor";
import { ResumeToolbar } from "./ResumeToolbar";
import {
  DEMO_RESUME_DATA,
  EMPTY_RESUME_DATA,
  exportResumeToPdf,
  printResumeDocument,
} from "./resumeBuilder.utils";
import type { ResumeBuilderData, ResumeThemeConfig, TemplateId } from "./types";

export function ResumeBuilderStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const existingId = searchParams.get("id");
  const templateParam = searchParams.get("template") as TemplateId | null;

  const validTemplate =
    templateParam &&
    ["modern", "executive", "tech", "creative"].includes(templateParam)
      ? templateParam
      : "modern";

  const [resumeId, setResumeId] = useState<string | null>(existingId);
  const [resumeName, setResumeName] = useState<string>(
    "My Professional Resume",
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>(validTemplate);
  const [themeConfig, setThemeConfig] = useState<ResumeThemeConfig>({
    accentColor:
      validTemplate === "modern"
        ? "#4f46e5"
        : validTemplate === "executive"
          ? "#0f172a"
          : validTemplate === "tech"
            ? "#059669"
            : "#2563eb",
    fontFamily:
      validTemplate === "executive"
        ? "serif"
        : validTemplate === "tech"
          ? "mono"
          : "sans",
    layoutDensity: "normal",
  });
  const [builderData, setBuilderData] =
    useState<ResumeBuilderData>(DEMO_RESUME_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"editor" | "preview">(
    "editor",
  );

  // Track initial load
  const isInitialLoad = useRef(true);

  // If existingId is present, fetch the existing resume
  useEffect(() => {
    if (!existingId) return;

    fetch(`/api/resumes/builder?id=${existingId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load resume");
        return res.json();
      })
      .then((data) => {
        if (data.name) setResumeName(data.name);
        if (data.templateId) setSelectedTemplate(data.templateId);
        if (data.themeConfig) setThemeConfig(data.themeConfig);
        if (data.builderData) setBuilderData(data.builderData);
        setResumeId(data._id);
        isInitialLoad.current = false;
      })
      .catch((err) => {
        console.error("Failed to load resume:", err);
        toast.error("Failed to load existing resume");
      });
  }, [existingId]);

  const handleDataChange = (newData: ResumeBuilderData) => {
    setBuilderData(newData);
    setHasUnsavedChanges(true);
  };

  const handleNameChange = (name: string) => {
    setResumeName(name);
    setHasUnsavedChanges(true);
  };

  const handleTemplateChange = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    setHasUnsavedChanges(true);
    toast.info(`Switched template to ${templateId.toUpperCase()}`);
  };

  const handleThemeChange = (config: ResumeThemeConfig) => {
    setThemeConfig(config);
    setHasUnsavedChanges(true);
  };

  const handleLoadDemoData = () => {
    setBuilderData(DEMO_RESUME_DATA);
    setHasUnsavedChanges(true);
    toast.success("Loaded sample professional data!");
  };

  const handleResetData = () => {
    setBuilderData(EMPTY_RESUME_DATA);
    setHasUnsavedChanges(true);
    toast.info("Cleared resume fields.");
  };

  const handleSave = async () => {
    if (!resumeName.trim()) {
      toast.error("Please provide a resume name before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/resumes/builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: resumeId || undefined,
          name: resumeName.trim(),
          templateId: selectedTemplate,
          themeConfig,
          builderData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save resume");
      }

      setResumeId(data._id);
      setHasUnsavedChanges(false);
      toast.success("Resume saved successfully!");

      // Update URL with ID if it was newly created
      if (!existingId && data._id) {
        window.history.replaceState(
          null,
          "",
          `/resumes/builder?id=${data._id}`,
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    printResumeDocument("resume-preview-sheet");
  };

  const handleDownloadPdf = () => {
    exportResumeToPdf(resumeName, "resume-preview-sheet");
  };

  const handleAtsCheck = async () => {
    // Save first, then forward to ATS checker
    await handleSave();
    toast.info("Opening ATS Checker...");
    router.push(`/ats-checker`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Top Toolbar */}
      <ResumeToolbar
        resumeName={resumeName}
        onResumeNameChange={handleNameChange}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleTemplateChange}
        themeConfig={themeConfig}
        onThemeConfigChange={handleThemeChange}
        onLoadDemoData={handleLoadDemoData}
        onResetData={handleResetData}
        onSave={handleSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        onAtsCheck={handleAtsCheck}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2">
        <button
          type="button"
          onClick={() => setActiveMobileTab("editor")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeMobileTab === "editor"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>Form Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab("preview")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeMobileTab === "preview"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live A4 Preview</span>
        </button>
      </div>

      {/* Split Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Form Editor */}
        <div
          className={`w-full lg:w-[45%] xl:w-[42%] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto ${
            activeMobileTab === "editor" ? "block" : "hidden lg:block"
          }`}
        >
          <ResumeFormEditor data={builderData} onChange={handleDataChange} />
        </div>

        {/* Right Side: Live Document Preview */}
        <div
          className={`w-full lg:w-[55%] xl:w-[58%] overflow-hidden ${
            activeMobileTab === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          <ResumeDocumentPreview
            data={builderData}
            templateId={selectedTemplate}
            themeConfig={themeConfig}
          />
        </div>
      </div>
    </div>
  );
}
