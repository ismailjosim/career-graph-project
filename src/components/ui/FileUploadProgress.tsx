"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  type UploadResponse,
  uploadFileWithProgress,
} from "@/lib/upload-client";

interface FileUploadProgressProps {
  type?: "avatar" | "resume" | "document";
  label?: string;
  description?: string;
  onSuccess: (result: UploadResponse) => void;
  onError?: (errorMsg: string) => void;
  className?: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileUploadProgress({
  type = "document",
  label,
  description,
  onSuccess,
  onError,
  className = "",
}: FileUploadProgressProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileSizeStr, setFileSizeStr] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = type === "avatar";
  const acceptMime = isImage
    ? "image/jpeg,image/png,image/webp,image/gif"
    : "application/pdf";
  const maxSizeBytes = isImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
  const maxSizeLabel = isImage ? "5MB" : "10MB";
  const formatLabel = isImage ? "JPEG, PNG, WEBP, or GIF" : "PDF Document";

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setSuccess(false);

      // Validate size
      if (file.size > maxSizeBytes) {
        const msg = `File size (${formatBytes(file.size)}) exceeds the maximum allowed size of ${maxSizeLabel}.`;
        setError(msg);
        onError?.(msg);
        return;
      }

      // Validate type
      if (isImage) {
        if (!file.type.startsWith("image/")) {
          const msg = "Only image files (JPEG, PNG, WEBP, GIF) are allowed.";
          setError(msg);
          onError?.(msg);
          return;
        }
      } else {
        if (
          file.type !== "application/pdf" &&
          !file.name.toLowerCase().endsWith(".pdf")
        ) {
          const msg = "Only PDF document files are allowed.";
          setError(msg);
          onError?.(msg);
          return;
        }
      }

      setFileName(file.name);
      setFileSizeStr(formatBytes(file.size));
      setUploading(true);
      setProgress(0);

      try {
        const result = await uploadFileWithProgress(file, type, (pct) => {
          setProgress(pct);
        });

        setSuccess(true);
        onSuccess(result);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error ||
          (err instanceof Error
            ? err.message
            : "Upload failed. Please check your connection and try again.");
        setError(msg);
        onError?.(msg);
      } finally {
        setUploading(false);
      }
    },
    [isImage, maxSizeBytes, maxSizeLabel, onError, onSuccess, type],
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptMime}
        onChange={onInputChange}
        className="hidden"
      />

      {/* Drag & Drop Surface */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 relative overflow-hidden ${
          isDragging
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
        } ${uploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center text-blue-600 dark:text-blue-400">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isImage ? (
            <ImageIcon className="w-6 h-6" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            {label ||
              (isImage
                ? "Click or drag photo here"
                : "Click or drag resume PDF here")}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {description || `Supports ${formatLabel} (Max: ${maxSizeLabel})`}
          </p>
        </div>
      </div>

      {/* Upload Progress Bar Box */}
      {uploading && (
        <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {fileName}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0">
                ({fileSizeStr})
              </span>
            </div>
            <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">
              {progress}%
            </span>
          </div>

          {/* Progress bar track */}
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="p-1 hover:opacity-75"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Success Confirmation */}
      {success && !uploading && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-medium">
            File uploaded securely to Cloudinary!
          </span>
        </div>
      )}
    </div>
  );
}
