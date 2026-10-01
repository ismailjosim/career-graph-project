import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account | Career Graph",
  description:
    "Join Career Graph to track jobs, audit resumes with AI, and tailor cover letters.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="card p-8 text-center animate-pulse">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mx-auto mb-4" />
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
