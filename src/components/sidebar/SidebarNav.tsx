"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuGroup } from "./sidebar.types";

interface SidebarNavProps {
  groups: MenuGroup[];
  isCollapsed: boolean;
  mobileOpen: boolean;
  onNavigate: () => void;
}

export function SidebarNav({
  groups,
  isCollapsed,
  mobileOpen,
  onNavigate,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`flex-1 px-3 py-3 space-y-3 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
        isCollapsed && !mobileOpen
          ? "overflow-visible"
          : "overflow-y-auto overflow-x-hidden"
      }`}
    >
      {groups.map((group, groupIdx) => (
        <div key={group.id} className="space-y-1">
          {/* Group Label / Collapsed Divider */}
          {groupIdx > 0 && isCollapsed && !mobileOpen && (
            <div className="my-2 border-t border-slate-200/60 dark:border-slate-800/60 mx-1" />
          )}
          {(!isCollapsed || mobileOpen) && (
            <div className="px-3 pt-2 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                {group.label}
              </span>
            </div>
          )}

          {/* Items in group */}
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold shadow-sm border border-blue-200/50 dark:border-blue-800/40"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    } ${isCollapsed && !mobileOpen ? "justify-center px-0 py-2.5" : ""}`}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    />
                    {(!isCollapsed || mobileOpen) && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>

                  {/* Hover Tooltip when sidebar is collapsed */}
                  {isCollapsed && !mobileOpen && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2.5 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap flex items-center gap-1.5">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1 text-[9px] bg-blue-500 text-white rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
