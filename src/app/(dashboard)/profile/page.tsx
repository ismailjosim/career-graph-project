import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfileClient, ProfileLoading } from "@/components/dashboard/profile";
import { getProfileDataServer } from "@/services/profile.service";

export const metadata: Metadata = {
  title: "User Profile | Career Graph",
  description:
    "View and manage your profile details, skills portfolio, and career activity.",
};

interface ProfilePageProps {
  searchParams: Promise<{
    userId?: string;
    prompt?: string;
    setup?: string;
  }>;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const resolvedParams = await searchParams;
  const initialData = await getProfileDataServer(resolvedParams.userId);

  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileClient initialData={initialData} />
    </Suspense>
  );
}
