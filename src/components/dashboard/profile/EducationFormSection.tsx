"use client";

import { GraduationCap, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { EducationEntry } from "./types";

interface EducationFormSectionProps {
  education: EducationEntry[];
  onChange: (education: EducationEntry[]) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 50 }, (_, i) =>
  String(CURRENT_YEAR + 6 - i),
);

export function EducationFormSection({
  education = [],
  onChange,
}: EducationFormSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Sub-form state
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [isCurrentlyEnrolled, setIsCurrentlyEnrolled] = useState(false);
  const [credits, setCredits] = useState("");
  const [grade, setGrade] = useState("");
  const [activities, setActivities] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const resetSubForm = () => {
    setInstitution("");
    setDegree("");
    setFieldOfStudy("");
    setStartYear("");
    setEndYear("");
    setIsCurrentlyEnrolled(false);
    setCredits("");
    setGrade("");
    setActivities("");
    setFormError(null);
    setIsAdding(false);
    setEditingIndex(null);
  };

  const startEdit = (index: number) => {
    const item = education[index];
    if (!item) return;
    setInstitution(item.institution || "");
    setDegree(item.degree || "");
    setFieldOfStudy(item.fieldOfStudy || "");
    setStartYear(item.startYear || "");
    const isPresent = item.endYear === "Present";
    setIsCurrentlyEnrolled(isPresent);
    setEndYear(isPresent ? "" : item.endYear || "");
    setCredits(item.credits || "");
    setGrade(item.grade || "");
    setActivities(item.activities || "");
    setFormError(null);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleSaveEntry = () => {
    setFormError(null);
    if (!institution.trim()) {
      setFormError("Institution / School name is required");
      return;
    }
    if (!degree.trim()) {
      setFormError("Degree / Qualification is required");
      return;
    }

    const entry: EducationEntry = {
      id:
        editingIndex !== null && education[editingIndex]?.id
          ? education[editingIndex].id
          : `edu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      institution: institution.trim(),
      degree: degree.trim(),
      fieldOfStudy: fieldOfStudy.trim(),
      startYear: startYear.trim(),
      endYear: isCurrentlyEnrolled ? "Present" : endYear.trim(),
      credits: credits.trim(),
      grade: grade.trim(),
      activities: activities.trim(),
    };

    if (editingIndex !== null) {
      const updated = [...education];
      updated[editingIndex] = entry;
      onChange(updated);
    } else {
      onChange([...education, entry]);
    }

    resetSubForm();
  };

  const handleRemove = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
          <span>Education & Credentials</span>
        </label>
        {!isAdding && (
          <button
            type="button"
            onClick={() => {
              resetSubForm();
              setIsAdding(true);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Education</span>
          </button>
        )}
      </div>

      {/* Sub-form for Adding / Editing */}
      {isAdding && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-2 border-indigo-500/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {editingIndex !== null
                ? "Edit Education Entry"
                : "Add Education Credential"}
            </span>
            <button
              type="button"
              onClick={resetSubForm}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Institution / University / School *
              </label>
              <input
                type="text"
                placeholder="e.g. Stanford University"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="input text-xs sm:text-sm h-9"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Degree / Qualification *
              </label>
              <input
                type="text"
                placeholder="e.g. Bachelor of Science (B.S.)"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="input text-xs sm:text-sm h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Field of Study / Major
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="input text-xs sm:text-sm h-9"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Start Year
              </label>
              <select
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="input text-xs sm:text-sm h-9 cursor-pointer"
              >
                <option value="">Select start year</option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                End Year
              </label>
              <select
                disabled={isCurrentlyEnrolled}
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="input text-xs sm:text-sm h-9 cursor-pointer disabled:opacity-50"
              >
                <option value="">Select end year</option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edu-present"
              checked={isCurrentlyEnrolled}
              onChange={(e) => {
                setIsCurrentlyEnrolled(e.target.checked);
                if (e.target.checked) setEndYear("");
              }}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="edu-present"
              className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              I am currently enrolled / studying here
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Credits Completed / Required (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 120 credits / 160"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="input text-xs sm:text-sm h-9"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Grade / GPA (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 3.8 / 4.0 or First Class Honours"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="input text-xs sm:text-sm h-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Activities, Honors & Societies (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Dean's List, President of ACM Chapter, Robotics Club"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              className="input text-xs sm:text-sm h-9"
            />
          </div>

          {formError && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
              {formError}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetSubForm}
              className="btn-outline py-1.5 px-3 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEntry}
              className="btn-primary py-1.5 px-4 text-xs cursor-pointer"
            >
              {editingIndex !== null ? "Update Credential" : "Add Credential"}
            </button>
          </div>
        </div>
      )}

      {/* List of Saved Education Credentials */}
      {education.length > 0 ? (
        <div className="space-y-2">
          {education.map((item, idx) => {
            const hasTimeline = item.startYear || item.endYear;
            const timeline =
              hasTimeline &&
              `${item.startYear || ""}${
                item.startYear && item.endYear ? " - " : ""
              }${item.endYear || ""}`;

            return (
              <div
                key={item.id || `edu-${idx}`}
                className="flex items-start justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <div className="space-y-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.degree}
                    </span>
                    {item.fieldOfStudy && (
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        in {item.fieldOfStudy}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {item.institution || "Educational Institute"}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap pt-0.5">
                    {timeline && (
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {timeline}
                      </span>
                    )}
                    {item.grade && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Grade: {item.grade}
                      </span>
                    )}
                    {item.credits && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Credits: {item.credits}
                      </span>
                    )}
                  </div>

                  {item.activities && (
                    <p className="text-[11px] text-slate-400 italic pt-0.5">
                      {item.activities}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(idx)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !isAdding && (
          <p className="text-[11px] text-slate-400 italic">
            No education entries yet. Click &quot;Add Education&quot; to add
            your degrees, institute, and grades.
          </p>
        )
      )}
    </div>
  );
}
