"use client";

import { AlertTriangle, Check, RefreshCw, Sparkles, X } from "lucide-react";
import type { AdminTemplateItem } from "./types";

interface AdminStatusConfirmModalProps {
  target: {
    template: AdminTemplateItem;
    nextActive: boolean;
  } | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export function AdminStatusConfirmModal({
  target,
  onClose,
  onConfirm,
  loading,
}: AdminStatusConfirmModalProps) {
  if (!target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        {/* Header with icon */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              target.nextActive
                ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
            }`}
          >
            {target.nextActive ? (
              <Sparkles className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Confirm Status Change
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Permission confirmation required before modifying template
              availability.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Information Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              Template Name:
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-50">
              {target.template.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              Current Status:
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                target.template.isActive
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {target.template.isActive ? "Published" : "Draft"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              New Status:
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                target.nextActive
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-300 dark:border-amber-700"
              }`}
            >
              {target.nextActive ? "Published & Active" : "Draft / Hidden"}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 leading-relaxed">
            {target.nextActive ? (
              <p>
                Publishing will make this template immediately accessible to
                candidates building resumes.
              </p>
            ) : (
              <p>
                Drafting will hide this template from the catalog. Candidates
                who already created resumes with this template will not lose
                their data.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              target.nextActive
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Confirm {target.nextActive ? "Publish" : "Draft"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
