"use client";

import { Coins, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  PricingCalculator,
  PricingCardsGrid,
  PricingComparison,
  PricingFeatureCosts,
} from "./pricing";

export function LandingPricing() {
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "ultra">(
    "pro",
  );
  const [appTarget, setAppTarget] = useState<number>(25);

  const handleSelectTarget = (
    target: number,
    plan: "starter" | "pro" | "ultra",
  ) => {
    setAppTarget(target);
    setSelectedPlan(plan);
  };

  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 relative overflow-hidden bg-white dark:bg-slate-950"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Coins className="w-3.5 h-3.5" />
            Fair Pay-As-You-Go Token Economy
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
            No Monthly Subscriptions.{" "}
            <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Pay Only When You Apply.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Why pay $50/month on Jobscan or Teal when you only apply for a few
            weeks? Buy tokens once.{" "}
            <span className="font-semibold text-slate-900 dark:text-white underline decoration-indigo-500 decoration-2 underline-offset-2">
              They never expire.
            </span>
          </p>

          {/* Welcome Bonus Callout */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-2 rounded-2xl bg-linear-to-r from-indigo-500/10 via-blue-500/10 to-cyan-500/10 border border-indigo-500/20 text-xs font-semibold text-slate-900 dark:text-white shadow-xs">
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Free Welcome Grant:
            </span>
            <span>50 Tokens on Signup + 20 Tokens on Email Verification</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
              70 Free Tokens (~7 ATS Scans)
            </span>
          </div>
        </div>

        {/* Interactive Application Calculator */}
        <PricingCalculator
          appTarget={appTarget}
          onSelectTarget={handleSelectTarget}
        />

        {/* Pricing Cards */}
        <PricingCardsGrid
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
        />

        {/* Transparent Feature Cost Directory */}
        <PricingFeatureCosts />

        {/* Competitor Comparison Section */}
        <PricingComparison />
      </div>
    </section>
  );
}
