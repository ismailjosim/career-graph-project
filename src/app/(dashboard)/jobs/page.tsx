import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { JobPortalClient } from "@/components/dashboard/jobs";

export const metadata: Metadata = {
  title: "Job Portal | Career Graph",
  description:
    "Explore verified jobs, apply directly using tokens, and track your applications.",
};

export default function JobPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <JobPortalClient />
    </Suspense>
  );
}
