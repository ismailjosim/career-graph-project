"use client";

import { Coins } from "lucide-react";
import Link from "next/link";
import { useTokens } from "@/context/tokens-context";

interface SidebarTokenWidgetProps {
  isCollapsed: boolean;
  mobileOpen: boolean;
  onNavigate: () => void;
}

export function SidebarTokenWidget({
  isCollapsed,
  mobileOpen,
  onNavigate,
}: SidebarTokenWidgetProps) {
  const { tokens } = useTokens();

  return (
    <div className="relative group">
      <Link
        href="/pricing"
        onClick={onNavigate}
        className={`flex items-center gap-2.5 p-2 rounded-xl bg-linear-to-r from-amber-500/10 via-amber-500/5 to-yellow-500/10 border border-amber-500/25 dark:border-amber-400/25 hover:border-amber-500/40 text-amber-700 dark:text-amber-300 transition-all ${
          isCollapsed && !mobileOpen ? "justify-center p-2" : ""
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
          <Coins className="w-4 h-4" />
        </div>
        {(!isCollapsed || mobileOpen) && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
                {tokens} Tokens
              </span>
              <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded-md">
                Get More
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              ATS: 10 • Letter: 20
            </p>
          </div>
        )}
      </Link>
      {isCollapsed && !mobileOpen && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
          <p className="font-semibold">{tokens} Tokens</p>
          <p className="text-[10px] text-amber-400 dark:text-amber-600 font-medium">
            Click to view packages
          </p>
        </div>
      )}
    </div>
  );
}
