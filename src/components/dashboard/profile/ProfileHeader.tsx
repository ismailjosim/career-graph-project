import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldAlert,
  X,
} from "lucide-react";
import Link from "next/link";
import type { UserRole, UserStatus } from "@/lib/validation";
import type { ProfileUser } from "./types";

interface ProfileHeaderProps {
  user: ProfileUser;
  isViewingOtherUser: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
  currentOperatorRole: UserRole;
  onAdminStatusChange: (status: UserStatus) => void;
  onAdminVerifyToggle: () => void;
}

export function ProfileHeader({
  user,
  isViewingOtherUser,
  isEditing,
  onToggleEdit,
  currentOperatorRole,
  onAdminStatusChange,
  onAdminVerifyToggle,
}: ProfileHeaderProps) {
  const getInitials = (nameStr: string, emailStr: string) => {
    if (nameStr?.trim()) {
      const parts = nameStr.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return nameStr.slice(0, 2).toUpperCase();
    }
    return emailStr.slice(0, 2).toUpperCase();
  };

  const canEditTargetStatus =
    isViewingOtherUser &&
    (currentOperatorRole === "super_admin" ||
      (currentOperatorRole === "admin" &&
        user.role !== "super_admin" &&
        user.role !== "admin"));

  const canToggleTargetVerification =
    isViewingOtherUser &&
    (currentOperatorRole === "admin" || currentOperatorRole === "super_admin");

  return (
    <div className="space-y-6">
      {/* Navigation & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isViewingOtherUser && (
              <Link
                href="/users"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 mr-1"
                title="Back to User Management"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {isViewingOtherUser
                ? "Managed User Profile"
                : "My Profile & Documents"}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {isViewingOtherUser
              ? `Review all account details, uploaded resumes, and cover letters for ${user.name}.`
              : "Keep your professional information, tailored resumes, and cover letters up to date."}
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={onToggleEdit}
              className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Profile Information</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleEdit}
              className="btn-outline py-2 px-4 text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Editing</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr from-indigo-600 to-blue-600 text-white font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-md">
            {getInitials(user.name, user.email)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {user.name}
              </h2>
              {/* Role badge */}
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800/60 uppercase tracking-wide">
                {user.role.replace("_", " ")}
              </span>
            </div>

            {user.headline && (
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {user.headline}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-0.5">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
              </span>

              {user.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.phone}</span>
                </span>
              )}

              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status & Verification Badges / Admin Controls */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              Account Status:
            </span>
            {canEditTargetStatus ? (
              <select
                value={user.status || "active"}
                onChange={(e) =>
                  onAdminStatusChange(e.target.value as UserStatus)
                }
                className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
              >
                <option value="active">🟢 Active</option>
                <option value="inactive">🟡 Inactive</option>
                <option value="blocked">🔴 Blocked</option>
              </select>
            ) : (
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  user.status === "blocked"
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200"
                    : user.status === "inactive"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200"
                }`}
              >
                {(user.status || "active").toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              Email Verification:
            </span>
            {canToggleTargetVerification ? (
              <button
                type="button"
                onClick={onAdminVerifyToggle}
                className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                  user.emailVerified
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 hover:bg-emerald-100"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 hover:bg-slate-200"
                }`}
              >
                {user.emailVerified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified (Toggle)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    <span>Unverified (Click to Verify)</span>
                  </>
                )}
              </button>
            ) : (
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-lg border inline-flex items-center gap-1 ${
                  user.emailVerified
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {user.emailVerified ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : null}
                <span>{user.emailVerified ? "Verified" : "Unverified"}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
