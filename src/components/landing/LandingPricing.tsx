"use client";

import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  highlighted?: boolean;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter Pack",
    price: "$5",
    period: "one-time bundle",
    description:
      "Essential bundle to kickstart applications with lifetime tokens + 30 days of daily scraping.",
    badge: "Starter",
    features: [
      "500 AI Tokens (Lifetime Validity — Never Expire)",
      "30 Days of Automated Daily AI Scraped Matches",
      "~12 Complete Application Suites",
      "50 Deep ATS Resume Audits (10 tokens each)",
      "25 AI Tailored Cover Letters (20 tokens each)",
      "2 Saved Resumes & Full Application Tracker",
    ],
    ctaText: "Get Starter Pack ($5)",
    ctaHref: "/pricing",
  },
  {
    id: "pro",
    name: "Pro Pack",
    price: "$10",
    period: "one-time bundle (+15% Bonus)",
    description:
      "Our most popular package for serious job seekers targeting top roles.",
    badge: "Most Popular",
    highlighted: true,
    features: [
      "1,150 AI Tokens (+150 Bonus, Lifetime Validity)",
      "30 Days Full Daily AI Scraped Matches (10–15 jobs/day)",
      "~28 Complete Application Suites",
      "115 Deep ATS Resume Audits (10 tokens each)",
      "57 AI Tailored Cover Letters (20 tokens each)",
      "High-Priority AI Speed & 5 Saved Resumes",
    ],
    ctaText: "Get Pro Pack ($10)",
    ctaHref: "/pricing",
  },
  {
    id: "ultra",
    name: "Ultra Career Pack",
    price: "$20",
    period: "one-time bundle (+30% Bonus)",
    description:
      "Maximum acceleration: 2,600 lifetime tokens + VIP priority in daily scraper delivery queue.",
    badge: "Best Value",
    features: [
      "2,600 AI Tokens (+600 Bonus, Lifetime Validity)",
      "30 Days VIP Priority Daily AI Scraped Matches",
      "~65 Complete Application Suites",
      "260 Deep ATS Audits or 130 Cover Letters",
      "Scraper Top-Queue Delivery Every Morning",
      "Unlimited Saved Resumes & Deadline Alerts",
    ],
    ctaText: "Get Ultra Pack ($20)",
    ctaHref: "/pricing",
  },
  {
    id: "annual",
    name: "Annual VIP Pass",
    price: "$50",
    period: "full 1-year pass (Save 58%)",
    description:
      "All-in-one VIP access: 7,000 lifetime tokens + 365 days of automated daily scraping delivery.",
    badge: "1 Year VIP • Best Value",
    features: [
      "7,000 AI Tokens (+75% Mega Bonus, Lifetime Validity)",
      "365 Days of Automated Daily AI Scraped Matches",
      "~175 Complete Application Suites",
      "Top VIP Priority in Daily Scraper Queue (20 jobs/day)",
      "1-Click Tailored Cover Letters & Instant ATS Checks",
      "Unlimited Resumes & Priority Support",
    ],
    ctaText: "Get Annual VIP ($50)",
    ctaHref: "/pricing",
  },
];

export function LandingPricing() {
  return (
    <section
      id="pricing"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Combined Career Acceleration Bundles</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Transparent Pricing with Lifetime Tokens & Daily AI Matches
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Zero token expiration. Every bundle gives you lifetime AI tokens for
            ATS audits and custom cover letters, plus{" "}
            <strong className="text-slate-900 dark:text-white">
              automated daily web scraping
            </strong>{" "}
            delivering up to 20 tailored job matches directly to your dashboard.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const isHighlight = plan.highlighted;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  isHighlight
                    ? "bg-slate-900 dark:bg-slate-900 text-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 scale-100 md:-translate-y-2"
                    : "bg-white dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white bg-blue-600 shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3
                    className={`text-lg font-bold ${isHighlight ? "text-white" : "text-slate-900 dark:text-white"}`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${isHighlight ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold font-space-grotesk tracking-tight">
                      {plan.price}
                    </span>
                    <span
                      className={`text-xs font-medium ${isHighlight ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      /{plan.period}
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    className={`my-6 border-t ${isHighlight ? "border-slate-800" : "border-slate-100 dark:border-slate-800"}`}
                  />

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2.5 text-xs sm:text-sm"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${isHighlight ? "text-blue-400" : "text-blue-600"}`}
                        />
                        <span
                          className={
                            isHighlight
                              ? "text-slate-200"
                              : "text-slate-600 dark:text-slate-300"
                          }
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-4">
                  <Link
                    href={plan.ctaHref}
                    className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm ${
                      isHighlight
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Callout */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Lifetime Token Guarantee:</span>
          </div>
          <span>
            Your AI tokens never expire even after your active scraping window.
            Renew anytime to resume daily scraped job matching.
          </span>
        </div>
      </div>
    </section>
  );
}
