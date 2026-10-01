import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PostJobForm } from "@/components/dashboard/jobs";

export const metadata: Metadata = {
  title: "Post a Job | Career Graph",
  description:
    "Publish a new job opportunity for candidates to discover and apply with AI resume matching.",
};

export default function PostJobPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PostJobForm />
    </Suspense>
  );
}
