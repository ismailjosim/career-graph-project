"use client";

import { Trash2 } from "lucide-react";

interface UnifiedSkillCardProps {
  name: string;
  yearsOfExperience?: string;
  proficiency?: string;
  index: number;
  experienceYearOptions: string[];
  proficiencyOptions: string[];
  onUpdateMeta: (
    index: number,
    field: "yearsOfExperience" | "proficiency",
    val: string,
  ) => void;
  onRemove: (index: number) => void;
}

export function UnifiedSkillCard({
  name,
  yearsOfExperience = "2 years",
  proficiency = "intermediate",
  index,
  experienceYearOptions,
  proficiencyOptions,
  onUpdateMeta,
  onRemove,
}: UnifiedSkillCardProps) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs group">
      <div className="min-w-0 pr-2 flex-1">
        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
          {name}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <select
            value={yearsOfExperience}
            onChange={(e) =>
              onUpdateMeta(index, "yearsOfExperience", e.target.value)
            }
            className="text-[10px] font-semibold py-0.5 px-1.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40 cursor-pointer"
          >
            {experienceYearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={proficiency}
            onChange={(e) => onUpdateMeta(index, "proficiency", e.target.value)}
            className="text-[10px] text-slate-500 dark:text-slate-400 capitalize py-0.5 px-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            {proficiencyOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
        title="Remove skill"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
