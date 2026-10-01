import type { Metadata } from "next";
import { Suspense } from "react";
import {
  WishlistClient,
  WishlistLoading,
} from "@/components/dashboard/wishlist";

export const metadata: Metadata = {
  title: "Job Wishlist | Career Graph",
  description:
    "Save and track job postings from across the web before submitting your application.",
};

export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistLoading />}>
      <WishlistClient />
    </Suspense>
  );
}
