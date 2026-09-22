import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ApplicationsLoading,
  NewApplicationForm,
} from "@/components/dashboard/applications";

export const metadata: Metadata = {
  title: "New Job Application | Career Graph",
  description: "Track and organize details for a new job application.",
};

export default function NewApplicationPage() {
  return (
    <Suspense fallback={<ApplicationsLoading />}>
      <NewApplicationForm />
    </Suspense>
  );
}
