"use client";

import { useId, useMemo } from "react";
import CreatableSelect from "react-select/creatable";

interface OptionType {
  label: string;
  value: string;
}

interface CoreSkillsSelectProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  maxSkills?: number;
}

const POPULAR_SUGGESTIONS = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Tailwind CSS",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "AWS",
  "GraphQL",
  "Git",
  "REST APIs",
  "Redux",
];

export function CoreSkillsSelect({
  skills = [],
  onChange,
  maxSkills = 15,
}: CoreSkillsSelectProps) {
  const instanceId = useId();

  const value: OptionType[] = useMemo(() => {
    return skills.map((s) => ({ label: s, value: s }));
  }, [skills]);

  const options: OptionType[] = useMemo(() => {
    const existing = new Set(skills.map((s) => s.toLowerCase()));
    return POPULAR_SUGGESTIONS.filter(
      (s) => !existing.has(s.toLowerCase()),
    ).map((s) => ({ label: s, value: s }));
  }, [skills]);

  const isLimitReached = skills.length >= maxSkills;

  const handleChange = (selected: readonly OptionType[] | null) => {
    if (!selected) {
      onChange([]);
      return;
    }

    if (selected.length > maxSkills) {
      return; // prevent exceeding max
    }

    const cleaned = selected.map((opt) => opt.value.trim()).filter(Boolean);
    onChange(cleaned);
  };

  const handleAddSuggestion = (suggestion: string) => {
    if (isLimitReached) return;
    if (skills.some((s) => s.toLowerCase() === suggestion.toLowerCase()))
      return;
    onChange([...skills, suggestion]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Core Skills
        </label>
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold ${
              isLimitReached
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {skills.length}/{maxSkills}
          </span>
          <span className="text-slate-400 text-[11px]">(Max limit)</span>
        </div>
      </div>

      <CreatableSelect<OptionType, true>
        instanceId={instanceId}
        isMulti
        value={value}
        options={isLimitReached ? [] : options}
        onChange={handleChange}
        placeholder={
          isLimitReached
            ? `Maximum limit of ${maxSkills} skills reached`
            : "Type a skill and press Enter or comma, or select..."
        }
        noOptionsMessage={() =>
          isLimitReached
            ? `Maximum limit of ${maxSkills} skills reached`
            : "Type any skill name and press Enter to add"
        }
        isClearable={false}
        isDisabled={false}
        isValidNewOption={(inputValue) => {
          if (isLimitReached) return false;
          if (!inputValue || inputValue.trim().length === 0) return false;
          const trimmed = inputValue.trim().toLowerCase();
          return !skills.some((s) => s.toLowerCase() === trimmed);
        }}
        classNames={{
          control: ({ isFocused }) =>
            `!min-h-[42px] !rounded-xl !text-xs sm:!text-sm !transition-all !border ${
              isFocused
                ? "!border-indigo-500 !ring-2 !ring-indigo-500/20 !shadow-sm"
                : "!border-slate-300 dark:!border-slate-700 hover:!border-slate-400 dark:hover:!border-slate-600"
            } !bg-white dark:!bg-slate-900 !text-slate-800 dark:!text-slate-100`,
          menu: () =>
            "!bg-white dark:!bg-slate-900 !border !border-slate-200 dark:!border-slate-800 !rounded-xl !shadow-xl !overflow-hidden !z-50 !mt-1.5",
          option: ({ isFocused, isSelected }) =>
            `!text-xs sm:!text-sm !px-3.5 !py-2 !cursor-pointer ${
              isSelected
                ? "!bg-indigo-600 !text-white"
                : isFocused
                  ? "!bg-indigo-50 dark:!bg-indigo-950/60 !text-indigo-700 dark:!text-indigo-300"
                  : "!text-slate-700 dark:!text-slate-200"
            }`,
          multiValue: () =>
            "!bg-indigo-50 dark:!bg-indigo-950/70 !border !border-indigo-200 dark:!border-indigo-800/60 !rounded-lg !my-0.5 !mr-1",
          multiValueLabel: () =>
            "!text-indigo-700 dark:!text-indigo-300 !text-xs !font-semibold !px-2 !py-0.5",
          multiValueRemove: () =>
            "!text-indigo-500 hover:!text-indigo-700 hover:!bg-indigo-100 dark:hover:!bg-indigo-900/60 !rounded-r-lg !px-1.5 !cursor-pointer",
          input: () =>
            "!text-slate-800 dark:!text-slate-100 !text-xs sm:!text-sm",
          placeholder: () =>
            "!text-slate-400 dark:!text-slate-500 !text-xs sm:!text-sm",
        }}
      />

      {/* Suggested Quick Add Chips */}
      {!isLimitReached && options.length > 0 && (
        <div className="pt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mr-1">
            Quick add:
          </span>
          {options.slice(0, 6).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleAddSuggestion(opt.value)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              + {opt.label}
            </button>
          ))}
        </div>
      )}

      {isLimitReached && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
          You have reached the maximum of {maxSkills} skills. Remove a skill to
          add another.
        </p>
      )}
    </div>
  );
}
