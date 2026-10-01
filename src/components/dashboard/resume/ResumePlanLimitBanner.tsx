"use client";

import { AlertCircle, FileText, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Resume } from "@/lib/validation";

export interface PlanUsageData {
  plan: "free" | "pro" | "admin";
  planName: string;
  badge: string;
  resumes: {
    count: number;
    max: number;
    isLimitReached: boolean;
  };
}

interface ResumePlanLimitBannerProps {
  planUsage: PlanUsageData | null;
  resumes: Resume[];
  deletingId: string | null;
  onDeleteExisting: (id: string, name: string) => void;
  onCloseModal: () => void;
}

export function ResumePlanLimitBanner({
  planUsage,
  resumes,
  deletingId,
  onDeleteExisting,
  onCloseModal,
}: ResumePlanLimitBannerProps) {
  const currentCount = planUsage?.resumes.count ?? resumes.length;
  const maxAllowed = planUsage?.resumes.max ?? 1;

  return (
    <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-3">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
            Storage Limit Reached ({currentCount}/{maxAllowed} Resumes)
          </h4>
          <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
            On the <strong>{planUsage?.planName ?? "Free Plan"}</strong>, you
            can store up to {maxAllowed} resume. To upload a new resume, delete
            an existing one below or upgrade your plan.
          </p>
        </div>
      </div>

      {/* Existing Resumes to Delete */}
      {resumes.length > 0 && (
        <div className="pt-2 border-t border-amber-200/80 dark:border-amber-800/60 space-y-2">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase block">
            Existing Resumes in Your Account:
          </span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {resumes.map((r) => (
              <div
                key={r._id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 text-xs gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {r.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {r.fileName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!r._id || deletingId === r._id}
                  onClick={() => {
                    if (r._id) onDeleteExisting(r._id, r.name);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold text-[11px] transition-colors flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deletingId === r._id ? "Removing..." : "Remove"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-500">
          Need to store more resumes?
        </span>
        <Link
          href="/pricing"
          onClick={onCloseModal}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Upgrade to Pro Plan</span>
        </Link>
      </div>
    </div>
  );
}
