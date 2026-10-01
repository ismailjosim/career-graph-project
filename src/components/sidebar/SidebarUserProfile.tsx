"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

interface SidebarUserProfileProps {
  isCollapsed: boolean;
  mobileOpen: boolean;
}

export function SidebarUserProfile({
  isCollapsed,
  mobileOpen,
}: SidebarUserProfileProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div
        className={`flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 animate-pulse ${
          isCollapsed && !mobileOpen ? "justify-center p-1.5" : ""
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
        {(!isCollapsed || mobileOpen) && (
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-2.5 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        )}
      </div>
    );
  }

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : session?.user?.email
      ? session.user.email.charAt(0).toUpperCase()
      : "U";

  if (session?.user) {
    return (
      <div className="relative group">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 ${
            isCollapsed && !mobileOpen ? "justify-center p-1.5" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
            {userInitial}
          </div>
          {(!isCollapsed || mobileOpen) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {session.user.name || "User"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {session.user.email}
              </p>
            </div>
          )}
        </div>
        {isCollapsed && !mobileOpen && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            <p className="font-semibold">{session.user.name || "User"}</p>
            <p className="text-[10px] opacity-75">{session.user.email}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <Link
        href="/login"
        prefetch={false}
        className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors ${
          isCollapsed && !mobileOpen ? "justify-center" : ""
        }`}
      >
        <LogIn className="w-4 h-4 shrink-0" />
        {(!isCollapsed || mobileOpen) && <span>Sign In</span>}
      </Link>
      {isCollapsed && !mobileOpen && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
          Sign In
        </div>
      )}
    </div>
  );
}
