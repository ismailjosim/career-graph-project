"use client";

import { ArrowRight, CheckCircle2, Coins } from "lucide-react";
import Link from "next/link";
import { packages, type PricingPackage } from "./pricing.data";

interface PricingCardsGridProps {
  selectedPlan: "starter" | "pro" | "ultra";
  onSelectPlan: (plan: "starter" | "pro" | "ultra") => void;
}

export function PricingCardsGrid({
  selectedPlan,
  onSelectPlan,
}: PricingCardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
      {packages.map((pkg: PricingPackage) => {
        const isSelected = selectedPlan === pkg.id;
        return (
          <div
            key={pkg.id}
            onClick={() => onSelectPlan(pkg.id)}
            className={`relative rounded-3xl p-5 sm:p-8 flex flex-col justify-between transition-all cursor-pointer ${
              isSelected
                ? "bg-white dark:bg-slate-900 border-2 border-indigo-500 dark:border-indigo-500 shadow-2xl shadow-indigo-500/10 scale-100 md:scale-105 z-10"
                : "bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            {/* Popular / Best Value Badge */}
            {pkg.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-linear-to-r from-indigo-600 to-blue-600 shadow-md">
                {pkg.badge}
              </div>
            )}

            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {pkg.description}
                  </p>
                </div>
              </div>

              {/* Token Count & Price */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-space-grotesk">
                  {pkg.price}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  one-time
                </span>
              </div>

              {/* Token Pill */}
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300">
                  <Coins className="w-3.5 h-3.5" />
                  {pkg.tokens.toLocaleString()} Tokens
                </span>
                <span className="text-[11px] text-slate-400">
                  ({pkg.costPerToken} / token)
                </span>
              </div>

              {/* Bonus Callout */}
              {pkg.bonus && (
                <div className="mt-2.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 inline-block">
                    ⚡ {pkg.bonus}
                  </span>
                </div>
              )}

              {/* Features List */}
              <ul className="mt-8 space-y-3">
                {pkg.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action CTA */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/register"
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  pkg.popular
                    ? "bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-700 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                }`}
              >
                <span>{pkg.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
