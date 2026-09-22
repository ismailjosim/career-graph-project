"use client";

import {
  ArrowRight,
  CheckCircle,
  Coins,
  CreditCard,
  Loader2,
  Lock,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { TokenPackageData } from "./types";

interface PurchaseModalProps {
  isOpen: boolean;
  pkg: TokenPackageData | null;
  onClose: () => void;
}

export function PurchaseModal({ isOpen, pkg, onClose }: PurchaseModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !pkg) return null;

  const handleProceedToPolar = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/packages/${pkg._id}/checkout`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize payment session.");
      }

      if (!data.checkoutUrl) {
        throw new Error("No checkout URL received from Polar.");
      }

      toast.loading("Redirecting to Polar secure checkout...");
      // Redirect to Polar hosted checkout page
      window.location.href = data.checkoutUrl;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to connect with Polar payment gateway.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Secure Checkout
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500" />
                Powered by Polar Payment Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {pkg.name}
              </span>
              {pkg.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {pkg.badge}
                </span>
              )}
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              ${pkg.price}.00 USD
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
            <span>Tokens to be credited:</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              +{pkg.tokens.toLocaleString()} Tokens
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-bold">
            <span className="text-slate-900 dark:text-white">
              Total Due Today:
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 text-lg font-mono">
              ${pkg.price}.00 USD
            </span>
          </div>
        </div>

        {/* Included Features Snapshot */}
        {pkg.features && pkg.features.length > 0 && (
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              What&apos;s Included:
            </span>
            <div className="grid grid-cols-1 gap-1 pt-1">
              {pkg.features.slice(0, 3).map((feat) => (
                <div key={`pkg-feat-${feat}`} className="flex items-center gap-2 text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real Polar Payment Trust Information */}
        <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-900 dark:text-indigo-200 font-semibold">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Accepted Payment Methods
            </span>
            <span className="text-[10px] text-slate-400">One-time payment</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
              Credit Card
            </span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
              Debit Card
            </span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
              Apple Pay
            </span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
              Google Pay
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
            Clicking below will securely redirect you to Polar&apos;s checkout
            page. Once paid, your tokens are instantly credited to your balance.
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProceedToPolar}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer transition-all hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <span>Pay with Polar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
