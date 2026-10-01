import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfileClient, ProfileLoading } from "@/components/dashboard/profile";

export const metadata: Metadata = {
  title: "User Profile | Career Graph",
  description:
    "View and manage your profile details, resumes, and career activity.",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileClient />
    </Suspense>
  );
}
