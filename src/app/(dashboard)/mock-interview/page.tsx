import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { MockInterviewClient } from "@/components/dashboard/mock-interview";

export const metadata: Metadata = {
  title: "AI Mock Interview Simulator | Career Graph",
  description:
    "Practice voice-powered AI mock interviews with real-time STAR diagnostics and coaching feedback.",
};

export default function MockInterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-slate-500">Loading Mock Interview...</p>
        </div>
      }
    >
      <MockInterviewClient />
    </Suspense>
  );
}
