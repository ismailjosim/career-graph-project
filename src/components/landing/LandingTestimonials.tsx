"use client";

import { Star } from "lucide-react";

export function LandingTestimonials() {
  const reviews = [
    {
      name: "Alex Rivera",
      role: "Staff Frontend Engineer",
      company: "Landed role @ Stripe",
      quote:
        "The AI Fit Analyzer caught 3 missing distributed system keywords on my resume that I completely overlooked. After tweaking it based on the recommendation, I got invited to an interview within 48 hours.",
      avatar: "AR",
      color: "from-blue-600 to-indigo-600",
    },
    {
      name: "Samantha Chen",
      role: "Senior Product Designer",
      company: "Landed role @ Linear",
      quote:
        "Generating cover letters used to take me 45 minutes per company. Career Graph's AI weaves my actual Figma design system metrics into the letter in 3 seconds. It felt genuinely personalized, not robotic.",
      avatar: "SC",
      color: "from-purple-600 to-pink-600",
    },
    {
      name: "Marcus Vance",
      role: "Technical Talent Lead",
      company: "Series B AI Startup",
      quote:
        "As a recruiter, the curated marketplace directory and ATS keyword breakdown helps us benchmark what top engineers actually have on their resumes. Super clean UX and unmatched speed.",
      avatar: "MV",
      color: "from-teal-600 to-emerald-600",
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
            Candidate Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
            Loved by Engineers, Designers & Hiring Teams
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Real stories from ambitious professionals who took control of their
            job search.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md shadow-blue-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`rev-${rev.name}-${i}`}
                      className="w-4 h-4 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed italic mb-6">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div
                  className={`w-10 h-10 rounded-full bg-linear-to-tr ${rev.color} text-white font-bold flex items-center justify-center text-xs`}
                >
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {rev.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {rev.role} •{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {rev.company}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
