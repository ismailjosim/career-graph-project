import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server-auth";
import ScrapperClient from "./ScrapperClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Job Scrapper | Career Graph",
  description:
    "Automated multi-platform job scraper powered by Apify actors. Administrator console.",
};

export default async function ScrapperPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?callbackUrl=/scrapper");
  }

  // Strictly block any non-admin from rendering or accessing this route
  if (user.role !== "admin" && user.role !== "super_admin") {
    redirect("/dashboard");
  }

  return <ScrapperClient />;
}
