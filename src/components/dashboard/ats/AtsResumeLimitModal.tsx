"use client";

import { AlertTriangle, ExternalLink, X } from "lucide-react";
import Link from "next/link";

interface AtsResumeLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueWithoutSaving: () => void;
  planName?: string;
  currentCount?: number;
  maxAllowed?: number;
}

export function AtsResumeLimitModal({
  isOpen,
  onClose,
  onContinueWithoutSaving,
  planName = "Free Plan",
  currentCount = 1,
  maxAllowed = 1,
}: AtsResumeLimitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="card max-w-md w-full p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Resume Storage Limit Reached
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              {currentCount} / {maxAllowed} resumes stored ({planName})
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          You have reached the maximum allowed resumes for the{" "}
          <strong>{planName}</strong>. You can still run the ATS audit right now
          without saving this resume, or manage your stored resumes to free up
          space.
        </p>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
          Tip: You can delete unused resumes at any time in the{" "}
          <Link
            href="/resumes"
            target="_blank"
            className="text-blue-600 dark:text-blue-400 font-semibold underline inline-flex items-center gap-0.5"
          >
            My Resumes
            <ExternalLink className="w-3 h-3" />
          </Link>{" "}
          manager.
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onContinueWithoutSaving}
            className="btn-primary w-full py-2.5 text-xs font-semibold"
          >
            Continue Audit Without Saving
          </button>
          <Link
            href="/resumes"
            className="btn-outline w-full py-2.5 text-xs font-semibold text-center"
          >
            Manage Resumes
          </Link>
        </div>
      </div>
    </div>
  );
}
