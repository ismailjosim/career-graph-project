import {
  AlertCircle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Coins,
  FileSpreadsheet,
  FileText,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useTokens } from "@/context/tokens-context";
import type { AtsInputMode, AtsTargetJob, SavedResumeOption } from "./types";

interface AtsInputCardProps {
  inputMode: AtsInputMode;
  onInputModeChange: (mode: AtsInputMode) => void;
  savedResumes: SavedResumeOption[];
  loadingResumes: boolean;
  selectedResumeId: string;
  onSelectedResumeChange: (id: string) => void;
  uploadedFile: File | null;
  onFileChange: (file: File) => void;
  uploadError: string | null;
  rawText: string;
  onRawTextChange: (text: string) => void;
  showTargetJob: boolean;
  onToggleTargetJob: () => void;
  targetJob: AtsTargetJob;
  onTargetJobChange: (target: AtsTargetJob) => void;
  analyzing: boolean;
  analysisProgress: number;
  error: string | null;
  onSubmit: () => void;
}

export function AtsInputCard({
  inputMode,
  onInputModeChange,
  savedResumes,
  loadingResumes,
  selectedResumeId,
  onSelectedResumeChange,
  uploadedFile,
  onFileChange,
  uploadError,
  rawText,
  onRawTextChange,
  showTargetJob,
  onToggleTargetJob,
  targetJob,
  onTargetJobChange,
  analyzing,
  analysisProgress,
  error,
  onSubmit,
}: AtsInputCardProps) {
  const { tokens } = useTokens();
  return (
    <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          Select or Upload Resume to Audit
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose a saved resume from your account, upload a PDF/Word file, or
          paste text.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={() => onInputModeChange("saved")}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 cursor-pointer shrink-0 ${
            inputMode === "saved"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Saved Resumes ({savedResumes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => onInputModeChange("upload")}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 cursor-pointer shrink-0 ${
            inputMode === "upload"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload File (PDF / DOC)</span>
        </button>

        <button
          type="button"
          onClick={() => onInputModeChange("text")}
          className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 cursor-pointer shrink-0 ${
            inputMode === "text"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Paste Resume Text</span>
        </button>
      </div>

      {/* Mode 1: Saved Resumes */}
      {inputMode === "saved" && (
        <div className="space-y-3">
          {loadingResumes ? (
            <div className="py-6 text-center text-xs text-slate-500">
              Loading your saved resumes...
            </div>
          ) : savedResumes.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <p className="text-xs text-slate-500">
                You don&apos;t have any saved resumes yet.
              </p>
              <button
                type="button"
                onClick={() => onInputModeChange("upload")}
                className="btn-primary py-1.5 px-3 text-xs"
              >
                Upload a Resume File
              </button>
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* Mode 2: File Upload */}
      {inputMode === "upload" && (
        <div className="space-y-3">
          <label
            htmlFor="ats-file-upload-input"
            className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-900/30"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                Click to browse or drag & drop your resume
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Supports PDF, DOC, DOCX up to 10MB
              </p>
            </div>
            <input
              id="ats-file-upload-input"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFileChange(f);
              }}
            />
          </label>

          {uploadedFile && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-900 dark:text-emerald-200 truncate">
                  {uploadedFile.name}
                </span>
                <span className="text-slate-400 text-[10px]">
                  ({(uploadedFile.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <span className="text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase">
                Ready
              </span>
            </div>
          )}

          {uploadError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {uploadError}
            </p>
          )}
        </div>
      )}

      {/* Mode 3: Raw Text */}
      {inputMode === "text" && (
        <div className="space-y-2">
          <textarea
            rows={8}
            placeholder="Paste your resume content here (Work experience, education, skills, projects)..."
            value={rawText}
            onChange={(e) => onRawTextChange(e.target.value)}
            className="input text-xs sm:text-sm resize-none font-mono"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Minimum 50 characters required</span>
            <span>{rawText.length} characters</span>
          </div>
        </div>
      )}

      {/* Optional Target Job Accordion */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onToggleTargetJob}
          className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <span>
              Target Job Comparison (Optional) &mdash; Tailor ATS Score to
              Specific Role
            </span>
          </span>
          {showTargetJob ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showTargetJob && (
          <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in">
            <div>
              <label
                htmlFor="target-job-title-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
              >
                Target Job Title
              </label>
              <input
                id="target-job-title-input"
                type="text"
                placeholder="e.g. Senior Frontend Engineer or Product Manager"
                value={targetJob.title}
                onChange={(e) =>
                  onTargetJobChange({ ...targetJob, title: e.target.value })
                }
                className="input text-xs"
              />
            </div>
            <div>
              <label
                htmlFor="target-job-desc-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
              >
                Target Job Description
              </label>
              <textarea
                id="target-job-desc-input"
                rows={3}
                placeholder="Paste the job posting description to check exact keyword matches and role requirements..."
                value={targetJob.description}
                onChange={(e) =>
                  onTargetJobChange({
                    ...targetJob,
                    description: e.target.value,
                  })
                }
                className="input text-xs resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Token Notice / Insufficient Warning */}
      {tokens < 10 ? (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Insufficient Token Balance</span>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                You have <strong>{tokens} tokens</strong>, but an ATS audit
                requires <strong>10 tokens</strong>.
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            <span>Top Up Tokens</span>
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Audit cost:{" "}
              <strong className="text-slate-700 dark:text-slate-300">
                10 tokens
              </strong>
            </span>
          </span>
          <span className="font-medium">
            Your balance:{" "}
            <strong className="text-slate-700 dark:text-slate-300">
              {tokens} tokens
            </strong>
          </span>
        </div>
      )}

      {/* Submit Action */}
      <div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={analyzing || tokens < 10}
          className="btn-primary w-full py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>
                Auditing Resume with ATS Engine ({analysisProgress}%)...
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Professional ATS Audit</span>
            </>
          )}
        </button>

        {analyzing && (
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
