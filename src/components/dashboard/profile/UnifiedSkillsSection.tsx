"use client";

import { Plus, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import {
  EXPERIENCE_YEAR_OPTIONS,
  POPULAR_SKILL_SUGGESTIONS,
  PROFICIENCY_OPTIONS,
  type TechnicalSkill,
} from "./types";
import { UnifiedSkillCard } from "./UnifiedSkillCard";

interface UnifiedSkillsSectionProps {
  skills: string[];
  technicalSkills: TechnicalSkill[];
  onChange: (skills: string[], technicalSkills: TechnicalSkill[]) => void;
  maxSkills?: number;
}

export function UnifiedSkillsSection({
  skills = [],
  technicalSkills = [],
  onChange,
  maxSkills = 20,
}: UnifiedSkillsSectionProps) {
  const [inputSkill, setInputSkill] = useState("");
  const [selectedYears, setSelectedYears] = useState("2 years");
  const [selectedProficiency, setSelectedProficiency] = useState<
    "beginner" | "intermediate" | "advanced" | "expert"
  >("intermediate");
  const [error, setError] = useState<string | null>(null);

  const mergedSkills = useMemo(() => {
    const list: Array<{
      name: string;
      yearsOfExperience?: string;
      proficiency?: string;
      id?: string;
    }> = [];
    const seen = new Set<string>();

    for (const t of technicalSkills) {
      if (t.name?.trim()) {
        const lower = t.name.trim().toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          list.push({
            name: t.name.trim(),
            yearsOfExperience: t.yearsOfExperience
              ? String(t.yearsOfExperience)
              : "2 years",
            proficiency: t.proficiency || "intermediate",
            id: t.id,
          });
        }
      }
    }

    for (const s of skills) {
      if (typeof s === "string" && s.trim()) {
        const lower = s.trim().toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          list.push({
            name: s.trim(),
            yearsOfExperience: "2 years",
            proficiency: "intermediate",
          });
        }
      }
    }

    return list;
  }, [skills, technicalSkills]);

  const syncState = (
    updatedList: Array<{
      name: string;
      yearsOfExperience?: string;
      proficiency?: string;
      id?: string;
    }>,
  ) => {
    const newSkills = updatedList.map((item) => item.name);
    const newTechSkills: TechnicalSkill[] = updatedList.map((item) => ({
      id:
        item.id ||
        `tech-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: item.name,
      yearsOfExperience: item.yearsOfExperience || "2 years",
      proficiency:
        (item.proficiency as TechnicalSkill["proficiency"]) || "intermediate",
    }));

    onChange(newSkills, newTechSkills);
  };

  const handleAddSkill = (
    nameToAdd?: string,
    yearsToAdd?: string,
    profToAdd?: "beginner" | "intermediate" | "advanced" | "expert",
  ) => {
    setError(null);
    const targetName = (nameToAdd || inputSkill).trim();
    if (!targetName) {
      setError("Please enter a skill name");
      return;
    }

    if (mergedSkills.length >= maxSkills) {
      setError(`Maximum limit of ${maxSkills} skills reached.`);
      return;
    }

    if (
      mergedSkills.some(
        (s) => s.name.toLowerCase() === targetName.toLowerCase(),
      )
    ) {
      setError(`"${targetName}" is already added.`);
      return;
    }

    const updated = [
      ...mergedSkills,
      {
        name: targetName,
        yearsOfExperience: yearsToAdd || selectedYears,
        proficiency: profToAdd || selectedProficiency,
        id: `tech-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      },
    ];

    syncState(updated);
    setInputSkill("");
    setError(null);
  };

  const handleRemoveSkill = (index: number) => {
    syncState(mergedSkills.filter((_, i) => i !== index));
  };

  const handleUpdateSkillMeta = (
    index: number,
    field: "yearsOfExperience" | "proficiency",
    val: string,
  ) => {
    const updated = [...mergedSkills];
    updated[index] = { ...updated[index], [field]: val };
    syncState(updated);
  };

  const unselectedSuggestions = POPULAR_SKILL_SUGGESTIONS.filter(
    (s) => !mergedSkills.some((m) => m.name.toLowerCase() === s.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          <Wrench className="w-4 h-4 text-indigo-500" />
          <span>Skills Portfolio (Powers Scraped Job Matching)</span>
        </label>
        <span className="text-xs text-slate-400 font-semibold">
          {mergedSkills.length}/{maxSkills} Skills
        </span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
        Skills auto-extracted from your uploaded resume. You can add more skills
        or adjust proficiency below. Scraped jobs in the database will be
        matched and recommended based on these competencies.
      </p>

      {/* Add Skill Form Input */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="e.g. React, Next.js, Docker, Python..."
              value={inputSkill}
              onChange={(e) => {
                setInputSkill(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="input text-xs sm:text-sm h-9 w-full"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedYears}
              onChange={(e) => setSelectedYears(e.target.value)}
              className="input text-xs sm:text-sm h-9 cursor-pointer w-full"
            >
              {EXPERIENCE_YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y} exp
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={selectedProficiency}
              onChange={(e) =>
                setSelectedProficiency(
                  e.target.value as
                    | "beginner"
                    | "intermediate"
                    | "advanced"
                    | "expert",
                )
              }
              className="input text-xs sm:text-sm h-9 capitalize cursor-pointer w-full"
            >
              {PROFICIENCY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="w-full h-9 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </p>
        )}

        {/* Quick Add Suggestion Chips */}
        {unselectedSuggestions.length > 0 &&
          mergedSkills.length < maxSkills && (
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium mr-1">
                Quick add:
              </span>
              {unselectedSuggestions.slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  + {s}
                </button>
              ))}
            </div>
          )}
      </div>

      {/* Added Skills List */}
      {mergedSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {mergedSkills.map((item, idx) => (
            <UnifiedSkillCard
              key={item.id || `${item.name}-${idx}`}
              name={item.name}
              yearsOfExperience={item.yearsOfExperience}
              proficiency={item.proficiency}
              index={idx}
              experienceYearOptions={EXPERIENCE_YEAR_OPTIONS}
              proficiencyOptions={PROFICIENCY_OPTIONS}
              onUpdateMeta={handleUpdateSkillMeta}
              onRemove={handleRemoveSkill}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">
          No skills added yet. Use the input or click quick-add suggestions
          above to document your capabilities.
        </p>
      )}
    </div>
  );
}
