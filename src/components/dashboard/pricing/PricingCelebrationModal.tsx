"use client";

import { CheckCircle2, Coins, PartyPopper, Sparkles } from "lucide-react";

interface CelebrationData {
  tokensAdded: number;
  newBalance: number;
  packageName: string;
}

interface PricingCelebrationModalProps {
  celebration: CelebrationData | null;
  onClose: () => void;
}

export function PricingCelebrationModal({
  celebration,
  onClose,
}: PricingCelebrationModalProps) {
  if (!celebration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-scale-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/20">
          <PartyPopper className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Payment Confirmed
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Tokens Credited!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your purchase of{" "}
            <strong className="text-slate-900 dark:text-white">
              {celebration.packageName}
            </strong>{" "}
            was completed successfully via Polar.
          </p>
        </div>

        <div className="rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 p-5 space-y-2">
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block">
            Tokens Added to Your Balance
          </span>
          <div className="flex items-center justify-center gap-2 text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
            <Coins className="w-7 h-7" />
            <span>+{celebration.tokensAdded.toLocaleString()}</span>
          </div>
          <div className="pt-2 border-t border-amber-500/20 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Updated Balance:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">
              {celebration.newBalance.toLocaleString()} Tokens
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Continue with Tokens</span>
        </button>
      </div>
    </div>
  );
}
