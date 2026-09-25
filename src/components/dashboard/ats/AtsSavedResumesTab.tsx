"use client";

import type { SavedResumeOption } from "./types";

interface AtsSavedResumesTabProps {
  loadingResumes: boolean;
  savedResumes: SavedResumeOption[];
  selectedResumeId: string;
  onSelectedResumeChange: (id: string) => void;
  onSwitchToUpload: () => void;
}

export function AtsSavedResumesTab({
  loadingResumes,
  savedResumes,
  selectedResumeId,
  onSelectedResumeChange,
  onSwitchToUpload,
}: AtsSavedResumesTabProps) {
  if (loadingResumes) {
    return (
      <div className="py-6 text-center text-xs text-slate-500">
        Loading your saved resumes...
      </div>
    );
  }

  if (savedResumes.length === 0) {
    return (
      <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
        <p className="text-xs text-slate-500">
          You don&apos;t have any saved resumes yet.
        </p>
        <button
          type="button"
          onClick={onSwitchToUpload}
          className="btn-primary py-1.5 px-3 text-xs"
        >
          Upload a Resume File
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {savedResumes.map((resume) => {
        const isSelected = selectedResumeId === resume._id;
        return (
          <label
            key={resume._id}
            className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
              isSelected
                ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <input
              type="radio"
              name="savedResume"
              value={resume._id}
              checked={isSelected}
              onChange={() => onSelectedResumeChange(resume._id)}
              className="mt-1 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {resume.name}
                </span>
                {resume.isDefault && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    DEFAULT
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {resume.fileName}
              </p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
