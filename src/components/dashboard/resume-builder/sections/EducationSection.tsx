"use client";

import {
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Plus,
  Trash2,
} from "lucide-react";
import { generateId } from "../resumeBuilder.utils";
import type { ResumeEducationItem } from "../types";

interface EducationSectionProps {
  educations: ResumeEducationItem[];
  onChange: (educations: ResumeEducationItem[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function EducationSection({
  educations,
  onChange,
  isOpen,
  onToggle,
}: EducationSectionProps) {
  const addEducation = () => {
    const newEdu: ResumeEducationItem = {
      id: generateId(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      honors: "",
    };
    onChange([...educations, newEdu]);
  };

  const updateEducation = (
    id: string,
    fields: Partial<ResumeEducationItem>,
  ) => {
    onChange(
      educations.map((edu) => (edu.id === id ? { ...edu, ...fields } : edu)),
    );
  };

  const removeEducation = (id: string) => {
    onChange(educations.filter((edu) => edu.id !== id));
  };

  return (
    <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Education ({educations.length})</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addEducation}
            className="text-xs px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer hover:bg-cyan-100"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Degree</span>
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
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3 relative"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  title="Remove education"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, { degree: e.target.value })
                    }
                    placeholder="Bachelor of Science"
                    className="input-field text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy || ""}
                    onChange={(e) =>
                      updateEducation(edu.id, {
                        fieldOfStudy: e.target.value,
                      })
                    }
                    placeholder="Computer Science"
                    className="input-field text-sm w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution / University *
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(edu.id, { institution: e.target.value })
                    }
                    placeholder="Stanford University"
                    className="input-field text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dates / Graduation Year
                  </label>
                  <input
                    type="text"
                    value={edu.endDate || ""}
                    onChange={(e) =>
                      updateEducation(edu.id, { endDate: e.target.value })
                    }
                    placeholder="2018 – 2022"
                    className="input-field text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Honors / GPA
                  </label>
                  <input
                    type="text"
                    value={edu.honors || ""}
                    onChange={(e) =>
                      updateEducation(edu.id, { honors: e.target.value })
                    }
                    placeholder="3.9 GPA / Summa Cum Laude"
                    className="input-field text-sm w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
