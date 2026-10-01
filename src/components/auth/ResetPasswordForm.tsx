"use client";

import { AlertCircle, Eye, EyeOff, Lock, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { resetPassword } from "@/lib/auth-client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = (await resetPassword({
        newPassword: password,
      })) as { error?: { message?: string } | null };

      if (res.error) {
        const msg =
          res.error.message ||
          "Failed to reset password. The link might be expired.";
        setError(msg);
        toast.error(msg);
      } else {
        toast.success("Password reset successfully. You can now login.");
        router.push("/login");
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

  return (
    <div className="card p-5 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Create new password
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Please enter your new password below.
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
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              className="input pl-11 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="******"
              className="input pl-11 pr-11"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Password</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
