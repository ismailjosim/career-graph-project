import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PricingClient } from "@/components/dashboard/pricing";

export const metadata: Metadata = {
  title: "Token Packages & Pricing | Career Graph",
  description:
    "Refill your AI tokens, view transparent platform pricing, and manage token packages.",
};

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PricingClient />
    </Suspense>
  );
}
