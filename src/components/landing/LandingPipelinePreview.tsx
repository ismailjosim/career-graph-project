"use client";

import { ArrowRight, Building, Clock, DollarSign, Layers } from "lucide-react";
import Link from "next/link";

export function LandingPipelinePreview() {
  const columns = [
    {
      title: "Wishlist",
      count: 4,
      color:
        "border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40",
      badge:
        "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
      cards: [
        {
          role: "Senior AI Engineer",
          company: "Anthropic",
          location: "San Francisco, CA • Hybrid",
          salary: "$240,000 - $310,000",
          atsScore: "95%",
          date: "Added yesterday",
        },
        {
          role: "Lead Product Designer",
          company: "Linear",
          location: "Remote Worldwide",
          salary: "$180,000 - $220,000",
          atsScore: "91%",
          date: "Added 3d ago",
        },
      ],
    },
    {
      title: "Applied",
      count: 8,
      color:
        "border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20",
      badge: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
      cards: [
        {
          role: "Staff Frontend Architect",
          company: "Vercel",
          location: "Remote US / Global",
          salary: "$210,000 - $260,000",
          atsScore: "94%",
          date: "Submitted via AI Cover Letter",
        },
      ],
    },
    {
      title: "Interviewing",
      count: 3,
      color:
        "border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20",
      badge:
        "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
      cards: [
        {
          role: "Principal Systems Engineer",
          company: "Cloudflare",
          location: "Austin, TX • Hybrid",
          salary: "$225,000 - $275,000",
          atsScore: "96%",
          date: "Technical Round: Tomorrow 2:00 PM",
          highlight: true,
        },
      ],
    },
    {
      title: "Offer Received",
      count: 2,
      color:
        "border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20",
      badge:
        "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
      cards: [
        {
          role: "Senior Full-Stack Lead",
          company: "Stripe",
          location: "Remote Worldwide",
          salary: "$235,000 + Equity",
          atsScore: "98%",
          date: "Offer Review: Sep 15",
          success: true,
        },
      ],
    },
  ];

  return (
    <section
      id="pipeline"
      className="py-16 sm:py-20 lg:py-24 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/60 text-cyan-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            Autonomous Pipeline Management
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
            Never Lose an Opportunity in a Messy Spreadsheet
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Track every application status in real-time. Link tailored resumes,
            record interview dates, and see your conversion funnel with zero
            friction.
          </p>
        </div>

        {/* Interactive Kanban Board Simulation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {columns.map((col) => (
            <div
              key={col.title}
              className={`rounded-2xl p-4 border ${col.color} backdrop-blur-md flex flex-col`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm text-slate-900 dark:text-white font-space-grotesk">
                  {col.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badge}`}
                >
                  {col.count}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="space-y-3 flex-1">
                {col.cards.map((card) => (
                  <div
                    key={card.role}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all hover:border-blue-400 dark:hover:border-blue-600"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                        {card.role}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold shrink-0 border border-emerald-200 dark:border-emerald-800">
                        {card.atsScore}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-2 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {card.company}
                    </p>

                    <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-500" />
                        <span>{card.salary}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{card.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Link below preview */}
        <div className="mt-10 text-center">
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <span>View Full Interactive Application Tracker</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
