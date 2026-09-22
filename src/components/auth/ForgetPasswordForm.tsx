"use client";

import { AlertCircle, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { forgetPassword } from "@/lib/auth-client";

export function ForgetPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await forgetPassword({
        email,
        redirectTo: "/reset-password",
      }) as { error?: { message?: string } | null };

      if (res.error) {
        const msg = res.error.message || "Failed to send reset link";
        setError(msg);
        toast.error(msg);
      } else {
        setSuccess(true);
        toast.success("Password reset link sent to your email.");
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again later.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card p-5 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-center">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Check your email
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          We have sent a password reset link to{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {email}
          </span>
          .
        </p>
        <Link
          href="/login"
          className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
        >
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-5 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Reset password
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-2.5 text-rose-700 dark:text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input pl-11"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Reset Link</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
