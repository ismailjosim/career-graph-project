"use client";

import { MessageSquareQuote, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useSidebar } from "./sidebar-context";
import {
  type MenuGroup,
  menuGroups,
  SidebarFooterActions,
  SidebarNav,
  SidebarTokenWidget,
  SidebarUserProfile,
} from "./sidebar/index";

export function Sidebar() {
  const { isCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const { data: session } = useSession();

  const [verifiedRole, setVerifiedRole] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/users/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user?.role) {
            setVerifiedRole(data.user.role);
          }
        })
        .catch(() => {});
    }
  }, [session?.user]);

  const activeRole =
    verifiedRole || (session?.user as unknown as Record<string, unknown>)?.role;
  const isAdmin = activeRole === "admin" || activeRole === "super_admin";

  const visibleGroups: MenuGroup[] = [
    ...menuGroups,
    ...(isAdmin
      ? [
          {
            id: "admin",
            label: "Administration",
            items: [
              {
                icon: Users,
                label: "Users",
                href: "/users",
              },
              {
                icon: MessageSquareQuote,
                label: "Feedback & Reviews",
                href: "/admin/reviews",
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } ${
          mobileOpen
            ? "translate-x-0 w-[82vw] max-w-72 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header / Brand Logo */}
        <div
          className={`h-16 flex items-center border-b border-slate-200 dark:border-slate-800 ${
            isCollapsed && !mobileOpen
              ? "justify-center px-2"
              : "justify-between px-4"
          }`}
        >
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 group ${
              isCollapsed && !mobileOpen ? "justify-center" : "overflow-hidden"
            }`}
          >
            <div className="w-10 h-10 shrink-0 relative rounded-xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-md shadow-blue-500/15 border border-slate-200/80 dark:border-slate-700/60 group-hover:scale-105 transition-transform">
              <Image
                src="/career-graph.png"
                alt="Career Graph Logo"
                width={36}
                height={36}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="font-bold text-base bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                  Career Graph
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Job Tracker
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu Items with Category Labels */}
        <SidebarNav
          groups={visibleGroups}
          isCollapsed={isCollapsed}
          mobileOpen={mobileOpen}
          onNavigate={() => setMobileOpen(false)}
        />

        {/* Footer Area: Token Balance Widget, User Profile, Theme Toggle & Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/30">
          <SidebarTokenWidget
            isCollapsed={isCollapsed}
            mobileOpen={mobileOpen}
            onNavigate={() => setMobileOpen(false)}
          />

          <SidebarUserProfile
            isCollapsed={isCollapsed}
            mobileOpen={mobileOpen}
          />

          <SidebarFooterActions
            isCollapsed={isCollapsed}
            mobileOpen={mobileOpen}
          />
        </div>
      </aside>
    </>
  );
}
