"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Briefcase,
  Heart,
  FileText,
  BookOpen,
  Zap,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

const menuItems = [
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
  {
    icon: Heart,
    label: "Wishlist",
    href: "/wishlist",
  },
  {
    icon: FileText,
    label: "Cover Letters",
    href: "/cover-letters",
  },
  {
    icon: BookOpen,
    label: "Resumes",
    href: "/resumes",
  },
  {
    icon: Zap,
    label: "Fit Analysis",
    href: "/fit-analysis",
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 z-40 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col shadow-xl lg:shadow-none`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition-shadow">
              CG
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Career Graph
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Job Tracker
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-medium"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* Settings Button */}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>

          {/* Logout Button */}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md hover:shadow-lg">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {/* Header for mobile */}
        <div className="lg:hidden h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
      </div>
    </>
  );
}
