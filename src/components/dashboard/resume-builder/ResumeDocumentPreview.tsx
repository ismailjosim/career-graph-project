"use client";

import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { ResumeTemplateRenderer } from "./templates/ResumeTemplateRenderer";
import type { ResumeBuilderData, ResumeThemeConfig, TemplateId } from "./types";

interface ResumeDocumentPreviewProps {
  data: ResumeBuilderData;
  templateId: TemplateId;
  themeConfig: ResumeThemeConfig;
}

export function ResumeDocumentPreview({
  data,
  templateId,
  themeConfig,
}: ResumeDocumentPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 140));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 60));
  const resetZoom = () => setZoomLevel(100);

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-100 dark:bg-slate-950/80 overflow-hidden">
      {/* Zoom / Scaling Control Float */}
      <div className="absolute top-3 right-4 z-10 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-md">
        <button
          type="button"
          onClick={zoomOut}
          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 px-1.5 select-none">
          {zoomLevel}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={resetZoom}
          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Reset Zoom"
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>

      {/* A4 Paper Scroll Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="transition-transform duration-150"
        >
          {/* Authentic A4 Document Canvas Sheet */}
          <div
            id="resume-preview-sheet"
            className="w-[210mm] min-h-[297mm] p-[14mm_16mm] bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-200/80 mx-auto select-text relative"
            style={{
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ResumeTemplateRenderer
              templateId={templateId}
              data={data}
              themeConfig={themeConfig}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
