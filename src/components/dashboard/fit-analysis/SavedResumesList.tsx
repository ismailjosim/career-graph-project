import { Check, FileText, Loader2, UploadCloud } from "lucide-react";
import type { SavedResumesListProps } from "./types";

export function SavedResumesList({
  resumes,
  loading,
  selectedId,
  onSelect,
  onSwitchToUpload,
}: SavedResumesListProps) {
  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center gap-2 text-slate-500 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading your saved resumes...</span>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
        <FileText className="w-10 h-10 text-slate-400 mx-auto" />
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No saved resumes found in your profile.
        </p>
        <button
          type="button"
          onClick={onSwitchToUpload}
          className="btn-primary text-xs mx-auto flex items-center gap-1.5 cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload a PDF Resume</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-75 overflow-y-auto pr-1">
      {resumes.map((r) => {
        const isSelected = selectedId === r._id;
        return (
          <div
            key={r._id}
            onClick={() => onSelect(r._id)}
            className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
              isSelected
                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {r.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {r.fileName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {r.isDefault && (
                <span className="badge-primary text-[10px] py-0.5 px-2">
                  Default
                </span>
              )}
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
