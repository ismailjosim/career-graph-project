"use client";

import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center p-1">
                  <Image
                    src="/career-graph.png"
                    alt="Career Graph"
                    width={26}
                    height={26}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <span className="font-bold text-lg font-space-grotesk tracking-tight text-slate-900 dark:text-white">
                Career Graph
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              The autonomous job application tracking platform with deep AI fit
              scoring, smart job extraction, custom cover letters, and a curated
              global job marketplace directory.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All AI Systems Operational</span>
            </div>
          </div>

          {/* AI Features */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-space-grotesk">
              AI Tools
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/ats-checker"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-emerald-600 dark:text-emerald-400"
                >
                  ATS Resume Checker ✨
                </Link>
              </li>
              <li>
                <Link
                  href="/fit-analysis"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  AI Fit Analyzer
                </Link>
              </li>
              <li>
                <Link
                  href="/applications/new"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Smart Job Extractor
                </Link>
              </li>
              <li>
                <Link
                  href="/cover-letters"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  AI Cover Letter Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/mock-interview"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  AI Mock Interview Prep
                </Link>
              </li>
              <li>
                <Link
                  href="/resumes"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Resume Intelligence Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace & Tracker */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-space-grotesk">
              Platform
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium text-amber-600 dark:text-amber-400"
                >
                  Pricing & Token Packs 🪙
                </Link>
              </li>
              <li>
                <Link
                  href="/job-market"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Job Marketplace Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/applications"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Wishlist & Bookmarks
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Candidate Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Community */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-space-grotesk">
              Account & Community
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/login"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  User Reviews & Wall of Love
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Account Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            &copy; {new Date().getFullYear()} Career Graph. All rights reserved.
            Powered by DeepMind & AI.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#marketplace" className="hover:underline">
              Job Market
            </Link>
            <Link href="#ai-features" className="hover:underline">
              AI Features
            </Link>
            <Link href="/login" className="hover:underline">
              Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
