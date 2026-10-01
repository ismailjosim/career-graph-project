import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminReviewsClient } from "@/components/dashboard/admin-reviews";

export const metadata: Metadata = {
  title: "Admin Feedback & Reviews Moderation | Career Graph",
  description:
    "Review, approve, reject, or feature community feedback from candidates, recruiters, and employers.",
};

export default function AdminReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-xs text-slate-500">
            Verifying administrative access...
          </p>
        </div>
      }
    >
      <AdminReviewsClient />
    </Suspense>
  );
}
