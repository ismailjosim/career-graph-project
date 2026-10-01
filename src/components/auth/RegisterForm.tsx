"use client";

import {
  AlertCircle,
  Briefcase,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserCheck,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { signUp } from "@/lib/auth-client";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"job_seeker" | "recruiter" | "employer">(
    "job_seeker",
  );
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await (
        signUp.email as unknown as (
          args: Record<string, unknown>,
        ) => Promise<{ error?: { message?: string } }>
      )({
        name,
        email,
        password,
        role,
      });

      if (res.error) {
        const msg = res.error.message || "Failed to create account";
        setError(msg);
        toast.error(msg);
      } else {
        toast.success(
          "Account created! 50 Welcome Tokens granted. Please verify your email.",
        );
        // Automatically dispatch verification code to email
        try {
          await fetch("/api/auth/otp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
        } catch (otpErr) {
          console.warn("Failed to dispatch initial OTP:", otpErr);
        }

        router.push(
          `/verify-otp?email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}`,
        );
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during registration";
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
          Create an account
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Start organizing and accelerating your job search today
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Google Sign Up Option */}
      <div className="mb-5">
        <GoogleSignInButton
          label="Sign up with Google"
          callbackUrl={callbackUrl}
          onError={(msg) => setError(msg)}
        />
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Or register with email
        </span>
        <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              className="input pl-11"
            />
          </div>
        </div>

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
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Password
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
              placeholder="At least 6 characters"
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
            Confirm Password
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
              placeholder="Repeat your password"
              className="input pl-11"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            I am registering as a
          </label>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setRole("job_seeker")}
              className={`p-1.5 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer text-center ${
                role === "job_seeker"
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-600/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="leading-tight">Job Seeker</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`p-1.5 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer text-center ${
                role === "recruiter"
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-600/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="leading-tight">Recruiter</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`p-1.5 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer text-center ${
                role === "employer"
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-600/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="leading-tight">Employer</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 mt-2 shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
}
