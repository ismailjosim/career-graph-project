"use client";

import {
  Download,
  Eye,
  File,
  FileEdit,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { DocumentPreviewModal } from "@/components/ui/DocumentPreviewModal";
import { confirmAction } from "@/lib/alerts";
import { formatResumeDate } from "./resume.utils";
import type { ResumeCardProps } from "./types";

export function ResumeCard({
  resume,
  onSetDefault,
  onDelete,
}: ResumeCardProps) {
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const formattedDate = formatResumeDate(resume.uploadedAt);
  const fileSizeLabel = resume.fileSize
    ? `${(resume.fileSize / (1024 * 1024)).toFixed(2)} MB`
    : null;

  const handleSetDefault = async () => {
    if (!resume._id || resume.isDefault || isSettingDefault) return;
    setIsSettingDefault(true);
    try {
      await onSetDefault(resume._id);
      toast.success(`"${resume.name}" set as default resume!`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to set default resume",
      );
    } finally {
      setIsSettingDefault(false);
    }
  };

  const handleDelete = async () => {
    if (!resume._id || isDeleting) return;
    const confirmed = await confirmAction({
      title: "Delete Resume?",
      text: `Are you sure you want to delete "${resume.name}"? This cannot be undone.`,
      isDestructive: true,
      confirmButtonText: "Delete Resume",
    });

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(resume._id);
      toast.success("Resume deleted successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete resume",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="card p-6 group hover:shadow-lg transition-all flex flex-col justify-between">
        <div>
          {/* Top: Name & Badges */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {resume.name}
                </h3>
                {resume.isDefault && (
                  <span className="badge-primary text-xs font-semibold px-2 py-0.5">
                    Default
                  </span>
                )}
                {resume.isBuiltInApp && (
                  <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Built in Studio
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                <File className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{resume.fileName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2 mb-4">
            <span>
              {resume.isBuiltInApp
                ? "Created in Builder"
                : `Uploaded ${formattedDate}`}
            </span>
            {fileSizeLabel && (
              <>
                <span>•</span>
                <span className="font-mono text-slate-400">
                  {fileSizeLabel}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {resume.isBuiltInApp ? (
              <Link
                href={`/resumes/builder?id=${resume._id}`}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer text-indigo-600 dark:text-indigo-400 font-semibold"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            )}

            {resume.isBuiltInApp ? (
              <Link
                href={`/resumes/builder?id=${resume._id}`}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                title="Open in Builder to Download PDF or Print"
              >
                <Download className="w-4 h-4" />
              </Link>
            ) : (
              <a
                href={resume.fileUrl}
                download={resume.fileName || "resume.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                title="Download Resume"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSetDefault}
              disabled={resume.isDefault || isSettingDefault}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                resume.isDefault
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-200 dark:border-amber-800/60"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500 border-transparent"
              }`}
              title={
                resume.isDefault ? "Default resume" : "Set as default resume"
              }
            >
              <Star
                className={`w-4 h-4 ${
                  resume.isDefault ? "fill-amber-500 text-amber-500" : ""
                }`}
              />
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 transition-colors cursor-pointer disabled:opacity-50"
              title="Delete resume"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* In-app Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        fileUrl={resume.fileUrl}
        fileName={resume.fileName}
        title={resume.name || resume.fileName}
      />
    </>
  );
}
