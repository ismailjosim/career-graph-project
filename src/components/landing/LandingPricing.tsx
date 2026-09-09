"use client";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Coins,
  FileCheck,
  FileText,
  Link2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LandingPricing() {
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "ultra">(
    "pro",
  );

  const packages = [
    {
      id: "starter",
      name: "Starter Pack",
      price: "$5",
      priceNum: 5,
      tokens: 500,
      badge: null,
      bonus: null,
      costPerToken: "$0.010",
      description:
        "Perfect for active job seekers targeting 15-25 curated applications.",
      features: [
        "500 AI Diamond Tokens",
        "Up to 50 Full ATS Resume Audits",
        "Or up to 25 Custom Cover Letters",
        "Tokens never expire",
        "Export to Word & PDF",
      ],
      ctaText: "Get 500 Tokens",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "$10",
      priceNum: 10,
      tokens: 1150,
      badge: "Most Popular",
      bonus: "+150 Free Tokens (15% Bonus)",
      costPerToken: "$0.0087",
      description:
        "The sweet spot for candidates running multi-stage job search campaigns.",
      features: [
        "1,150 AI Diamond Tokens",
        "Up to 115 Full ATS Resume Audits",
        "Or up to 57 Custom Cover Letters",
        "Priority Gemini Flash engine",
        "Tokens never expire",
        "Full Job Description matching",
      ],
      ctaText: "Get 1,150 Tokens",
      popular: true,
    },
    {
      id: "ultra",
      name: "Ultra Value",
      price: "$20",
      priceNum: 20,
      tokens: 2600,
      badge: "Best Value",
      bonus: "+600 Free Tokens (30% Bonus)",
      costPerToken: "$0.0076",
      description:
        "Maximum tokens for power job seekers, career coaches, or long-term pipelines.",
      features: [
        "2,600 AI Diamond Tokens",
        "Up to 260 Full ATS Resume Audits",
        "Or up to 130 Custom Cover Letters",
        "Deep 4-Pillar ATS scoring",
        "Tokens never expire",
        "VIP customer support",
      ],
      ctaText: "Get 2,600 Tokens",
      popular: false,
    },
  ];

  const featureCosts = [
    {
      name: "ATS Resume Checker",
      icon: FileCheck,
      color: "text-blue-500",
      cost: "10 Tokens",
      dollar: "$0.10",
      detail:
        "4-Pillar audit (Formatting, Keywords, Impact, Structure) + PDF/Word export",
    },
    {
      name: "AI Cover Letter Architect",
      icon: FileText,
      color: "text-purple-500",
      cost: "20 Tokens",
      dollar: "$0.20",
      detail:
        "Tailored to full job post requirements with customizable voice and tone",
    },
    {
      name: "AI Job Fit Analysis",
      icon: Sparkles,
      color: "text-indigo-500",
      cost: "10 Tokens",
      dollar: "$0.10",
      detail:
        "0-100% role qualification match with missing skills & interview questions",
    },
    {
      name: "1-Click Job Link Extraction",
      icon: Link2,
      color: "text-cyan-500",
      cost: "5 Tokens",
      dollar: "$0.05",
      detail:
        "Extracts title, company, salary & full job spec from any job URL",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 relative overflow-hidden bg-white dark:bg-slate-950"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
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
            weeks? Buy tokens once. They never expire.
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => {
            const isSelected = selectedPlan === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPlan(pkg.id as typeof selectedPlan)}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer ${
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

        {/* Transparent Feature Cost Directory */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Transparent Unit Economics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Exact token consumption per AI feature. 1 Token = $0.01 (1 cent).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featureCosts.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.name}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${feat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {feat.name}
                      </h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                          🪙 {feat.cost}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({feat.dollar})
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {feat.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guarantee Badges */}
          <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Tokens never expire
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-blue-500" />
              No automatic renewals or hidden fees
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Instant credit after purchase
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
