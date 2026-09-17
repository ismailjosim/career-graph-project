"use client";

import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { DocumentPreviewModal } from "@/components/ui/DocumentPreviewModal";
import { FileUploadProgress } from "@/components/ui/FileUploadProgress";
import type { UploadResponse } from "@/lib/upload-client";
import type { ProfileResume } from "./types";

interface ProfileResumesCardProps {
  resumes: ProfileResume[];
  isViewingOtherUser: boolean;
  onResumesUpdated?: () => void;
}

export function ProfileResumesCard({
  resumes,
  isViewingOtherUser,
  onResumesUpdated,
}: ProfileResumesCardProps) {
  const [showUploader, setShowUploader] = useState(false);
  const [savingResume, setSavingResume] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Preview modal state
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    url: string;
    fileName: string;
  } | null>(null);

  const handleUploadSuccess = async (result: UploadResponse) => {
    setSavingResume(true);
    try {
      // Generate clean default name from file
      const rawName = result.fileName.replace(/\.[^/.]+$/, "");
      const formattedName =
        rawName.charAt(0).toUpperCase() +
        rawName.slice(1).replace(/[-_]/g, " ");

      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formattedName,
          fileName: result.fileName,
          fileUrl: result.url,
          cloudinaryPublicId: result.publicId,
          fileSize: result.fileSize,
          isDefault: resumes.length === 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save resume record");
      }

      toast.success("Resume uploaded and saved to your profile!");
      setShowUploader(false);
      onResumesUpdated?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to record resume",
      );
    } finally {
      setSavingResume(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete resume");
      }

      toast.success("Resume deleted successfully");
      onResumesUpdated?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete resume",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Uploaded Resumes ({resumes.length})
          </h3>
        </div>

        {!isViewingOtherUser && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUploader((prev) => !prev)}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              {showUploader ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Close Uploader</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload PDF</span>
                </>
              )}
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/resumes"
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Manage
            </Link>
          </div>
        )}
      </div>

      {/* Inline Upload Dropzone */}
      {showUploader && !isViewingOtherUser && (
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Upload New Resume Document
            </span>
            {savingResume && (
              <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving to account...
              </span>
            )}
          </div>
          <FileUploadProgress
            type="resume"
            label="Drop your resume PDF here or click to browse"
            description="Supports PDF up to 10MB • Stored securely on Cloudinary"
            onSuccess={handleUploadSuccess}
          />
        </div>
      )}

      {/* Resumes List or Empty State */}
      {resumes.length === 0 && !showUploader ? (
        <div className="p-8 text-center border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No resumes uploaded yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm mx-auto">
              Upload your resume in PDF format to easily apply to jobs and run
              AI fit analysis.
            </p>
          </div>
          {!isViewingOtherUser && (
            <button
              type="button"
              onClick={() => setShowUploader(true)}
              className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Your First Resume</span>
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {resumes.map((r) => (
            <div
              key={r.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                    {r.name}
                  </span>
                  {r.isDefault && (
                    <span className="px-2 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-[11px] truncate mt-0.5">
                  {r.fileName} • Uploaded{" "}
                  {r.uploadedAt
                    ? new Date(r.uploadedAt).toLocaleDateString()
                    : "Recently"}
                </p>
              </div>

              {/* Action Buttons: View, Download, Delete */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                {/* View Modal Trigger */}
                <button
                  type="button"
                  onClick={() =>
                    setPreviewDoc({
                      title: r.name,
                      url: r.fileUrl,
                      fileName: r.fileName,
                    })
                  }
                  className="btn-outline py-1.5 px-2.5 text-xs inline-flex items-center gap-1 cursor-pointer"
                  title="View Resume in App"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>View</span>
                </button>

                {/* Direct Download Trigger */}
                <a
                  href={r.fileUrl}
                  download={r.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline py-1.5 px-2.5 text-xs inline-flex items-center gap-1 cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Download</span>
                </a>

                {/* Delete Button */}
                {!isViewingOtherUser && (
                  <button
                    type="button"
                    disabled={deletingId === r.id}
                    onClick={() => handleDelete(r.id, r.name)}
                    className="p-1.5 rounded-lg border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete Resume"
                  >
                    {deletingId === r.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.title}
          fileUrl={previewDoc.url}
          fileName={previewDoc.fileName}
        />
      )}
    </div>
  );
}
