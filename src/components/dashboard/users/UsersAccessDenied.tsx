import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { UserRole } from "@/lib/validation";

interface UsersAccessDeniedProps {
  currentUserRole: UserRole;
}

export function UsersAccessDenied({ currentUserRole }: UsersAccessDeniedProps) {
  return (
    <div className="card p-8 sm:p-12 text-center max-w-lg mx-auto my-12 space-y-5 border-2 border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 shadow-lg animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Admin Access Required
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The User Management console is restricted to platform{" "}
          <strong>Administrators</strong> and the <strong>Super Admin</strong>.
          Your account is assigned the{" "}
          <span className="font-bold uppercase text-slate-800 dark:text-slate-200">
            {currentUserRole.replace("_", " ")}
          </span>{" "}
          role.
        </p>
      </div>
      <div className="pt-2">
        <Link
          href="/dashboard"
          className="btn-primary py-2 px-5 text-xs inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
