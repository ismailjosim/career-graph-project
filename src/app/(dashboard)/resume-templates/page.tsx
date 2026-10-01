import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminTemplatesClient } from "@/components/dashboard/admin-templates/AdminTemplatesClient";

export const metadata: Metadata = {
  title: "Resume Templates Management | Career Graph",
  description:
    "Configure, publish, and price resume builder templates for candidates with server-side pagination.",
};

export default function ResumeTemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-500">
              Loading Resume Template Dashboard...
            </p>
          </div>
        </div>
      }
    >
      <AdminTemplatesClient />
    </Suspense>
  );
}
