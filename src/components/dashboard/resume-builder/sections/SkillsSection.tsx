"use client";

import { ChevronDown, ChevronUp, Plus, Trash2, Wrench } from "lucide-react";
import type { ResumeSkillGroup } from "../types";

interface SkillsSectionProps {
  skillGroups: ResumeSkillGroup[];
  onChange: (groups: ResumeSkillGroup[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SkillsSection({
  skillGroups,
  onChange,
  isOpen,
  onToggle,
}: SkillsSectionProps) {
  const addSkillGroup = () => {
    const newGroup: ResumeSkillGroup = {
      category: "Specialized Skills",
      skills: [],
    };
    onChange([...skillGroups, newGroup]);
  };

  const updateSkillGroup = (idx: number, fields: Partial<ResumeSkillGroup>) => {
    const newGroups = [...skillGroups];
    newGroups[idx] = { ...newGroups[idx], ...fields };
    onChange(newGroups);
  };

  const removeSkillGroup = (idx: number) => {
    onChange(skillGroups.filter((_, i) => i !== idx));
  };

  return (
    <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <Wrench className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Skills & Tech Stack ({skillGroups.length} Groups)</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addSkillGroup}
            className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1 cursor-pointer hover:bg-purple-100"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="p-1 cursor-pointer text-slate-400"
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 space-y-4 bg-white dark:bg-slate-900">
          {skillGroups.map((group, gIdx) => (
            <div
              key={`skillgroup-${group.category}-${gIdx}`}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-2"
            >
              <div className="flex justify-between items-center gap-2">
                <input
                  type="text"
                  value={group.category}
                  onChange={(e) =>
                    updateSkillGroup(gIdx, { category: e.target.value })
                  }
                  placeholder="Category (e.g. Core Languages, Cloud Platforms)"
                  className="font-bold text-xs text-slate-800 dark:text-slate-200 bg-transparent border-b border-slate-300 dark:border-slate-700 px-1 py-0.5 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeSkillGroup(gIdx)}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  title="Remove group"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={group.skills.join(", ")}
                  onChange={(e) =>
                    updateSkillGroup(gIdx, {
                      skills: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Enter skills separated by commas (e.g., React, TypeScript, Node.js, AWS)"
                  className="input-field text-xs w-full"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Separate skills with commas. They will automatically format as
                  pills or badges.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
