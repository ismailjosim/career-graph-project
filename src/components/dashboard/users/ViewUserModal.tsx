"use client";

import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  Mail,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import type { ViewUserModalProps } from "./types";

export function ViewUserModal({
  isOpen,
  onClose,
  user,
  currentUserRole,
  onEditUser,
}: ViewUserModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const copyUserId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleDetails = (role: string) => {
    switch (role) {
      case "super_admin":
        return {
          title: "System Super Admin",
          icon: Crown,
          style:
            "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800/70",
          iconBg: "bg-amber-500 text-white",
          description:
            "Highest authority with complete administrative ownership. There is only ONE Super Admin in the entire platform. Can manage all accounts and assign admin privileges.",
        };
      case "admin":
        return {
          title: "Platform Admin",
          icon: ShieldCheck,
          style:
            "bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800/70",
          iconBg: "bg-indigo-600 text-white",
          description:
            "Platform administrator with operational oversight. Can manage standard user accounts, review applications, and supervise platform activity.",
        };
      case "recruiter":
        return {
          title: "Recruiter",
          icon: UserCheck,
          style:
            "bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800/70",
          iconBg: "bg-purple-600 text-white",
          description:
            "Talent acquisition professional searching for qualified candidates, managing candidate pipelines, and sourcing talent for job openings.",
        };
      case "employer":
        return {
          title: "Employer / Company",
          icon: Building2,
          style:
            "bg-teal-100 text-teal-900 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300 dark:border-teal-800/70",
          iconBg: "bg-teal-600 text-white",
          description:
            "Company representative publishing job opportunities, reviewing applicant resumes and cover letters, and scheduling interviews.",
        };
      default:
        return {
          title: "Job Seeker (User)",
          icon: Briefcase,
          style:
            "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700",
          iconBg: "bg-slate-700 text-white",
          description:
            "Candidate organizing their career progression, tracking submitted job applications, curating job listings, tailoring resumes, and analyzing ATS job fit.",
        };
    }
  };

  const roleMeta = getRoleDetails(user.role);
  const RoleIcon = roleMeta.icon;

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

  const canEdit =
    currentUserRole === "super_admin" ||
    (currentUserRole === "admin" &&
      user.role !== "super_admin" &&
      user.role !== "admin");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="card w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                User Details
              </h2>
              <p className="text-xs text-slate-500">
                Account profile and assigned permissions
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
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-indigo-600 to-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
              {getInitials(user.name, user.email)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 truncate">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${roleMeta.style}`}
                >
                  <RoleIcon className="w-3.5 h-3.5" />
                  <span>{roleMeta.title}</span>
                </span>
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    Unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Role Description Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${roleMeta.iconBg} shadow-2xs`}>
                <RoleIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Role Permissions & Capabilities
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
              {roleMeta.description}
            </p>
          </div>

          {/* Account Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* User ID */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  User ID
                </span>
                <button
                  type="button"
                  onClick={copyUserId}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate select-all">
                {user.id}
              </p>
            </div>

            {/* Verification Status */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Email Status
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                {user.emailVerified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Verified Address</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pending Verification</span>
                  </>
                )}
              </p>
            </div>

            {/* Created At */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Joined Date
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Unknown"}
                </span>
              </p>
            </div>

            {/* Updated At */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Last Profile Update
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not yet updated"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            {canEdit && onEditUser && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditUser(user);
                }}
                className="btn-outline py-2 px-3.5 text-xs inline-flex items-center gap-1.5 cursor-pointer text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit User & Role</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary py-2 px-5 text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
