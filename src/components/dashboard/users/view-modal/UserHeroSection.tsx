"use client";

import {
  AlertTriangle,
  Ban,
  Briefcase,
  Building2,
  CheckCircle2,
  Crown,
  Mail,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import type { UserStatus } from "@/lib/validation";
import type { ManagedUser } from "../types";

interface UserHeroSectionProps {
  user: ManagedUser;
  currentUserRole?: string;
  canChangeStatus: boolean;
  onChangeStatus?: (user: ManagedUser, newStatus: UserStatus) => void;
  onToggleVerify?: (user: ManagedUser) => void;
}

export function UserHeroSection({
  user,
  canChangeStatus,
  onChangeStatus,
  onToggleVerify,
}: UserHeroSectionProps) {
  const getRoleDetails = (role: string) => {
    switch (role) {
      case "super_admin":
        return {
          title: "System Super Admin",
          icon: Crown,
          style:
            "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800/70",
        };
      case "admin":
        return {
          title: "Platform Admin",
          icon: ShieldCheck,
          style:
            "bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800/70",
        };
      case "recruiter":
        return {
          title: "Recruiter",
          icon: UserCheck,
          style:
            "bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800/70",
        };
      case "employer":
        return {
          title: "Employer / Company",
          icon: Building2,
          style:
            "bg-teal-100 text-teal-900 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300 dark:border-teal-800/70",
        };
      default:
        return {
          title: "Job Seeker (User)",
          icon: Briefcase,
          style:
            "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700",
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "blocked":
        return {
          label: "Blocked",
          icon: Ban,
          style:
            "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800/60",
        };
      case "inactive":
        return {
          label: "Inactive",
          icon: AlertTriangle,
          style:
            "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800/60",
        };
      default:
        return {
          label: "Active",
          icon: CheckCircle2,
          style:
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60",
        };
    }
  };

  const roleMeta = getRoleDetails(user.role);
  const RoleIcon = roleMeta.icon;
  const statusMeta = getStatusBadge(user.status || "active");
  const StatusIcon = statusMeta.icon;

  const getInitials = (name: string, email: string) => {
    if (name?.trim()) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
      <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-indigo-600 to-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
        {getInitials(user.name, user.email)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 truncate">
            {user.name}
          </h3>
          {/* Account Status Badge / Changer */}
          {canChangeStatus && onChangeStatus ? (
            <select
              value={user.status || "active"}
              onChange={(e) =>
                onChangeStatus(user, e.target.value as UserStatus)
              }
              className={`text-xs font-bold px-2 py-0.5 rounded-lg border cursor-pointer ${statusMeta.style}`}
              title="Change account status"
            >
              <option value="active">🟢 Active</option>
              <option value="inactive">🟡 Inactive</option>
              <option value="blocked">🔴 Blocked</option>
            </select>
          ) : (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${statusMeta.style}`}
            >
              <StatusIcon className="w-3 h-3" />
              <span>{statusMeta.label}</span>
            </span>
          )}
        </div>

        {user.headline && (
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {user.headline}
          </p>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          <span>{user.email}</span>
        </p>

        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${roleMeta.style}`}
          >
            <RoleIcon className="w-3.5 h-3.5" />
            <span>{roleMeta.title}</span>
          </span>

          {onToggleVerify ? (
            <button
              type="button"
              onClick={() => onToggleVerify(user)}
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border transition cursor-pointer ${
                user.emailVerified
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100"
                  : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }`}
              title="Click to toggle email verification"
            >
              {user.emailVerified ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Email</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3 h-3" />
                  <span>Unverified (Click to Verify)</span>
                </>
              )}
            </button>
          ) : user.emailVerified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Email</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
              Unverified Email
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
