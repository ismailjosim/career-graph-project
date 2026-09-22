"use client";

import { Coins, Plus, Sparkles } from "lucide-react";

interface PricingHeaderProps {
  tokens: number;
  isAdmin: boolean;
  onOpenCreatePackage?: () => void;
}

export function PricingHeader({
  tokens,
  isAdmin,
  onOpenCreatePackage,
}: PricingHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-indigo-500/20">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Token Credit Store</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Power Your Career Search with AI
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Every ATS audit, tailored cover letter, and job fit analysis runs on
            secure tokens. Purchase packages or enjoy bonuses with lifetime
            validity.
          </p>
        </div>

        {/* Live Token Balance Card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/15 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/30 shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                Current Balance
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl font-black font-mono tracking-tight text-white">
                  {tokens}
                </span>
                <span className="text-xs font-bold text-amber-300">Tokens</span>
              </div>
            </div>
          </div>

          {isAdmin && onOpenCreatePackage && (
            <button
              onClick={onOpenCreatePackage}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/30 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Package</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
