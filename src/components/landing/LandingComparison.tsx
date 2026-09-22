"use client";

import { Check, Sparkles, X } from "lucide-react";

export function LandingComparison() {
  const comparisonRows = [
    {
      feature: "Finding Top Tech Marketplaces",
      traditional:
        "Scattered bookmarks, manual searching across 10 different tabs",
      careerGraph:
        "Unified Curated Directory with 1-click tracking & Google Favicons",
    },
    {
      feature: "ATS Keyword & Format Audit",
      traditional:
        "Paying $50/month on Jobscan or guessing why automated filters reject you",
      careerGraph:
        "4-Pillar AI audit (Formatting, Keywords, Impact, Structure) + Word/PDF export",
    },
    {
      feature: "Job Data Entry",
      traditional:
        "Tediously copy-pasting title, company, salary, and requirements",
      careerGraph:
        "1-Click AI URL Extractor auto-fills all fields in under 3 seconds",
    },
    {
      feature: "Cover Letter Customization",
      traditional:
        "Generic, robotic copy-paste templates that recruiters immediately ignore",
      careerGraph:
        "Role-specific letters weaving your real accomplishments & metrics",
    },
    {
      feature: "Pipeline Tracking",
      traditional:
        "Clunky Excel or Notion spreadsheets that quickly get out of date",
      careerGraph:
        "Dynamic Kanban workflow with interview schedules & salary stats",
    },
    {
      feature: "Pricing & Billing Model",
      traditional:
        "$30–$50/mo auto-renewing subscriptions that bill you even after you find a job",
      careerGraph:
        "Fair Pay-as-you-go tokens from $5 (~$0.10/scan). 70 Free welcome tokens. Never expire.",
    },
    {
      feature: "AI Interview Preparation",
      traditional:
        "Expensive $100+/hr mock interview coaches or reciting answers alone in the mirror",
      careerGraph:
        "Interactive AI Mock Interviewer simulating realistic role-specific questions with instant feedback",
    },
  ];

  return (
    <section
      id="comparison"
      className="py-20 sm:py-28 bg-slate-50/50 dark:bg-slate-900/40 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            The Career Graph Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
            Traditional Job Hunting vs.{" "}
            <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Career Graph AI
            </span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            See how autonomous AI eliminates the friction, rejection, and
            disorganization of modern job seeking.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl shadow-blue-500/5">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 font-space-grotesk">
                    <th className="py-4 px-6 font-bold text-slate-900 dark:text-white w-1/3">
                      Workflow Capability
                    </th>
                    <th className="py-4 px-6 font-bold text-slate-500 dark:text-slate-400 w-1/3">
                      Old-School Method
                    </th>
                    <th className="py-4 px-6 font-bold text-blue-600 dark:text-blue-400 w-1/3 bg-blue-50/50 dark:bg-blue-950/30">
                      Career Graph with AI ✨
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {comparisonRows.map((row) => (
                    <tr
                      key={row.feature}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                        {row.feature}
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                        <div className="flex items-start gap-2">
                          <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-800 dark:text-slate-200 bg-blue-50/20 dark:bg-blue-950/15 font-medium">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{row.careerGraph}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
