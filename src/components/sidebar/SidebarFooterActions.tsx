"use client";

import { LogOut, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut, useSession } from "@/lib/auth-client";

interface SidebarFooterActionsProps {
  isCollapsed: boolean;
  mobileOpen: boolean;
}

export function SidebarFooterActions({
  isCollapsed,
  mobileOpen,
}: SidebarFooterActionsProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      {/* Theme Toggle Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
            isCollapsed && !mobileOpen ? "justify-center px-0" : ""
          }`}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              {(!isCollapsed || mobileOpen) && <span>Light Mode</span>}
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-600 shrink-0" />
              {(!isCollapsed || mobileOpen) && <span>Dark Mode</span>}
            </>
          )}
        </button>
        {isCollapsed && !mobileOpen && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </div>
        )}
      </div>

      {/* Logout Button (if logged in) */}
      {session?.user && (
        <div className="relative group">
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer ${
              isCollapsed && !mobileOpen ? "justify-center px-0" : ""
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!isCollapsed || mobileOpen) && <span>Sign Out</span>}
          </button>
          {isCollapsed && !mobileOpen && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
              Sign Out
            </div>
          )}
        </div>
      )}
    </>
  );
}
