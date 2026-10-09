"use client";

import { Ban, KeyRound, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { Sidebar } from "./sidebar";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { TopBar } from "./topbar";

function DashboardLayoutContent({
  children,
  userRole,
}: {
  children: ReactNode;
  userRole?: string;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors">
      <Sidebar userRole={userRole} />

      {/* Main Content Area smoothly shifting with sidebar collapse */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <TopBar />
        <main className="flex-1 w-full px-2.5 sm:px-6 md:px-8 py-4 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardLayoutClient({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: {
    email?: string;
    emailVerified?: boolean;
    status?: string;
    role?: string;
  } | null;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [userStatus, setUserStatus] = useState<string>(
    initialUser?.status || "active",
  );
  const [isBlocked, setIsBlocked] = useState(initialUser?.status === "blocked");
  const [isUnverified, setIsUnverified] = useState(
    initialUser?.emailVerified === false,
  );
  const [unverifiedEmail, setUnverifiedEmail] = useState(
    initialUser?.email || "",
  );

  useEffect(() => {
    if (!isPending && !session && !initialUser) {
      router.replace("/login");
    }
  }, [session, isPending, initialUser, router]);

  // Immediate check if session user has emailVerified: false
  useEffect(() => {
    if (session?.user) {
      const emailUnverified =
        (session.user as { emailVerified?: boolean }).emailVerified === false;
      if (emailUnverified) {
        setIsUnverified(true);
        setUnverifiedEmail(session.user.email || "");
        router.replace(
          `/verify-otp?email=${encodeURIComponent(session.user.email || "")}&callbackUrl=${encodeURIComponent(pathname)}`,
        );
      }
    }
  }, [session?.user, pathname, router]);

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

          // Email OTP verification check
          // If registered via email/password and unverified, redirect to OTP verification
          if (u.emailVerified === false) {
            setIsUnverified(true);
            setUnverifiedEmail(u.email || "");
            router.replace(
              `/verify-otp?email=${encodeURIComponent(u.email || "")}&callbackUrl=${encodeURIComponent(pathname)}`,
            );
            return;
          }

          setIsUnverified(false);

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

  // If initialUser was verified, we can render immediately; otherwise wait for session determination
  if (isPending && !initialUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">
            Securing session...
          </p>
        </div>
      </div>
    );
  }

  if (!session && !initialUser) {
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

  // Unverified Email Protection Screen
  if (isUnverified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="card p-8 sm:p-10 max-w-md w-full text-center space-y-5 border-2 border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 shadow-xl rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Email Verification Required
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Please verify your email address to unlock full access to Career
              Graph and your documents.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-medium">
            Account: {unverifiedEmail || "your email"}
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/verify-otp?email=${encodeURIComponent(unverifiedEmail)}&callbackUrl=${encodeURIComponent(pathname)}`,
                )
              }
              className="btn-primary w-full py-2.5 text-xs inline-flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              <KeyRound className="w-4 h-4" />
              <span>Enter 6-Digit Verification Code</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="btn-outline w-full py-2 text-xs inline-flex items-center justify-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardLayoutContent userRole={initialUser?.role}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}
