"use client";

import { X } from "lucide-react";
import { useState } from "react";
import type { EducationEntry } from "./types";

interface EducationEntryEditorProps {
  initialData?: EducationEntry | null;
  onSave: (entry: Omit<EducationEntry, "id">) => void;
  onCancel: () => void;
  yearOptions: string[];
}

export function EducationEntryEditor({
  initialData,
  onSave,
  onCancel,
  yearOptions,
}: EducationEntryEditorProps) {
  const [institution, setInstitution] = useState(
    initialData?.institution || "",
  );
  const [degree, setDegree] = useState(initialData?.degree || "");
  const [fieldOfStudy, setFieldOfStudy] = useState(
    initialData?.fieldOfStudy || "",
  );
  const [startYear, setStartYear] = useState(initialData?.startYear || "");
  const isPresent = initialData?.endYear === "Present";
  const [isCurrentlyEnrolled, setIsCurrentlyEnrolled] = useState(isPresent);
  const [endYear, setEndYear] = useState(
    isPresent ? "" : initialData?.endYear || "",
  );
  const [credits, setCredits] = useState(initialData?.credits || "");
  const [grade, setGrade] = useState(initialData?.grade || "");
  const [activities, setActivities] = useState(initialData?.activities || "");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = () => {
    setFormError(null);
    if (!institution.trim()) {
      setFormError("Institution / School name is required");
      return;
    }
    if (!degree.trim()) {
      setFormError("Degree / Qualification is required");
      return;
    }

    onSave({
      institution: institution.trim(),
      degree: degree.trim(),
      fieldOfStudy: fieldOfStudy.trim(),
      startYear: startYear.trim(),
      endYear: isCurrentlyEnrolled ? "Present" : endYear.trim(),
      credits: credits.trim(),
      grade: grade.trim(),
      activities: activities.trim(),
    });
  };

  return (
    <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl space-y-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
          {initialData ? "Edit Qualification" : "Add New Qualification"}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Degree / Qualification *
          </label>
          <input
            type="text"
            placeholder="e.g. Bachelor of Science, Master of Engineering"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="input text-xs sm:text-sm h-9"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Field of Study / Major
          </label>
          <input
            type="text"
            placeholder="e.g. Computer Science, Software Engineering"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
            className="input text-xs sm:text-sm h-9"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
          Institution / University *
        </label>
        <input
          type="text"
          placeholder="e.g. University of California, Berkeley"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className="input text-xs sm:text-sm h-9"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Start Year
          </label>
          <select
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="input text-xs sm:text-sm h-9 cursor-pointer"
          >
            <option value="">Select year...</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              End Year
            </label>
            <label className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrentlyEnrolled}
                onChange={(e) => setIsCurrentlyEnrolled(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3 cursor-pointer"
              />
              <span>Currently Studying</span>
            </label>
          </div>

          {!isCurrentlyEnrolled ? (
            <select
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="input text-xs sm:text-sm h-9 cursor-pointer"
            >
              <option value="">Select year...</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          ) : (
            <div className="input text-xs sm:text-sm h-9 flex items-center text-slate-400 bg-slate-100 dark:bg-slate-800">
              Present
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Grade / GPA (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. 3.8 / 4.0 or First Class"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="input text-xs sm:text-sm h-9"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Credits / Units (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. 120 ECTS or 130 Units"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="input text-xs sm:text-sm h-9"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
          Activities / Societies / Honors (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. President of Computer Science Society, Dean's List"
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

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline py-1.5 px-3.5 text-xs cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary py-1.5 px-4 text-xs cursor-pointer"
        >
          {initialData ? "Update Entry" : "Save Entry"}
        </button>
      </div>
    </div>
  );
}
