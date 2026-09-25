"use client";

import {
  AlertCircle,
  Coins,
  FileSpreadsheet,
  FileText,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useTokens } from "@/context/tokens-context";
import { AtsFileUploadTab } from "./AtsFileUploadTab";
import { AtsSavedResumesTab } from "./AtsSavedResumesTab";
import { AtsTargetJobComparison } from "./AtsTargetJobComparison";
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
  saveToAccount: boolean;
  onSaveToAccountChange: (save: boolean) => void;
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
  saveToAccount,
  onSaveToAccountChange,
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
        <AtsSavedResumesTab
          loadingResumes={loadingResumes}
          savedResumes={savedResumes}
          selectedResumeId={selectedResumeId}
          onSelectedResumeChange={onSelectedResumeChange}
          onSwitchToUpload={() => onInputModeChange("upload")}
        />
      )}

      {/* Mode 2: File Upload */}
      {inputMode === "upload" && (
        <AtsFileUploadTab
          uploadedFile={uploadedFile}
          onFileChange={onFileChange}
          uploadError={uploadError}
          saveToAccount={saveToAccount}
          onSaveToAccountChange={onSaveToAccountChange}
        />
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
      <AtsTargetJobComparison
        showTargetJob={showTargetJob}
        onToggleTargetJob={onToggleTargetJob}
        targetJob={targetJob}
        onTargetJobChange={onTargetJobChange}
      />

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
