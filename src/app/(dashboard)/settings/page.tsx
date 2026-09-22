import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SettingsClient } from "@/components/dashboard/settings";

export const metadata: Metadata = {
  title: "Account Settings | Career Graph",
  description:
    "Manage your profile details, security preferences, and password.",
};

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-slate-500">Loading settings...</p>
        </div>
      }
    >
      <SettingsClient />
    </Suspense>
  );
}
