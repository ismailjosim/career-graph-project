"use client";

import { Check, Coins, Sparkles } from "lucide-react";
import { PRESET_COLORS, type TemplateFormData } from "./templateForm.constants";

interface BasicInfoSectionProps {
  name: string;
  slug: string;
  subtitle: string;
  badge: string;
  description: string;
  onChangeName: (val: string) => void;
  onChangeSlug: (val: string) => void;
  onChangeSubtitle: (val: string) => void;
  onChangeBadge: (val: string) => void;
  onChangeDescription: (val: string) => void;
}

export function BasicInfoSection({
  name,
  slug,
  subtitle,
  badge,
  description,
  onChangeName,
  onChangeSlug,
  onChangeSubtitle,
  onChangeBadge,
  onChangeDescription,
}: BasicInfoSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Template Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="e.g. Minimalist Tech"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Slug (Unique Identifier) *
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => onChangeSlug(e.target.value)}
            placeholder="e.g. minimalist-tech"
            className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Subtitle / Role Target
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => onChangeSubtitle(e.target.value)}
            placeholder="e.g. Software Engineers & DevOps"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Badge Ribbon (Optional)
          </label>
          <input
            type="text"
            value={badge}
            onChange={(e) => onChangeBadge(e.target.value)}
            placeholder="e.g. Popular, PRO, New, Staff Pick"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder="Provide a clear description of layout and ATS optimization..."
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>
    </>
  );
}

interface ArchetypeSectionProps {
  category: TemplateFormData["category"];
  layoutArchetype: TemplateFormData["layoutArchetype"];
  onChangeCategory: (cat: TemplateFormData["category"]) => void;
  onChangeArchetype: (archetype: TemplateFormData["layoutArchetype"]) => void;
}

export function ArchetypeSection({
  category,
  layoutArchetype,
  onChangeCategory,
  onChangeArchetype,
}: ArchetypeSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) =>
            onChangeCategory(e.target.value as TemplateFormData["category"])
          }
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        >
          <option value="general">General / Standard</option>
          <option value="tech">Software & Tech</option>
          <option value="creative">Product & Creative</option>
          <option value="executive">Executive & Senior</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Layout Archetype Engine
        </label>
        <select
          value={layoutArchetype}
          onChange={(e) =>
            onChangeArchetype(
              e.target.value as TemplateFormData["layoutArchetype"],
            )
          }
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        >
          <option value="single_column">Single Column (Modern Clean)</option>
          <option value="executive_classic">
            Executive Classic (Serif Header)
          </option>
          <option value="minimal_tech">
            Tech Minimalist (Monospace Chips)
          </option>
          <option value="sidebar_left">Creative Sidebar (2-Column)</option>
        </select>
      </div>
    </div>
  );
}

interface PricingSectionProps {
  isPro: boolean;
  tokenCost: number;
  onTogglePro: (checked: boolean) => void;
  onChangeTokenCost: (cost: number) => void;
}

export function PricingSection({
  isPro,
  tokenCost,
  onTogglePro,
  onChangeTokenCost,
}: PricingSectionProps) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Premium (Pro) Template
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            When enabled, candidates must spend tokens or have Pro access to
            export PDF.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPro}
            onChange={(e) => onTogglePro(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {isPro && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              Token Price to Unlock
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={tokenCost}
              onChange={(e) =>
                onChangeTokenCost(
                  Math.max(0, parseInt(e.target.value, 10) || 0),
                )
              }
              className="w-32 px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <span className="text-xs text-slate-500">
            Default recommended: 10 Tokens
          </span>
        </div>
      )}
    </div>
  );
}

interface ThemeSettingsSectionProps {
  accentColor: string;
  fontFamily: "sans" | "serif" | "mono";
  onChangeAccentColor: (hex: string) => void;
  onChangeFontFamily: (font: "sans" | "serif" | "mono") => void;
}

export function ThemeSettingsSection({
  accentColor,
  fontFamily,
  onChangeAccentColor,
  onChangeFontFamily,
}: ThemeSettingsSectionProps) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Default Visual Theme
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Default Accent Color
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onChangeAccentColor(c.hex)}
                  className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {accentColor === c.hex && (
                    <Check className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={accentColor}
              onChange={(e) => onChangeAccentColor(e.target.value)}
              className="w-24 px-2 py-1 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Default Typography
          </label>
          <select
            value={fontFamily}
            onChange={(e) =>
              onChangeFontFamily(e.target.value as "sans" | "serif" | "mono")
            }
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="sans">Sans-Serif (Modern / Inter)</option>
            <option value="serif">Serif (Executive / Merriweather)</option>
            <option value="mono">Monospace (Technical / Space)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
