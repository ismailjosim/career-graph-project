import {
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { AccountSecurityInfo } from "./types";

interface AccountSecurityCardProps {
  security: AccountSecurityInfo;
}

export function AccountSecurityCard({ security }: AccountSecurityCardProps) {
  return (
    <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <ShieldCheck className="w-5 h-5 text-indigo-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Account Security & Authentication
          </h2>
          <p className="text-xs text-slate-500">
            Current status of your credentials, access role, and verified email.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Email Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Mail className="w-4 h-4" />
            <span>Primary Email</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
            {security.email || "No email"}
          </p>
        </div>

        {/* Access Role */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck className="w-4 h-4" />
            <span>Assigned Role</span>
          </div>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            {security.role.replace("_", " ")}
          </p>
        </div>

        {/* Verification Status */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <KeyRound className="w-4 h-4" />
            <span>Email Verification</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xs font-bold inline-flex items-center gap-1 ${
                security.emailVerified
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {security.emailVerified ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Unverified</span>
                </>
              )}
            </span>

            {!security.emailVerified && (
              <Link
                href={`/verify-otp?email=${encodeURIComponent(security.email)}`}
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 underline cursor-pointer"
              >
                Verify Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
