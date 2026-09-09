import { FileCheck, UploadCloud, X } from "lucide-react";
import { useRef } from "react";
import type { ResumeUploadAreaProps } from "./types";

export function ResumeUploadArea({
  uploadedFile,
  onFileSelect,
  onFileRemove,
  saveToAccount,
  onSaveToAccountChange,
  customResumeName,
  onCustomResumeNameChange,
}: ResumeUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file) return;
    onFileSelect(file);
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.docx"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFileChange(f);
        }}
        className="hidden"
      />

      {!uploadedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFileChange(f);
          }}
          className="p-10 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition cursor-pointer text-center group bg-slate-50/50 dark:bg-slate-900/50"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Click to upload or drag & drop PDF
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            PDF, TXT, or DOCX (up to 10MB)
          </p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-3">
            Gemini 2.5 will analyze document structure, dates & bullets
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-600 text-white">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(uploadedFile.size / 1024).toFixed(1)} KB &bull;{" "}
                  {uploadedFile.mimeType}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onFileRemove}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-500 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/30 space-y-2">
            <div className="flex items-center gap-2">
              <input
                id="saveToAccountCheckbox"
                type="checkbox"
                checked={saveToAccount}
                onChange={(e) => onSaveToAccountChange(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label
                htmlFor="saveToAccountCheckbox"
                className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Save this resume to my profile for future applications
              </label>
            </div>
            {saveToAccount && (
              <input
                type="text"
                placeholder="Resume Label (e.g. Senior Full Stack 2026)"
                value={customResumeName}
                onChange={(e) => onCustomResumeNameChange(e.target.value)}
                className="input text-xs py-1.5"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
