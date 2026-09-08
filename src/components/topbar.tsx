"use client";

import {
  LogIn,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { useSidebar } from "./sidebar-context";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Track your job search progress and insights",
  },
  "/applications": {
    title: "Applications",
    subtitle: "Manage all your submitted job applications",
  },
  "/applications/new": {
    title: "New Application",
    subtitle: "Record a new job application",
  },
  "/wishlist": {
    title: "Job Wishlist",
    subtitle: "Save interesting opportunities to apply later",
  },
  "/cover-letters": {
    title: "Cover Letters",
    subtitle: "Draft and customize your targeted cover letters",
  },
  "/resumes": {
    title: "Resumes",
    subtitle: "Manage versions of your tailored resumes",
  },
  "/fit-analysis": {
    title: "Job Fit Analysis",
    subtitle: "Analyze alignment between your resume and job requirements",
  },
};

export function TopBar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse, toggleMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [userDropdown, setUserDropdown] = useState(false);

  // Match title or check nested routes
  let currentMeta = pageTitles[pathname] || {
    title: "Career Graph",
    subtitle: "Job Application Tracker",
  };
  if (!pageTitles[pathname] && pathname?.startsWith("/applications/")) {
    currentMeta = {
      title: "Application Details",
      subtitle: "View and update application progress",
    };
  }

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : session?.user?.email
      ? session.user.email.charAt(0).toUpperCase()
      : "U";

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between transition-colors">
      {/* Left side: Hamburger (mobile), Collapse button (desktop), Page Title */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop sidebar collapse trigger */}
        <button
          onClick={toggleCollapse}
          title={
            isCollapsed ? "Expand sidebar (w-64)" : "Collapse sidebar (w-20)"
          }
          className="hidden lg:flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        {/* Title */}
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {currentMeta.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Theme Toggle, User Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-500 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 text-blue-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* User Account / Profile */}
        {session?.user ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {userInitial}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden md:block max-w-30 truncate">
                {session.user.name || session.user.email}
              </span>
            </button>

            {userDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-slide-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      setUserDropdown(false);
                      await signOut();
                      window.location.href = "/login";
                    }}
                    className="w-full mt-1 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="btn-primary text-xs px-3.5 py-2 shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
