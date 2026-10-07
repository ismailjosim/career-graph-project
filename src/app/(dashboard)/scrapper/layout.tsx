import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export default async function ScrapperLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?callbackUrl=/scrapper");
  }

  // Strictly enforce admin or super_admin access
  if (user.role !== "admin" && user.role !== "super_admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
