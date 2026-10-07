"use client";

import {
  ChevronUp,
  LogIn,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";

interface SidebarUserProfileProps {
  isCollapsed: boolean;
  mobileOpen: boolean;
}

export function SidebarUserProfile({
  isCollapsed,
  mobileOpen,
}: SidebarUserProfileProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (isPending) {
    return (
      <div
        className={`flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 animate-pulse ${
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
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Menu (Opens upwards above user card) */}
        {dropdownOpen && (
          <div
            className={`absolute bottom-full mb-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 transition-all animate-fade-in ${
              isCollapsed && !mobileOpen ? "left-0" : "left-0 right-0 w-full"
            }`}
          >
            {/* Header info */}
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {session.user.name || "User"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {session.user.email}
              </p>
            </div>

            {/* Links */}
            <div className="py-1 space-y-0.5">
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>My Profile & Skills</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                <span>Account Settings</span>
              </Link>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  {theme === "dark" ? (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>Theme</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  {theme === "dark" ? "Dark" : "Light"}
                </span>
              </button>
            </div>

            {/* Logout */}
            <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`w-full flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-600 transition-colors cursor-pointer text-left shadow-xs ${
            isCollapsed && !mobileOpen ? "justify-center p-1.5" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
            {userInitial}
          </div>
          {(!isCollapsed || mobileOpen) && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {session.user.name || "User"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {session.user.email}
                </p>
              </div>
              <ChevronUp
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </button>
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
    </div>
  );
}
