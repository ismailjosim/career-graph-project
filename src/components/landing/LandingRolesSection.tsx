"use client";

import {
  ArrowRight,
  Briefcase,
  Building,
  CheckCircle2,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LandingRolesSection() {
  const [activeRole, setActiveRole] = useState<
    "seeker" | "recruiter" | "employer" | "admin"
  >("seeker");

  const roles = [
    {
      id: "seeker",
      title: "Job Seekers",
      badge: "Candidate Engine",
      icon: Briefcase,
      color: "blue",
      heading: "Land Higher-Paying Roles in Half the Time",
      description:
        "Engineered for software engineers, product leaders, and digital specialists who want an unfair advantage in the hiring market.",
      features: [
        "AI ATS Fit scoring reveals keyword gaps before you apply",
        "Generate custom-tailored cover letters in under 3 seconds",
        "Organize multi-stage interviews and compensation offers",
        "One-click job extraction from LinkedIn, Indeed, and company boards",
      ],
      ctaText: "Start as a Job Seeker",
      ctaHref: "/register?role=job_seeker",
    },
    {
      id: "recruiter",
      title: "Recruiters & Headhunters",
      badge: "Talent Acquisition",
      icon: Users,
      color: "purple",
      heading: "Benchmark Compensation & Candidate Keyword Overlap",
      description:
        "Gain real-time visibility into hiring marketplaces, analyze JD clarity, and benchmark candidate profiles against live industry requirements.",
      features: [
        "Analyze job description keywords to maximize qualified applicant flow",
        "Cross-reference live salary brackets from 10+ tech marketplaces",
        "Track candidate pipelines and interview stages collaboratively",
        "Accelerate candidate screening with automated skill extraction",
      ],
      ctaText: "Join as a Recruiter",
      ctaHref: "/register?role=recruiter",
    },
    {
      id: "employer",
      title: "Employers & Founders",
      badge: "Hiring Teams",
      icon: Building,
      color: "teal",
      heading: "Attract High-Caliber Talent with Optimized Listings",
      description:
        "Understand what top talent looks for, verify your job specifications against market standards, and organize internal hiring pipelines.",
      features: [
        "Audit job postings against ATS filters to ensure broad reach",
        "Monitor competitor listings across startup and remote marketplaces",
        "Manage applicant records with zero spreadsheet sprawl",
        "Role-based security controls for your recruiting team",
      ],
      ctaText: "Register as an Employer",
      ctaHref: "/register?role=employer",
    },
    {
      id: "admin",
      title: "Admins & Governance",
      badge: "Enterprise Security",
      icon: ShieldCheck,
      color: "amber",
      heading: "Fine-Grained Role-Based Access Control (RBAC)",
      description:
        "A dedicated administrative suite at /users providing full lifecycle governance, role distribution metrics, and singleton Super Admin security.",
      features: [
        "Strict Singleton Super Admin architecture prevents unauthorized takeovers",
        "Manage, filter, and audit all platform users with instant role updates",
        "Granular 403 Forbidden permission barriers on sensitive endpoints",
        "Real-time role distribution metrics across all 5 system roles",
      ],
      ctaText: "Admin User Management",
      ctaHref: "/users",
    },
  ];

  const current = roles.find((r) => r.id === activeRole) || roles[0];

  return (
    <section id="roles" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            Built for Every Career Stakeholder
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
            Tailored Experiences for Every Role
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Whether you&apos;re hunting for your dream engineering role,
            sourcing specialized talent, or managing platform security, Career
            Graph adapts to your workflow.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-10 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = activeRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() =>
                  setActiveRole(
                    r.id as "seeker" | "recruiter" | "employer" | "admin",
                  )
                }
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md shadow-black/5"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 text-blue-500" />
                <span>{r.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Card */}
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
