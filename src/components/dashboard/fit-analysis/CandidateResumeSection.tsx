import { FileText, UploadCloud } from "lucide-react";
import { ResumeUploadArea } from "./ResumeUploadArea";
import { SavedResumesList } from "./SavedResumesList";
import type { CandidateResumeSectionProps } from "./types";

export function CandidateResumeSection({
  resumeMode,
  onResumeModeChange,
  resumes,
  loadingResumes,
  selectedResumeId,
  onSelectResumeId,
  uploadedFile,
  onFileSelect,
  onFileRemove,
  saveToAccount,
  onSaveToAccountChange,
  customResumeName,
  onCustomResumeNameChange,
  resumeText,
  onResumeTextChange,
}: CandidateResumeSectionProps) {
  return (
    <div className="card p-4 sm:p-6 md:p-7 border border-slate-200 dark:border-slate-800/80 shadow-sm relative overflow-hidden space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              2. Candidate Resume
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Saved resume, PDF upload, or paste
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium self-start sm:self-auto overflow-x-auto max-w-full shrink-0">
          <button
            type="button"
            onClick={() => onResumeModeChange("saved")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              resumeMode === "saved"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Saved ({resumes.length})
          </button>
          <button
            type="button"
            onClick={() => onResumeModeChange("upload")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
              resumeMode === "upload"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload PDF</span>
          </button>
          <button
            type="button"
            onClick={() => onResumeModeChange("text")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              resumeMode === "text"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Paste
          </button>
        </div>
      </div>

      {/* Mode 1: Saved Resumes */}
      {resumeMode === "saved" && (
        <SavedResumesList
          resumes={resumes}
          loading={loadingResumes}
          selectedId={selectedResumeId}
          onSelect={onSelectResumeId}
          onSwitchToUpload={() => onResumeModeChange("upload")}
        />
      )}

      {/* Mode 2: Upload File */}
      {resumeMode === "upload" && (
        <ResumeUploadArea
          uploadedFile={uploadedFile}
          onFileSelect={onFileSelect}
          onFileRemove={onFileRemove}
          saveToAccount={saveToAccount}
          onSaveToAccountChange={onSaveToAccountChange}
          customResumeName={customResumeName}
          onCustomResumeNameChange={onCustomResumeNameChange}
        />
      )}

      {/* Mode 3: Raw Text */}
      {resumeMode === "text" && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Paste Resume Content
          </label>
          <textarea
            rows={8}
            placeholder="Paste your resume text (summary, skills, work experience, education)..."
            value={resumeText}
            onChange={(e) => onResumeTextChange(e.target.value)}
            className="input text-sm resize-y leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}
