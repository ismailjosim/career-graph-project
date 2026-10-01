import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { JobDetailClient } from "@/components/dashboard/jobs";

export const metadata: Metadata = {
  title: "Job Details | Career Graph",
  description:
    "View full job posting details, requirements, compensation, and apply with tokens.",
};

interface JobDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-slate-500">Loading job details...</p>
        </div>
      }
    >
      <JobDetailClient jobId={id} />
    </Suspense>
  );
}
