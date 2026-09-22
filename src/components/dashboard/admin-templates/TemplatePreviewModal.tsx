"use client";

import { Coins, ExternalLink, Palette, Sparkles, Type, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ResumeDocumentPreview } from "../resume-builder/ResumeDocumentPreview";
import { DEMO_RESUME_DATA } from "../resume-builder/resumeBuilder.utils";
import type { ResumeThemeConfig } from "../resume-builder/types";
import type { TemplateFormData } from "./TemplateFormModal";

interface AdminTemplateItem extends TemplateFormData {
  _id: string;
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: AdminTemplateItem | null;
}

const COLOR_SWATCHES = [
  { name: "Royal Indigo", hex: "#4f46e5" },
  { name: "Executive Slate", hex: "#0f172a" },
  { name: "Modern Emerald", hex: "#059669" },
  { name: "Electric Blue", hex: "#2563eb" },
  { name: "Crimson Red", hex: "#dc2626" },
  { name: "Royal Purple", hex: "#7c3aed" },
];

export function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
}: TemplatePreviewModalProps) {
  const [accentColor, setAccentColor] = useState<string>("#4f46e5");
  const [fontFamily, setFontFamily] = useState<"sans" | "serif" | "mono">(
    "sans",
  );

  // Sync state when template changes
  useEffect(() => {
    if (template) {
      setAccentColor(template.defaultTheme?.accentColor || "#4f46e5");
      setFontFamily(template.defaultTheme?.fontFamily || "sans");
    }
  }, [template]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  const themeConfig: ResumeThemeConfig = {
    accentColor,
    fontFamily,
    layoutDensity: template.defaultTheme?.layoutDensity || "normal",
  };

  const builderUrl = `/resumes/builder?template=${encodeURIComponent(
    template.slug,
  )}&color=${encodeURIComponent(accentColor)}&font=${encodeURIComponent(
    fontFamily,
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[92vh] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          {/* Template Info */}
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs"
              style={{ backgroundColor: accentColor }}
              title={`Accent: ${accentColor}`}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white font-space-grotesk">
                  {template.name}
                </h3>
                {template.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                    {template.badge}
                  </span>
                )}
                {template.isPro ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300">
                    <Coins className="w-3 h-3" />
                    <span>{template.tokenCost || 10} Tokens</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    Free Tier
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                  slug: {template.slug}
                </span>
                <span>•</span>
                <span className="capitalize">
                  {template.category} •{" "}
                  {template.layoutArchetype.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Controls & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Color Swatch Picker */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex items-center gap-1">
                {COLOR_SWATCHES.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setAccentColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                      accentColor === color.hex
                        ? "ring-2 ring-indigo-500 ring-offset-1 scale-110"
                        : "hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Font Selector */}
            <div className="flex items-center gap-1 px-1.5 py-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
              <Type className="w-3.5 h-3.5 text-slate-400 ml-1" />
              {(["sans", "serif", "mono"] as const).map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setFontFamily(font)}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                    fontFamily === font
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {font}
                </button>
              ))}
            </div>

            {/* Open in Builder Studio */}
            <Link
              href={builderUrl}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <span>Test in Builder</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dummy Data Banner Notification */}
        <div className="px-5 py-2 bg-indigo-50/80 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-300 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              <strong>Sample Candidate Data:</strong> Alex Chen — Senior
              Full-Stack & Cloud Engineer (Includes Experience, Education,
              Skills, Projects & Certifications).
            </span>
          </div>
          <span className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80 hidden md:inline">
            Zoom / pan preview canvas below
          </span>
        </div>

        {/* Document Preview Canvas */}
        <div className="flex-1 overflow-hidden relative">
          <ResumeDocumentPreview
            data={DEMO_RESUME_DATA}
            templateId={template.slug}
            layoutArchetype={template.layoutArchetype}
            themeConfig={themeConfig}
          />
        </div>
      </div>
    </div>
  );
}
