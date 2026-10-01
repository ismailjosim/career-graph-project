"use client";

import { AlertCircle, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { signIn } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        const msg = res.error.message || "Invalid email or password";
        setError(msg);
        toast.error(msg);
      } else {
        toast.success("Welcome back! Signed in successfully.");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during sign in";
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
          Welcome back
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Sign in to access your applications and career tracker
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-2.5 text-rose-700 dark:text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Social Login */}
      <div className="space-y-3">
        <GoogleSignInButton
          callbackUrl={callbackUrl}
          label="Sign in with Google"
        />

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Or continue with email
          </span>
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
        </div>
      </div>

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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Link
              href="/forget-password"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
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

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Create one now
        </Link>
      </div>
    </div>
  );
}
