"use client";

import { FileText, Upload } from "lucide-react";
import { useState } from "react";

interface AtsFileUploadTabProps {
  uploadedFile: File | null;
  onFileChange: (file: File) => void;
  uploadError: string | null;
}

export function AtsFileUploadTab({
  uploadedFile,
  onFileChange,
  uploadError,
}: AtsFileUploadTabProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-3">
      <label
        htmlFor="ats-file-upload-input"
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          const files = e.dataTransfer.files;
          if (files && files.length > 0) {
            onFileChange(files[0]);
          }
        }}
        className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition ${
          isDragging
            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 ring-4 ring-indigo-500/20 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/30"
        }`}
      >
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform ${
            isDragging
              ? "bg-indigo-600 text-white scale-110"
              : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
          }`}
        >
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
            {isDragging
              ? "Drop your resume file here"
              : "Click to browse or drag & drop your resume"}
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
  );
}
