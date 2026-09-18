import { ArrowLeft, FileText, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ResumeHeaderProps } from "./types";

export function ResumeHeader({
  totalCount,
  filteredCount,
  onAddResume,
}: ResumeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <div>
          <h1 className="section-title flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Resumes</span>
          </h1>
          <p className="section-subtitle">
            {filteredCount} {filteredCount === 1 ? "resume" : "resumes"} managed
            {totalCount !== filteredCount &&
              ` (filtered from ${totalCount} total)`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/resumes/templates"
          className="btn-primary flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Build Resume</span>
        </Link>

        <button
          type="button"
          onClick={onAddResume}
          className="btn-secondary flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Upload PDF</span>
        </button>
      </div>
    </div>
  );
}
