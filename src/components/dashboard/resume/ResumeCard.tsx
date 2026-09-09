"use client";

import { ExternalLink, File, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatResumeDate } from "./resume.utils";
import type { ResumeCardProps } from "./types";

export function ResumeCard({
  resume,
  onSetDefault,
  onDelete,
}: ResumeCardProps) {
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = formatResumeDate(resume.uploadedAt);

  const handleSetDefault = async () => {
    if (!resume._id || resume.isDefault || isSettingDefault) return;
    setIsSettingDefault(true);
    try {
      await onSetDefault(resume._id);
    } finally {
      setIsSettingDefault(false);
    }
  };

  const handleDelete = async () => {
    if (!resume._id || isDeleting) return;
    if (confirm("Are you sure you want to delete this resume?")) {
      setIsDeleting(true);
      try {
        await onDelete(resume._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
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
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5 truncate">
              <File className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{resume.fileName}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-4">
          Uploaded {formattedDate}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <a
          href={resume.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
        >
          <span>View File</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

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
  );
}
