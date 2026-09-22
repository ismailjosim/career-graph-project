"use client";

import { Check } from "lucide-react";
import { COLOR_SWATCHES, FONT_OPTIONS, type ResumeThemeConfig } from "./types";

interface ResumeThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeConfig: ResumeThemeConfig;
  onThemeConfigChange: (config: ResumeThemeConfig) => void;
}

export function ResumeThemeModal({
  isOpen,
  onClose,
  themeConfig,
  onThemeConfigChange,
}: ResumeThemeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl animate-fade-in z-30">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-space-grotesk">
              Document Styling & Typography
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tailor accent colors and font pairings to your personal branding.
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
                      ? "border-slate-900 dark:border-white shadow-xs ring-2 ring-indigo-500/20"
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
  );
}
