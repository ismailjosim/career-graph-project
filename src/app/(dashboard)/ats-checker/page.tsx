import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AtsCheckerClient } from "@/components/dashboard/ats";

export const metadata: Metadata = {
  title: "ATS Resume Checker | Career Graph",
  description:
    "Audit and optimize your resume for Applicant Tracking Systems with instant AI feedback.",
};

export default function AtsCheckerPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-slate-500">
            Loading ATS Resume Checker...
          </p>
        </div>
      }
    >
      <AtsCheckerClient />
    </Suspense>
  );
}
