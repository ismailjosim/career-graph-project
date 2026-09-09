import {
  Briefcase,
  Building2,
  Crown,
  Shield,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import type { UsersHeaderProps } from "./types";

export function UsersHeader({
  totalCount,
  roleCounts,
  currentUserRole,
}: UsersHeaderProps) {
  return (
    <div className="space-y-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              User Management
            </h1>
            <span className="badge-primary text-xs py-0.5 px-2.5 font-bold">
              {totalCount} Total Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Admin console to manage accounts, audit access levels, and assign
            user roles across the Career Graph platform.
          </p>
        </div>

        {/* Current Operator Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs self-start sm:self-auto">
          {currentUserRole === "super_admin" ? (
            <>
              <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Your Access
                </p>
                <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                  System Super Admin
                </p>
              </div>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Your Access
                </p>
                <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                  Platform Admin
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Role Distribution Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
        <div className="p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 truncate">
              Super Admin
            </p>
            <p className="text-lg font-black text-amber-900 dark:text-amber-100">
              {roleCounts.super_admin || 1}
              <span className="text-[10px] font-normal text-amber-600/80 ml-1">
                (max 1)
              </span>
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-indigo-200/80 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0 shadow-2xs">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 truncate">
              Admins
            </p>
            <p className="text-lg font-black text-indigo-900 dark:text-indigo-100">
              {roleCounts.admin || 0}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-700 text-white shrink-0 shadow-2xs">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
              Job Seekers
            </p>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">
              {roleCounts.job_seeker || 0}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-600 text-white shrink-0 shadow-2xs">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 truncate">
              Recruiters
            </p>
            <p className="text-lg font-black text-purple-900 dark:text-purple-100">
              {roleCounts.recruiter || 0}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-teal-200/80 dark:border-teal-900/40 bg-teal-50/40 dark:bg-teal-950/20 flex items-center gap-2.5 col-span-2 sm:col-span-1">
          <div className="p-2 rounded-lg bg-teal-600 text-white shrink-0 shadow-2xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 truncate">
              Employers
            </p>
            <p className="text-lg font-black text-teal-900 dark:text-teal-100">
              {roleCounts.employer || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
