import type { Metadata } from "next";
import { Suspense } from "react";
import { ResumeLoading, ResumesClient } from "@/components/dashboard/resume";

export const metadata: Metadata = {
  title: "Resumes Management | Career Graph",
  description:
    "Upload, manage, preview, and set your default resume for job applications.",
};

export default function ResumesPage() {
  return (
    <Suspense fallback={<ResumeLoading />}>
      <ResumesClient />
    </Suspense>
  );
}
