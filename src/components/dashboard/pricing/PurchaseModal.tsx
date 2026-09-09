"use client";

import {
  CheckCircle,
  Coins,
  CreditCard,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import type { TokenPackageData } from "./types";

interface PurchaseModalProps {
  isOpen: boolean;
  pkg: TokenPackageData | null;
  onClose: () => void;
  onSuccess: (newBalance: number, tokensAdded: number) => void;
}

export function PurchaseModal({
  isOpen,
  pkg,
  onClose,
  onSuccess,
}: PurchaseModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !pkg) return null;

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/packages/${pkg._id}/purchase`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Purchase failed");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess(data.newBalance, data.tokensAdded);
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment processing failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Purchase Token Package
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instant token credit to your account
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
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {pkg.name}
            </span>
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
              Total Charged:
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 text-base font-mono">
              ${pkg.price}.00 USD
            </span>
          </div>
        </div>

        {/* Simulated Instant Checkout Notice */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-300 text-xs leading-relaxed">
          <CreditCard className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
          <span>
            <strong>Simulated Instant Checkout:</strong> For demo & evaluation,
            clicking confirm will process the transaction immediately and top up
            your balance.
          </span>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Success! Tokens have been added to your balance.</span>
          </div>
        )}

        {/* Actions */}
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
            onClick={handlePurchase}
            disabled={loading || success}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Credited!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm Purchase</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
