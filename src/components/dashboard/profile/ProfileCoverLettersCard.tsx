import { Eye, FileText, Plus } from "lucide-react";
import Link from "next/link";
import type { ProfileCoverLetter } from "./types";

interface ProfileCoverLettersCardProps {
  coverLetters: ProfileCoverLetter[];
  isViewingOtherUser: boolean;
}

export function ProfileCoverLettersCard({
  coverLetters,
  isViewingOtherUser,
}: ProfileCoverLettersCardProps) {
  return (
    <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Total Cover Letters ({coverLetters.length})
          </h3>
        </div>

        {!isViewingOtherUser && (
          <Link
            href="/cover-letters"
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Draft New Cover Letter</span>
          </Link>
        )}
      </div>

      {coverLetters.length === 0 ? (
        <div className="p-6 text-center border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            No cover letters created yet
          </p>
          <p className="text-[11px] text-slate-400">
            Your profile information above will be used to automatically
            personalize your drafts.
          </p>
          {!isViewingOtherUser && (
            <Link
              href="/cover-letters"
              className="btn-primary py-1.5 px-3 text-xs inline-block"
            >
              Draft Cover Letter
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {coverLetters.map((cl) => (
            <div
              key={cl.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                  {cl.title}
                </h4>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {cl.updatedAt
                    ? new Date(cl.updatedAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {cl.content}
              </p>
              <div className="pt-1 flex items-center justify-end">
                <Link
                  href="/cover-letters"
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>View / Edit in Editor</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
