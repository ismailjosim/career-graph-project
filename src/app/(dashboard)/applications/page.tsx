import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ApplicationsClient,
  ApplicationsLoading,
} from "@/components/dashboard/applications";

export const metadata: Metadata = {
  title: "Job Applications | Career Graph",
  description:
    "Track and manage all your job applications, stages, interviews, and progress.",
};

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<ApplicationsLoading />}>
      <ApplicationsClient />
    </Suspense>
  );
}
