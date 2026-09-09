import { BookOpen, Download, Plus } from "lucide-react";
import Link from "next/link";
import type { ProfileResume } from "./types";

interface ProfileResumesCardProps {
  resumes: ProfileResume[];
  isViewingOtherUser: boolean;
}

export function ProfileResumesCard({
  resumes,
  isViewingOtherUser,
}: ProfileResumesCardProps) {
  return (
    <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Uploaded Resumes ({resumes.length})
          </h3>
        </div>

        {!isViewingOtherUser && (
          <Link
            href="/resumes"
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Resumes</span>
          </Link>
        )}
      </div>

      {resumes.length === 0 ? (
        <div className="p-6 text-center border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            No resumes uploaded yet
          </p>
          {!isViewingOtherUser && (
            <Link
              href="/resumes"
              className="btn-primary py-1.5 px-3 text-xs inline-block"
            >
              Upload Resume
            </Link>
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {resumes.map((r) => (
            <div
              key={r.id}
              className="py-3 flex items-center justify-between gap-3 text-xs"
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
                <p className="text-slate-400 text-[11px] truncate">
                  {r.fileName} • Uploaded{" "}
                  {r.uploadedAt
                    ? new Date(r.uploadedAt).toLocaleDateString()
                    : "Recently"}
                </p>
              </div>

              <a
                href={r.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-outline py-1.5 px-3 text-xs inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download / View</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
