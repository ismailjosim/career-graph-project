"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { OtpInput } from "@/components/auth/OtpInput";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [devCode, setDevCode] = useState<string | null>(null);

  // Sync email from search params
  useEffect(() => {
    if (emailParam && !email) {
      setEmail(emailParam);
    }
  }, [emailParam, email]);

  // 60-second cooldown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please specify your email address.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter all 6 digits of your verification code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to verify code.");
      }

      setSuccess(data.message || "Email verified successfully!");
      toast.success(
        data.bonusGiven
          ? "Email verified successfully! +20 Bonus Tokens awarded."
          : "Email verified successfully!",
      );

      // Redirect after brief celebration
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 1200);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during verification.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || resending || !email) return;

    setError(null);
    setResending(true);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code.");
      }

      setCountdown(60);
      setSuccess("A fresh verification code has been sent!");
      toast.success("A fresh 6-digit code has been sent to your email.");
      if (data.devCode) {
        setDevCode(data.devCode);
      }
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to resend code.";
      setError(msg);
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="card p-4 sm:p-8 md:p-10 shadow-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md max-w-md w-full mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
          <KeyRound className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Verify Your Email
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          We sent a 6-digit verification code to:
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-full truncate">
          <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{email || "your email address"}</span>
        </div>
      </div>

      {/* Dev helper pill for instant local test */}
      {devCode && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
          <span>
            Dev Preview Code: <strong>{devCode}</strong>
          </span>
          <button
            type="button"
            onClick={() => setOtp(devCode)}
            className="underline font-bold cursor-pointer"
          >
            Auto Fill
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        <OtpInput
          value={otp}
          onChange={(newOtp) => {
            setOtp(newOtp);
            if (newOtp.length === 6) {
              setError(null);
            }
          }}
          disabled={loading || Boolean(success)}
          isError={Boolean(error)}
        />

        <button
          type="submit"
          disabled={loading || otp.length !== 6 || Boolean(success)}
          className="btn-primary w-full py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified! Redirecting...</span>
            </>
          ) : (
            <span>Verify & Continue</span>
          )}
        </button>
      </form>

      {/* Resend Code & Navigation */}
      <div className="space-y-3 pt-2 text-center text-xs">
        <div className="flex items-center justify-center gap-1.5 text-slate-500">
          <span>Didn&apos;t receive the code?</span>
          {countdown > 0 ? (
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Resend in {countdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3 h-3 ${resending ? "animate-spin" : ""}`}
              />
              <span>Resend Code</span>
            </button>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/register"
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 inline-flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Use a different email address</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading verification...</p>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
