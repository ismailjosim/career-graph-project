import {
  CheckCircle2,
  FileText,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { DEFAULT_PLAN_CONFIG } from "@/lib/plan-limits.types";

export function AdminPlanLimitsCard() {
  return (
    <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              User Plan & Storage Quota Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active system quotas enforced on candidate accounts
            </p>
          </div>
        </div>

        <Link
          href="/pricing"
          className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Manage Token Packages</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Free Plan */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {DEFAULT_PLAN_CONFIG.free.name}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {DEFAULT_PLAN_CONFIG.free.badge}
            </span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Max Resumes:{" "}
                <strong>{DEFAULT_PLAN_CONFIG.free.maxResumes}</strong>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Max Cover Letters:{" "}
                <strong>{DEFAULT_PLAN_CONFIG.free.maxCoverLetters}</strong>
              </span>
            </li>
            <li className="flex items-center gap-2 text-[11px] text-slate-400">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Enforced on /api/resumes & /api/cover-letters</span>
            </li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
              {DEFAULT_PLAN_CONFIG.pro.name}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
              {DEFAULT_PLAN_CONFIG.pro.badge}
            </span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Max Resumes:{" "}
                <strong>{DEFAULT_PLAN_CONFIG.pro.maxResumes}</strong>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Max Cover Letters:{" "}
                <strong>{DEFAULT_PLAN_CONFIG.pro.maxCoverLetters}</strong>
              </span>
            </li>
            <li className="flex items-center gap-2 text-[11px] text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Unlocked with any package purchase</span>
            </li>
          </ul>
        </div>

        {/* Admin Tier */}
        <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800/80 bg-purple-50/30 dark:bg-purple-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-950 dark:text-purple-200">
              {DEFAULT_PLAN_CONFIG.admin.name}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
              {DEFAULT_PLAN_CONFIG.admin.badge}
            </span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>
                Max Resumes:{" "}
                <strong>
                  Unlimited ({DEFAULT_PLAN_CONFIG.admin.maxResumes})
                </strong>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>
                Max Cover Letters:{" "}
                <strong>
                  Unlimited ({DEFAULT_PLAN_CONFIG.admin.maxCoverLetters})
                </strong>
              </span>
            </li>
            <li className="flex items-center gap-2 text-[11px] text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>Full platform administrative override</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
