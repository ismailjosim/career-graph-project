"use client";

import {
  AlertTriangle,
  Ban,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Coins,
  Copy,
  Crown,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { UserStatus } from "@/lib/validation";
import type { ViewUserModalProps } from "./types";

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

  const canEdit =
    currentUserRole === "super_admin" ||
    (currentUserRole === "admin" &&
      user.role !== "super_admin" &&
      user.role !== "admin");

  const canChangeStatus =
    user.role !== "super_admin" &&
    (currentUserRole === "super_admin" ||
      (currentUserRole === "admin" && user.role !== "admin"));

  const userSkills = Array.isArray(user.skills)
    ? user.skills
    : typeof user.skills === "string"
      ? user.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

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

          {/* Profile Bio / Summary if available */}
          {user.bio && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Professional Bio & Summary
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}

          {/* Key Skills Tags if available */}
          {userSkills.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Key Skills (For Cover Letters)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {userSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 font-medium"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact & Location Details */}
          {(user.phone || user.location) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.phone && (
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Phone Number
                  </span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.phone}</span>
                  </p>
                </div>
              )}
              {user.location && (
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Location
                  </span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.location}</span>
                  </p>
                </div>
              )}
            </div>
          )}

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
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Unknown"}
                </span>
              </p>
            </div>

            {/* Token Balance Card */}
            <div className="p-3 rounded-xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 col-span-1 sm:col-span-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                    Token Balance
                  </span>
                  <p className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                    {user.tokens ?? 50} Tokens
                  </p>
                </div>
              </div>
              {onAdjustTokens && (
                <button
                  type="button"
                  onClick={() => onAdjustTokens(user)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Adjust Tokens
                </button>
              )}
            </div>
          </div>
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
