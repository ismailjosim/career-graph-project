"use client";

import { Coins, ExternalLink, Pencil, User as UserIcon, X } from "lucide-react";
import Link from "next/link";
import type { ViewUserModalProps } from "./types";
import {
  UserContactSection,
  UserHeroSection,
  UserMetaSection,
} from "./view-modal";

export function ViewUserModal({
  isOpen,
  onClose,
  user,
  currentUserRole,
  onEditUser,
  onChangeStatus,
  onToggleVerify,
  onAdjustTokens,
}: ViewUserModalProps) {
  if (!isOpen || !user) return null;

  const canEdit =
    currentUserRole === "super_admin" ||
    (currentUserRole === "admin" &&
      user.role !== "super_admin" &&
      user.role !== "admin");

  const canChangeStatus =
    user.role !== "super_admin" &&
    (currentUserRole === "super_admin" ||
      (currentUserRole === "admin" && user.role !== "admin"));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="card w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                User Details & Profile
              </h2>
              <p className="text-xs text-slate-500">
                Account information, status, and permissions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* User Hero Banner */}
          <UserHeroSection
            user={user}
            currentUserRole={currentUserRole}
            canChangeStatus={canChangeStatus}
            onChangeStatus={onChangeStatus}
            onToggleVerify={onToggleVerify}
          />

          {/* Profile Bio, Skills & Contact */}
          <UserContactSection user={user} />

          {/* Account Metadata Grid */}
          <UserMetaSection user={user} onAdjustTokens={onAdjustTokens} />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile?userId=${user.id}`}
              onClick={onClose}
              className="btn-outline py-2 px-3 text-xs inline-flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Profile & Resumes</span>
            </Link>

            {onAdjustTokens && (
              <button
                type="button"
                onClick={() => onAdjustTokens(user)}
                className="btn-outline py-2 px-3 text-xs inline-flex items-center gap-1.5 cursor-pointer text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Tokens</span>
              </button>
            )}

            {canEdit && onEditUser && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditUser(user);
                }}
                className="btn-outline py-2 px-3 text-xs inline-flex items-center gap-1.5 cursor-pointer text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-primary py-2 px-4 text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
