"use client";

import {
  BookOpen,
  Bot,
  Briefcase,
  Coins,
  FileCheck,
  FileText,
  Globe,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  MessageSquareQuote,
  Moon,
  Settings,
  Sparkles,
  Sun,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTokens } from "@/context/tokens-context";
import { signOut, useSession } from "@/lib/auth-client";
import { useSidebar } from "./sidebar-context";

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string;
}

interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: Briefcase,
        label: "Applications",
        href: "/applications",
      },
    ],
  },
  {
    id: "discovery",
    label: "Job Discovery",
    items: [
      {
        icon: Sparkles,
        label: "Job Portal",
        href: "/jobs",
      },
      {
        icon: Heart,
        label: "Wishlist",
        href: "/wishlist",
      },
      {
        icon: Globe,
        label: "Job Market",
        href: "/job-market",
      },
    ],
  },
  {
    id: "ai-tools",
    label: "AI Career Tools",
    items: [
      {
        icon: BookOpen,
        label: "Resumes & Builder",
        href: "/resumes",
      },
      {
        icon: FileText,
        label: "Cover Letters",
        href: "/cover-letters",
      },
      {
        icon: Zap,
        label: "Fit Analysis",
        href: "/fit-analysis",
      },
      {
        icon: FileCheck,
        label: "ATS Checker",
        href: "/ats-checker",
      },
      {
        icon: Bot,
        label: "Mock Interview",
        href: "/mock-interview",
        badge: "AI",
      },
    ],
  },
  {
    id: "account",
    label: "Account & Billing",
    items: [
      {
        icon: Coins,
        label: "Tokens & Packages",
        href: "/pricing",
      },
      {
        icon: User,
        label: "Profile",
        href: "/profile",
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/settings",
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const { tokens } = useTokens();

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
                href: "/reviews",
              },
            ],
          },
        ]
      : []),
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : session?.user?.email
      ? session.user.email.charAt(0).toUpperCase()
      : "U";

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
          // Desktop sizing
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } ${
          // Mobile sizing & positioning
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
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu Items with Category Labels */}
        <nav
          className={`flex-1 px-3 py-3 space-y-3 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isCollapsed && !mobileOpen
              ? "overflow-visible"
              : "overflow-y-auto overflow-x-hidden"
          }`}
        >
          {visibleGroups.map((group, groupIdx) => (
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
                    (item.href !== "/dashboard" &&
                      pathname?.startsWith(item.href));

                  return (
                    <div key={item.href} className="relative group">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
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

        {/* Footer Area: Token Balance Widget, User Profile, Theme Toggle & Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/30">
          {/* Token Balance Widget */}
          <div className="relative group">
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
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

          {/* User Profile Info */}
          {session?.user ? (
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
          ) : (
            <div className="relative group">
              <Link
                href="/login"
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
          )}

          {/* Theme Toggle Button */}
          <div className="relative group">
            <button
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
        </div>
      </aside>
    </>
  );
}
