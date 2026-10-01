import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgetPasswordForm } from "@/components/auth/ForgetPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Career Graph",
  description: "Reset your Career Graph password.",
};

export default function ForgetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="card p-8 text-center animate-pulse">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mx-auto mb-4" />
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
        </div>
      }
    >
      <ForgetPasswordForm />
    </Suspense>
  );
}
