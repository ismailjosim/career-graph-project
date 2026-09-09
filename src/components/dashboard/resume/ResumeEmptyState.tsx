import { FileText, FilterX, Plus } from "lucide-react";
import type { ResumeEmptyStateProps } from "./types";

export function ResumeEmptyState({
  hasSearch,
  onResetSearch,
  onAddResume,
}: ResumeEmptyStateProps) {
  if (hasSearch) {
    return (
      <div className="card p-12 text-center space-y-3">
        <FilterX className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
          No matching resumes
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          We couldn't find any resumes matching your search query.
        </p>
        {onResetSearch && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onResetSearch}
              className="btn-secondary text-sm py-2 px-4 cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card p-12 text-center space-y-3">
      <FileText className="w-12 h-12 text-blue-300 dark:text-blue-900/60 mx-auto" />
      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
        No resumes added yet
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        Add different versions of your resume tailored for specific roles.
      </p>
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={onAddResume}
          className="btn-primary text-sm py-2 px-4 shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add First Resume</span>
        </button>
      </div>
    </div>
  );
}
