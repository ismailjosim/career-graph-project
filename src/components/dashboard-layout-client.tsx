"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Sidebar } from "./sidebar";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { TopBar } from "./topbar";

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors">
      <Sidebar />

      {/* Main Content Area smoothly shifting with sidebar collapse */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <TopBar />
        <main className="flex-1 w-full p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardLayoutClient({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="w-16 h-16 rounded-2xl relative bg-white dark:bg-slate-800 p-2 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 border border-slate-200/80 dark:border-slate-700/60 animate-pulse">
          <Image
            src="/career-graph.png"
            alt="Career Graph Logo"
            width={52}
            height={52}
            priority
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-8 h-8 border-3 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin" />
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
          Verifying session...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
