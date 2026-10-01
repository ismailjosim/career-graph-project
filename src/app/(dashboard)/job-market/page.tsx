import type { Metadata } from "next";
import { Suspense } from "react";
import {
  JobMarketClient,
  JobMarketLoading,
} from "@/components/dashboard/job-market";

export const metadata: Metadata = {
  title: "Job Market Hub | Career Graph",
  description:
    "Explore external job boards, specialized career portals, and freelance marketplaces.",
};

export default function JobMarketPage() {
  return (
    <Suspense fallback={<JobMarketLoading />}>
      <JobMarketClient />
    </Suspense>
  );
}
