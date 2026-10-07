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
    id: "free",
    name: "Free Explorer",
    price: "$0",
    period: "forever",
    description: "Essential tools for casual job seekers and portfolio review.",
    features: [
      "Access to public job directory",
      "Upload 1 resume & portfolio link",
      "Manual job application tracking (up to 15 jobs)",
      "Standard community support",
    ],
    ctaText: "Get Started Free",
    ctaHref: "/signup",
  },
  {
    id: "monthly-pro",
    name: "Job Hunter Pro",
    price: "$3",
    period: "per month",
    description:
      "Full automated companion that hunts and matches jobs for you daily.",
    badge: "Recommended",
    highlighted: true,
    features: [
      "Daily automated web scraping from 10+ platforms (LinkedIn, Indeed, Otta)",
      "10 to 15 AI-matched job suggestions delivered daily to your dashboard",
      "High-fit scoring & missing skill breakdown against your resume",
      "Unlimited Kanban job application pipeline",
      "Automated interview date tracker & calendar reminders",
      "ATS keyword scan & custom cover letter generator",
    ],
    ctaText: "Start Pro Monthly",
    ctaHref: "/signup?plan=pro-monthly",
  },
  {
    id: "annual-pro",
    name: "Career Pass (Annual)",
    price: "$24",
    period: "per year ($2/mo)",
    description:
      "Best value for long-term career growth, promotions & role transitions.",
    badge: "Save 33%",
    features: [
      "Everything in Job Hunter Pro",
      "Priority AI matchmaking engine queue",
      "Multi-resume support (Tailor for multiple roles)",
      "Direct recruiter contact intelligence",
      "365 days of active job hunting automation",
    ],
    ctaText: "Get Annual Pass",
    ctaHref: "/signup?plan=pro-annual",
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
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple Monthly Subscription</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Transparent Pricing for Serious Job Seekers
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            No expensive $50/mo agency fees. Pay a tiny monthly flat fee to let
            our system scrape, analyze, and deliver 10–15 perfectly matched jobs
            directly to your portfolio every single day.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
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
        <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>
            Cancel anytime in one click. No hidden contracts or long-term
            commitments.
          </span>
        </div>
      </div>
    </section>
  );
}
