"use client";

import { Check, Eye, Palette, Sparkles, Type } from "lucide-react";
import type { TemplateId, TemplateMetadata } from "./types";

export const COLOR_VARIANTS = [
  { id: "indigo", name: "Royal Indigo", hex: "#4f46e5" },
  { id: "slate", name: "Executive Slate", hex: "#0f172a" },
  { id: "emerald", name: "Modern Emerald", hex: "#059669" },
  { id: "blue", name: "Electric Blue", hex: "#2563eb" },
  { id: "crimson", name: "Crimson Red", hex: "#dc2626" },
  { id: "purple", name: "Royal Purple", hex: "#7c3aed" },
];

export const FONT_VARIANTS: { id: "sans" | "serif" | "mono"; label: string }[] =
  [
    { id: "sans", label: "Sans" },
    { id: "serif", label: "Serif" },
    { id: "mono", label: "Mono" },
  ];

interface TemplateSelectionCardProps {
  template: TemplateMetadata;
  isSelected: boolean;
  cardColor: string;
  cardFont: "sans" | "serif" | "mono";
  onSelect: (id: TemplateId) => void;
  onPreview: (id: TemplateId) => void;
  onUpdateVariantColor: (id: string, color: string) => void;
  onUpdateVariantFont: (id: string, font: "sans" | "serif" | "mono") => void;
}

export function TemplateSelectionCard({
  template: tmpl,
  isSelected,
  cardColor,
  cardFont,
  onSelect,
  onPreview,
  onUpdateVariantColor,
  onUpdateVariantFont,
}: TemplateSelectionCardProps) {
  return (
    <div
      onClick={() => onSelect(tmpl.id)}
      className={`rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative group bg-white dark:bg-slate-900 ${
        isSelected
          ? "border-indigo-600 shadow-xl ring-4 ring-indigo-500/15 scale-[1.01]"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md"
      }`}
    >
      {/* Top Badge & Pro Tier */}
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
        {tmpl.isPro ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-500 text-white shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>PRO • {tmpl.tokenCost || 10} 🪙</span>
          </span>
        ) : tmpl.badge ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-white bg-indigo-600 shadow-xs">
            {tmpl.badge}
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800">
            Free (0 🪙)
          </span>
        )}
        {isSelected && (
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Check className="w-3 h-3 stroke-3" />
          </span>
        )}
      </div>

      {/* Template Miniature Thumbnail Card with Live Color Accent */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 relative flex items-center justify-center min-h-48 overflow-hidden">
        <div
          className="w-full aspect-210/297 bg-white rounded shadow-xs border border-slate-200/80 dark:border-slate-800 p-2.5 flex flex-col justify-between select-none pointer-events-none transform transition-transform group-hover:scale-105 duration-200"
          style={{ maxHeight: "200px" }}
        >
          {/* Mock layout lines */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-full shrink-0 transition-colors"
                style={{ backgroundColor: cardColor }}
              />
              <div className="space-y-1 flex-1">
                <div className="h-1.5 w-16 bg-slate-800 rounded" />
                <div className="h-1 w-10 bg-slate-400 rounded" />
              </div>
            </div>
            <div
              className="h-0.5 w-full transition-colors"
              style={{ backgroundColor: `${cardColor}40` }}
            />
            <div className="space-y-1 pt-0.5">
              <div className="h-1 w-full bg-slate-300 rounded" />
              <div className="h-1 w-4/5 bg-slate-200 rounded" />
              <div className="h-1 w-3/4 bg-slate-200 rounded" />
            </div>
            <div className="pt-1 space-y-1">
              <div
                className="h-1 w-1/3 rounded transition-colors"
                style={{ backgroundColor: cardColor }}
              />
              <div className="h-1 w-full bg-slate-200 rounded" />
              <div className="h-1 w-5/6 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="pt-1 flex justify-between items-center text-[7px] text-slate-400">
            <span className="uppercase font-mono">{cardFont}</span>
            <span className="font-mono">
              {(tmpl.layoutArchetype || "single_column").replace("_", "-")}
            </span>
          </div>
        </div>

        {/* Hover Quick Preview Button */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(tmpl.id);
            }}
            className="px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs shadow-xs hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Full Preview</span>
          </button>
        </div>
      </div>

      {/* Template Info & Interactive Variant Pickers */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate font-space-grotesk">
            {tmpl.name}
          </h3>
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
              {tmpl.subtitle}
            </p>
            {tmpl.usageCount !== undefined && tmpl.usageCount > 0 && (
              <span className="shrink-0 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {tmpl.usageCount} {tmpl.usageCount === 1 ? "time" : "times"}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {tmpl.description}
          </p>
        </div>

        {/* Color & Font Variant Selectors */}
        <div
          className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Color Swatches */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Palette className="w-3 h-3" />
              Color
            </span>
            <div className="flex items-center gap-1">
              {COLOR_VARIANTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onUpdateVariantColor(tmpl.id, c.hex)}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform hover:scale-125 cursor-pointer ${
                    cardColor === c.hex
                      ? "ring-2 ring-indigo-500 ring-offset-1 scale-110 border-white"
                      : "border-black/10"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Font Family Pills */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Type className="w-3 h-3" />
              Font
            </span>
            <div className="flex items-center gap-1">
              {FONT_VARIANTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onUpdateVariantFont(tmpl.id, f.id)}
                  className={`px-1.5 py-0.5 text-[9px] font-semibold rounded transition-colors cursor-pointer ${
                    cardFont === f.id
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Selection Status */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span
            className={`text-[11px] font-bold flex items-center gap-1 ${
              isSelected
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Selected</span>
              </>
            ) : (
              <span>Click to Select</span>
            )}
          </span>
          <span className="text-[10px] text-slate-400 capitalize font-medium">
            {tmpl.category}
          </span>
        </div>
      </div>
    </div>
  );
}
