"use client";

import { Plus, Sparkles, Trash2 } from "lucide-react";
import type { ResumeExperienceItem } from "../types";

interface ExperienceItemCardProps {
  exp: ResumeExperienceItem;
  roleNumber: number;
  onUpdate: (fields: Partial<ResumeExperienceItem>) => void;
  onRemove: () => void;
  onAddHighlight: () => void;
  onUpdateHighlight: (idx: number, val: string) => void;
  onRemoveHighlight: (idx: number) => void;
  onAiPolish: () => void;
  isPolishing: boolean;
}

export function ExperienceItemCard({
  exp,
  roleNumber,
  onUpdate,
  onRemove,
  onAddHighlight,
  onUpdateHighlight,
  onRemoveHighlight,
  onAiPolish,
  isPolishing,
}: ExperienceItemCardProps) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3 relative group">
      <div className="flex justify-between items-start gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Role #{roleNumber}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAiPolish}
            disabled={isPolishing}
            className="text-[11px] px-2 py-0.5 rounded-md bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold flex items-center gap-1 cursor-pointer hover:opacity-90 disabled:opacity-50"
            title="Rewrite bullet points using Google XYZ formula (10 Tokens)"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Bullets (10🪙)</span>
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
            title="Remove role"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Job Title / Role *
          </label>
          <input
            type="text"
            value={exp.role}
            onChange={(e) => onUpdate({ role: e.target.value })}
            placeholder="Lead Full-Stack Engineer"
            className="input-field text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            value={exp.company}
            onChange={(e) => onUpdate({ company: e.target.value })}
            placeholder="Acme Corp"
            className="input-field text-sm w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Location
          </label>
          <input
            type="text"
            value={exp.location || ""}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="San Francisco, CA (or Remote)"
            className="input-field text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Start Date
          </label>
          <input
            type="text"
            value={exp.startDate}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
            placeholder="Jan 2022"
            className="input-field text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            End Date
          </label>
          <input
            type="text"
            disabled={exp.isCurrent}
            value={exp.isCurrent ? "Present" : exp.endDate || ""}
            onChange={(e) => onUpdate({ endDate: e.target.value })}
            placeholder="Present or Dec 2023"
            className="input-field text-sm w-full disabled:opacity-50"
          />
          <label className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={exp.isCurrent}
              onChange={(e) =>
                onUpdate({
                  isCurrent: e.target.checked,
                  endDate: e.target.checked ? "Present" : "",
                })
              }
              className="rounded text-emerald-600"
            />
            <span>I currently work here</span>
          </label>
        </div>
      </div>

      {/* Role Summary / High-Level Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Role Overview (Optional)
        </label>
        <textarea
          rows={2}
          value={exp.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Brief 1-2 sentence overview of your scope, squad size, or primary objectives..."
          className="input-field text-sm w-full resize-none"
        />
      </div>

      {/* Highlights / Bullet Points */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Key Accomplishments & Bullet Points
          </label>
          <button
            type="button"
            onClick={onAddHighlight}
            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Bullet</span>
          </button>
        </div>

        <div className="space-y-2">
          {exp.highlights.map((bullet, bulletIdx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Highlight index in editable list
            <div key={bulletIdx} className="flex items-start gap-2">
              <span className="text-slate-400 text-xs mt-2 select-none">•</span>
              <textarea
                rows={2}
                value={bullet}
                onChange={(e) => onUpdateHighlight(bulletIdx, e.target.value)}
                placeholder="Accomplished [X] as measured by [Y] by doing [Z]..."
                className="input-field text-xs sm:text-sm flex-1 resize-none py-1.5"
              />
              {exp.highlights.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveHighlight(bulletIdx)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors mt-1 cursor-pointer"
                  title="Remove bullet"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
