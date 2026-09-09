"use client";

import { Ban, LogOut } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
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
  const pathname = usePathname();

  const [userStatus, setUserStatus] = useState<string>("active");
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  // Query live status & profile completion
  useEffect(() => {
    if (session?.user) {
      fetch("/api/users/me")
        .then((res) => {
          if (res.status === 403) {
            setIsBlocked(true);
            return null;
          }
          return res.ok ? res.json() : null;
        })
        .then((resData) => {
          if (!resData?.user) return;
          const u = resData.user;
          setUserStatus(u.status || "active");
          if (u.status === "blocked") {
            setIsBlocked(true);
            return;
          }

          // New User Onboarding Redirection
          // After a new user logs in, if profile is incomplete, navigate to /profile to update information
          const alreadyPrompted =
            typeof window !== "undefined" &&
            sessionStorage.getItem("career_graph_profile_prompted");

          if (
            !u.isProfileComplete &&
            !alreadyPrompted &&
            pathname === "/dashboard"
          ) {
            sessionStorage.setItem("career_graph_profile_prompted", "true");
            router.push("/profile?prompt=complete");
          }
        })
        .catch(() => {});
    }
  }, [session?.user, pathname, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

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

  // Blocked Account Screen
  if (isBlocked || userStatus === "blocked") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="card p-8 sm:p-10 max-w-md w-full text-center space-y-5 border-2 border-rose-300 dark:border-rose-900/60 bg-white dark:bg-slate-900 shadow-xl rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <Ban className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Account Suspended
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your account has been deactivated or blocked by a platform
              administrator. You cannot access the application or your documents
              at this time.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
            Please reach out to support or the platform administrator if you
            believe this was in error.
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="btn-outline w-full py-2.5 text-xs inline-flex items-center justify-center gap-2 cursor-pointer text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
