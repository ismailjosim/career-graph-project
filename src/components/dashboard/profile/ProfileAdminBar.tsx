"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";
import type { UserRole, UserStatus } from "@/lib/validation";
import type { ProfileUser } from "./types";

interface ProfileAdminBarProps {
  user: ProfileUser;
  currentOperatorRole: UserRole;
  isViewingOtherUser: boolean;
  onAdminStatusChange: (status: UserStatus) => void;
  onAdminVerifyToggle: () => void;
}

export function ProfileAdminBar({
  user,
  currentOperatorRole,
  isViewingOtherUser,
  onAdminStatusChange,
  onAdminVerifyToggle,
}: ProfileAdminBarProps) {
  const canEditTargetStatus =
    isViewingOtherUser &&
    (currentOperatorRole === "super_admin" ||
      (currentOperatorRole === "admin" &&
        user.role !== "super_admin" &&
        user.role !== "admin"));

  const canToggleTargetVerification =
    isViewingOtherUser &&
    (currentOperatorRole === "admin" || currentOperatorRole === "super_admin");

  if (!canEditTargetStatus && !canToggleTargetVerification) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap">
      {canEditTargetStatus && (
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Status:
          </span>
          <select
            value={user.status}
            onChange={(e) => onAdminStatusChange(e.target.value as UserStatus)}
            className={`text-xs font-semibold py-1 px-2.5 rounded-lg border cursor-pointer ${
              user.status === "active"
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : user.status === "blocked"
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      )}

      {canToggleTargetVerification && (
        <button
          type="button"
          onClick={onAdminVerifyToggle}
          className={`text-xs font-semibold py-1 px-3 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
            user.emailVerified
              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : "bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
          }`}
        >
          {user.emailVerified ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Verified Account (Click to Revoke)</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Unverified (Click to Verify)</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
