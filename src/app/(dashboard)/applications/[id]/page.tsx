import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ApplicationDetailClient,
  ApplicationsLoading,
} from "@/components/dashboard/applications";

export const metadata: Metadata = {
  title: "Application Details | Career Graph",
  description:
    "View and edit your job application status, timeline, notes, and fit details.",
};

interface ApplicationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<ApplicationsLoading />}>
      <ApplicationDetailClient applicationId={id} />
    </Suspense>
  );
}
