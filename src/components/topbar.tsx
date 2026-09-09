"use client";

import { Clock, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  "/job-market": {
    title: "Job Market Directory",
    subtitle: "Curate and explore your favorite online job marketplaces",
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
  "/users": {
    title: "User Management",
    subtitle: "Manage system accounts, access roles, and platform permissions",
  },
};

function LiveDateTimeDisplay() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="h-9 w-32 md:w-44 rounded-xl bg-slate-100 dark:bg-slate-800/80 animate-pulse border border-slate-200/60 dark:border-slate-700/50" />
    );
  }

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs shrink-0">
      <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </div>
      <div className="flex flex-col text-right">
        <span className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-100 font-mono tracking-tight tabular-nums">
          {formattedTime}
        </span>
        <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
          {formattedDate}
        </span>
      </div>
    </div>
  );
}

export function TopBar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse, toggleMobile } = useSidebar();

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

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 sm:px-6 md:px-8 flex items-center justify-between transition-colors">
      {/* Left side: Hamburger (mobile), Collapse button (desktop), Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 min-w-0 flex-1 sm:flex-initial">
        {/* Mobile menu trigger */}
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
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
          className="hidden lg:flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        {/* Title */}
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
            {currentMeta.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Live Date & Time Display */}
      <div className="flex items-center shrink-0 ml-2">
        <LiveDateTimeDisplay />
      </div>
    </header>
  );
}
