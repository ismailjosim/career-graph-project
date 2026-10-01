"use client";

import { CheckCircle2, Link2, UploadCloud } from "lucide-react";
import { FileUploadProgress } from "@/components/ui/FileUploadProgress";
import type { UploadResponse } from "@/lib/upload-client";

interface ResumeSourceSelectorProps {
  uploadMode: "file" | "url";
  onModeChange: (mode: "file" | "url") => void;
  fileUrl: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFile: UploadResponse | null;
  onUploadSuccess: (res: UploadResponse) => void;
  onError: (err: string) => void;
}

export function ResumeSourceSelector({
  uploadMode,
  onModeChange,
  fileUrl,
  onUrlChange,
  uploadedFile,
  onUploadSuccess,
  onError,
}: ResumeSourceSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => onModeChange("file")}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            uploadMode === "file"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload PDF File</span>
        </button>
        <button
          type="button"
          onClick={() => onModeChange("url")}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            uploadMode === "url"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>External URL</span>
        </button>
      </div>

      {/* Cloudinary File Upload Dropzone */}
      {uploadMode === "file" && (
        <div className="space-y-3">
          <FileUploadProgress
            type="resume"
            label="Select or Drag & Drop PDF Resume"
            description="Secure upload to Cloudinary (PDF up to 10MB)"
            onSuccess={onUploadSuccess}
            onError={onError}
          />

          {uploadedFile && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-emerald-900 dark:text-emerald-200 truncate">
                    {uploadedFile.fileName}
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    {(uploadedFile.fileSize / (1024 * 1024)).toFixed(2)} MB
                    &bull; Uploaded to Cloudinary
                  </p>
                </div>
              </div>
              <span className="text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase">
                Ready
              </span>
            </div>
          )}
        </div>
      )}

      {/* External URL Mode */}
      {uploadMode === "url" && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Resume Public URL (PDF) *
          </label>
          <input
            type="url"
            name="fileUrl"
            placeholder="https://example.com/my-resume.pdf"
            value={fileUrl}
            onChange={onUrlChange}
            className="input text-sm"
            required={uploadMode === "url"}
          />
        </div>
      )}
    </div>
  );
}
