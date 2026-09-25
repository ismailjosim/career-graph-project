"use client";

import {
  AlertCircle,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileUrl: string;
  fileName?: string;
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  title,
  fileUrl,
  fileName = "document.pdf",
}: DocumentPreviewModalProps) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"google" | "direct">("google");
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const isRemoteUrl =
    typeof fileUrl === "string" &&
    (fileUrl.startsWith("http://") || fileUrl.startsWith("https://"));

  const isDataOrBlob =
    typeof fileUrl === "string" &&
    (fileUrl.startsWith("data:") || fileUrl.startsWith("blob:"));

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setHasTimedOut(false);
      // For data/blob URLs use direct, for remote http/https use google viewer by default to avoid CSP / X-Frame-Options blocking
      setViewMode(isDataOrBlob ? "direct" : "google");

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);

      // 8-second timeout to show helpful fallback if remote viewer is slow/blocked
      const timer = setTimeout(() => {
        setHasTimedOut(true);
        setLoading(false);
      }, 7000);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose, isDataOrBlob]);

  if (!isOpen) return null;

  const iframeSrc =
    viewMode === "google" && isRemoteUrl
      ? `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
      : `${fileUrl}#toolbar=1&navpanes=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[88vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">{fileName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isRemoteUrl && (
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setHasTimedOut(false);
                  setViewMode((prev) =>
                    prev === "google" ? "direct" : "google",
                  );
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Switch Preview Rendering Mode"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  {viewMode === "google" ? "Direct Mode" : "Google Viewer"}
                </span>
              </button>
            )}

            <a
              href={fileUrl}
              download={fileName}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              title="Download File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-xs"
              title="Open Document in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Document Viewer Frame */}
        <div className="flex-1 w-full h-full relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs text-slate-500 font-medium">
                Loading document preview securely...
              </p>
            </div>
          )}

          {hasTimedOut && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 dark:bg-slate-900/95 border border-amber-200 dark:border-amber-800/60 shadow-lg px-4 py-2.5 rounded-2xl flex items-center gap-3 text-xs max-w-md">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-slate-700 dark:text-slate-300">
                Preview taking longer than expected? You can open it directly in
                a new tab.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary py-1 px-2.5 text-xs shrink-0 whitespace-nowrap"
              >
                Open Tab
              </a>
            </div>
          )}

          <iframe
            key={iframeSrc}
            src={iframeSrc}
            title={title}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setHasTimedOut(true);
            }}
            className="w-full h-full border-0"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
