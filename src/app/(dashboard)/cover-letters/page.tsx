import type { Metadata } from "next";
import { Suspense } from "react";
import {
  CoverLetterLoading,
  CoverLettersClient,
} from "@/components/dashboard/coverLetter";

export const metadata: Metadata = {
  title: "AI Cover Letters | Career Graph",
  description:
    "Generate, manage, and customize tailored cover letters for your job applications.",
};

export default function CoverLettersPage() {
  return (
    <Suspense fallback={<CoverLetterLoading />}>
      <CoverLettersClient />
    </Suspense>
  );
}
