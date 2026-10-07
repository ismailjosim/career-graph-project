"use client";

import {
  ArrowRight,
  CheckCircle2,
  Code2,
  GraduationCap,
  Palette,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LandingRolesSection() {
  const [activePersona, setActivePersona] = useState<
    "engineers" | "product" | "transitioners" | "leaders"
  >("engineers");

  const personas = [
    {
      id: "engineers",
      title: "Software Engineers",
      badge: "Technical Roles",
      icon: Code2,
      color: "blue",
      heading: "Pass Technical ATS Filters & Highlight Hard Skills",
      description:
        "Engineered for developers, architects, and DevOps specialists to deconstruct complex job specs, match technical frameworks, and beat strict keyword parsing.",
      features: [
        "Extract core frameworks, languages & cloud stacks from any job listing",
        "Deep 4-pillar ATS Fit score reveals missing technical keywords before you apply",
        "Generate custom-tailored cover letters weaving your real GitHub accomplishments",
        "Practice realistic coding, architecture & system design mock interviews with instant AI feedback",
      ],
      ctaText: "Start as an Engineer",
      ctaHref: "/register",
    },
    {
      id: "product",
      title: "Product & Designers",
      badge: "Product & UX",
      icon: Palette,
      color: "purple",
      heading: "Showcase Measurable Impact & Design Strategy",
      description:
        "Crafted for product managers, UI/UX designers, and growth leaders who need their resumes to tell a compelling story backed by measurable metrics.",
      features: [
        "AI transforms raw bullet points into high-impact metric statements using the Google XYZ formula",
        "Tailored cover letters highlighting product roadmap vision and cross-functional leadership",
        "Audit design, research, and portfolio resume layouts for maximum ATS readability",
        "Organize multi-stage portfolio presentations, design challenges, and stakeholder rounds",
      ],
      ctaText: "Start as a Product Lead",
      ctaHref: "/register",
    },
    {
      id: "transitioners",
      title: "Career Switchers & Grads",
      badge: "Career Transition",
      icon: GraduationCap,
      color: "teal",
      heading: "Bridge the Keyword Gap with Transferable Skills",
      description:
        "Built for bootcamp graduates, new college alumni, and professionals pivoting into tech without letting past experience go to waste.",
      features: [
        "Surface and articulate transferable skills from past industries and capstone projects",
        "ATS score benchmark highlights rookie formatting pitfalls and keyword omissions",
        "Generate punchy, persuasive cover letters explaining your unique career trajectory",
        "Craft clean, ATS-compliant resumes with pre-built professional templates",
      ],
      ctaText: "Accelerate Your Transition",
      ctaHref: "/register",
    },
    {
      id: "leaders",
      title: "Senior & Leadership",
      badge: "Executive Tier",
      icon: TrendingUp,
      color: "amber",
      heading: "Benchmark Executive Pay & Track Multi-Offer Pipelines",
      description:
        "Tailored for directors, staff engineers, and VP-level talent navigating confidential searches, high-stakes panel interviews, and complex negotiations.",
      features: [
        "Executive resume review emphasizing business ROI, team scaling, and revenue impact",
        "Benchmark base and equity compensation against verified tech market brackets",
        "Track confidential multi-stage executive panels and offers side-by-side",
        "Simulate high-stakes behavioral and leadership situational interviews",
      ],
      ctaText: "Advance to Leadership",
      ctaHref: "/register",
    },
  ];

  const current = personas.find((p) => p.id === activePersona) || personas[0];

  return (
    <section
      id="personas"
      className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            Tailored for Every Career Path
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
            Engineered for Every Tech Job Seeker
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Whether you&apos;re breaking into tech, scaling your engineering
            career, or landing executive leadership roles, Career Graph adapts
            to your trajectory.
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-10 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
          {personas.map((p) => {
            const Icon = p.icon;
            const isSelected = activePersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() =>
                  setActivePersona(
                    p.id as
                      | "engineers"
                      | "product"
                      | "transitioners"
                      | "leaders",
                  )
                }
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md shadow-black/5"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 text-blue-500" />
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Card */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-500/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                {current.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-space-grotesk mt-3">
                {current.heading}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                {current.description}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {current.features.map((feat) => (
              <div
                key={feat}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  {feat}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Ready to get started in seconds?
            </span>
            <Link
              href={current.ctaHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm transition-all"
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
