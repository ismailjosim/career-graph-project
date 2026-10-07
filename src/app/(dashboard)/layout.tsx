import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardLayoutClient } from "@/components/dashboard-layout-client";
import { getSessionUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Prevent any unverified user from seeing the dashboard even for a split second
  if (user.emailVerified === false) {
    redirect(
      `/verify-otp?email=${encodeURIComponent(user.email)}&callbackUrl=/dashboard`,
    );
  }

  return (
    <DashboardLayoutClient
      initialUser={{
        email: user.email,
        emailVerified: user.emailVerified,
        status: user.status,
        role: user.role,
      }}
    >
      {children}
    </DashboardLayoutClient>
  );
}
