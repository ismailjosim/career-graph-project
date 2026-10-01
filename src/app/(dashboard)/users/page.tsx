import type { Metadata } from "next";
import { Suspense } from "react";
import { UsersClient, UsersLoading } from "@/components/dashboard/users";

export const metadata: Metadata = {
  title: "User Management | Career Graph",
  description:
    "Manage users, system roles, token balances, and account privileges.",
};

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersLoading />}>
      <UsersClient />
    </Suspense>
  );
}
