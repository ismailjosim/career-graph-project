import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-linear-to-br from-slate-50 via-slate-100 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
      <div className="w-full max-w-md mb-6 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 group transition-transform active:scale-95"
        >
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            CG
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Career Graph
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Job Application Tracker
            </p>
          </div>
        </Link>
      </div>

      <div className="w-full max-w-md animate-fade-in">{children}</div>

      <p className="mt-8 text-xs text-center text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} Career Graph. Track your applications
        with confidence.
      </p>
    </div>
  );
}
