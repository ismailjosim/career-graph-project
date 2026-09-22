import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { FitAnalysisClient } from "@/components/dashboard/fit-analysis";

export const metadata: Metadata = {
  title: "AI Job Fit Analysis | Career Graph",
  description:
    "Evaluate alignment between your resume and target job descriptions with Gemini AI.",
};

export default function FitAnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-slate-500">Loading Fit Analysis...</p>
        </div>
      }
    >
      <FitAnalysisClient />
    </Suspense>
  );
}
