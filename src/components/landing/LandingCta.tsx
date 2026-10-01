"use client";

import {
  ArrowRight,
  Coins,
  Globe2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

export function LandingCta() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-linear-to-br from-slate-900 via-indigo-950 to-blue-950 text-white overflow-hidden shadow-2xl border border-blue-500/20">
          {/* Glowing background shapes */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Start Free • Instant Access
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-space-grotesk text-white">
              Ready to Turn Job Hunting into an{" "}
              <span className="bg-linear-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Unfair Advantage?
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Stop settling for generic templates and spreadsheet
              disorganization. Let autonomous AI deconstruct job specs,
              calculate your ATS score, and accelerate your interview pipeline.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/register"
                prefetch={false}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-sm text-slate-950 bg-white hover:bg-slate-100 shadow-lg shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
              <Link
                href="/job-market"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all hover:scale-[1.02]"
              >
                <Globe2 className="w-4 h-4 text-cyan-300" />
                <span>Explore Job Market Directory</span>
              </Link>
            </div>

            {/* Guarantees */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                50 Free Tokens on Signup + 20 on OTP
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                No credit card required • Tokens never expire
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                Instant ATS Scan & Cover Letter Gen
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
