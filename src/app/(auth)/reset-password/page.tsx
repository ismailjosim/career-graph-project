import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Career Graph",
  description: "Create a new password for your Career Graph account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="card p-8 text-center animate-pulse">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mx-auto mb-4" />
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
