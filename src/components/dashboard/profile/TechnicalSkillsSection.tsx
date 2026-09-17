"use client";

import { Plus, Trash2, Wrench } from "lucide-react";
import { useState } from "react";
import type { TechnicalSkill } from "./types";

interface TechnicalSkillsSectionProps {
  skills: TechnicalSkill[];
  onChange: (skills: TechnicalSkill[]) => void;
}

const EXPERIENCE_YEAR_OPTIONS = [
  "< 1 year",
  "1 year",
  "2 years",
  "3 years",
  "4 years",
  "5 years",
  "6-7 years",
  "8-10 years",
  "10+ years",
];

const PROFICIENCY_OPTIONS: Array<
  "beginner" | "intermediate" | "advanced" | "expert"
> = ["beginner", "intermediate", "advanced", "expert"];

export function TechnicalSkillsSection({
  skills = [],
  onChange,
}: TechnicalSkillsSectionProps) {
  const [skillName, setSkillName] = useState("");
  const [years, setYears] = useState("2 years");
  const [proficiency, setProficiency] = useState<
    "beginner" | "intermediate" | "advanced" | "expert"
  >("intermediate");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    setError(null);
    const trimmed = skillName.trim();
    if (!trimmed) {
      setError("Please enter a technical skill name");
      return;
    }

    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setError(`"${trimmed}" is already added`);
      return;
    }

    const newSkill: TechnicalSkill = {
      id: `tech-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      yearsOfExperience: years,
      proficiency,
    };

    onChange([...skills, newSkill]);
    setSkillName("");
    setYears("2 years");
    setProficiency("intermediate");
  };

  const handleRemove = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          <Wrench className="w-3.5 h-3.5 text-indigo-500" />
          <span>Technical Skills with Experience</span>
        </label>
        <span className="text-xs text-slate-400 font-medium">
          {skills.length} added
        </span>
      </div>

      {/* Inline Add Row */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="e.g. Next.js, Docker, PostgreSQL"
              value={skillName}
              onChange={(e) => {
                setSkillName(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              className="input text-xs sm:text-sm h-9"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="input text-xs sm:text-sm h-9 cursor-pointer"
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
              value={proficiency}
              onChange={(e) =>
                setProficiency(
                  e.target.value as
                    | "beginner"
                    | "intermediate"
                    | "advanced"
                    | "expert",
                )
              }
              className="input text-xs sm:text-sm h-9 capitalize cursor-pointer"
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
              onClick={handleAdd}
              className="w-full h-9 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </p>
        )}
      </div>

      {/* Added Skills List */}
      {skills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
          {skills.map((skill, idx) => (
            <div
              key={skill.id || `${skill.name}-${idx}`}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs group"
            >
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {skill.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40">
                    {skill.yearsOfExperience}
                  </span>
                  {skill.proficiency && (
                    <span className="text-[10px] text-slate-400 capitalize">
                      {skill.proficiency}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Remove skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-slate-400 italic">
          No technical skills added yet. Add your specialized tech stack with
          years of experience above.
        </p>
      )}
    </div>
  );
}
