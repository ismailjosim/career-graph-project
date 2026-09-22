import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicReviewsClient } from "@/components/reviews";

export const metadata: Metadata = {
  title: "Verified Community Reviews & Stories | Career Graph",
  description:
    "Read authentic reviews and hiring outcomes from candidates, recruiters, and employers using Career Graph.",
  openGraph: {
    title: "Verified Community Reviews | Career Graph",
    description:
      "Real stories and verified hiring outcomes from top professionals using Career Graph.",
  },
};

export default function ReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PublicReviewsClient />
    </Suspense>
  );
}
