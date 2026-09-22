import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/overview";

export const metadata: Metadata = {
  title: "Dashboard Overview | Career Graph",
  description:
    "Track your career progress, applications, and job market activity in one place.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
