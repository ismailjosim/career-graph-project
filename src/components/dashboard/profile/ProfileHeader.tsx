"use client";

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
import { ProfileAdminBar } from "./ProfileAdminBar";
import { ProfileAvatar } from "./ProfileAvatar";
import type { ProfileUser } from "./types";

interface ProfileHeaderProps {
  user: ProfileUser;
  isViewingOtherUser: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
  currentOperatorRole: UserRole;
  onAdminStatusChange: (status: UserStatus) => void;
  onAdminVerifyToggle: () => void;
  onAvatarUpdated?: () => void;
}

export function ProfileHeader({
  user,
  isViewingOtherUser,
  isEditing,
  onToggleEdit,
  currentOperatorRole,
  onAdminStatusChange,
  onAdminVerifyToggle,
  onAvatarUpdated,
}: ProfileHeaderProps) {
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

        {/* Action Button */}
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
          <ProfileAvatar
            name={user.name}
            email={user.email}
            image={user.image}
            isViewingOtherUser={isViewingOtherUser}
            onAvatarUpdated={onAvatarUpdated}
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {user.name}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800/60 uppercase tracking-wide">
                {user.role.replace("_", " ")}
              </span>
            </div>

            {user.headline && (
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {user.headline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
                {user.emailVerified ? (
                  <span
                    title="Email Verified"
                    className="inline-flex items-center ml-0.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </span>
                ) : (
                  <span
                    title="Email Not Verified"
                    className="inline-flex items-center ml-0.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  </span>
                )}
              </div>

              {user.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{user.phone}</span>
                </div>
              )}

              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Admin Bar */}
        <ProfileAdminBar
          user={user}
          currentOperatorRole={currentOperatorRole}
          isViewingOtherUser={isViewingOtherUser}
          onAdminStatusChange={onAdminStatusChange}
          onAdminVerifyToggle={onAdminVerifyToggle}
        />
      </div>
    </div>
  );
}
