import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { FitAnalysisResultClient } from "@/components/dashboard/fit-analysis/result";

export const metadata: Metadata = {
  title: "Fit Analysis Report | Career Graph",
  description:
    "Comprehensive AI job fit score, matching skills, gaps, and resume adjustments.",
};

export default function FitAnalysisResultPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-5xl mx-auto py-20 text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Loading your analysis report...
          </p>
        </div>
      }
    >
      <FitAnalysisResultClient />
    </Suspense>
  );
}
