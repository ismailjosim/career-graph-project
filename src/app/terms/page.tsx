import { AlertTriangle, ArrowLeft, Calendar, Scale } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter, LandingNavbar } from "@/components/landing";

export const metadata: Metadata = {
  title: "Terms of Service | Career Graph",
  description:
    "Read the Terms of Service governing your use of Career Graph's AI tools, automated job matching, lifetime token bundles, and platform features.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "October 10, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <LandingNavbar />

      <main className="flex-1 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-4">
              <Scale className="w-3.5 h-3.5" />
              <span>Platform Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
              Terms of Service
            </h1>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Effective Date & Last Updated: {lastUpdated}</span>
            </div>
          </div>

          {/* Content Document */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 text-sm sm:text-base leading-relaxed">
            {/* Agreement Intro */}
            <p className="text-slate-600 dark:text-slate-300">
              Welcome to <strong>Career Graph</strong>. By creating an account,
              accessing our web applications, purchasing AI token packages, or
              utilizing our daily job matching features, you agree to be bound
              by these Terms of Service (&quot;Terms&quot;). If you do not agree
              to these Terms, please refrain from using the platform.
            </p>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                1. Description of Services
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Career Graph provides an autonomous job application tracking
                suite equipped with artificial intelligence tools. Core platform
                capabilities include:
              </p>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc pl-5">
                <li>
                  Automated daily scraping of public market job opportunities
                  tailored to candidate profiles.
                </li>
                <li>
                  ATS (Applicant Tracking System) resume compatibility audits
                  and keyword optimization.
                </li>
                <li>
                  AI-tailored cover letter drafts and role-fit score
                  evaluations.
                </li>
                <li>
                  Kanban job pipeline tracking, bookmarking, and interview
                  milestone management.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <span>2. AI Outputs & Employment Disclaimer</span>
              </h2>
              <div className="not-prose p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Important Disclaimer on Hiring Outcomes</span>
                </div>
                <p className="leading-relaxed">
                  Career Graph offers algorithmic match scores, keyword
                  suggestions, and AI drafting assistance.{" "}
                  <strong>
                    We do not guarantee job interviews, offers, or employment.
                  </strong>{" "}
                  Hiring decisions are made solely by independent third-party
                  employers. You are solely responsible for reviewing and
                  verifying the accuracy and truthfulness of all resumes and
                  cover letters before submitting them to recruiters.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                3. AI Diamond Tokens & Plan Validity
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Career Graph operates a hybrid token and scraping service model:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-5">
                <li>
                  <strong>Lifetime Token Validity:</strong> All purchased AI
                  Diamond Tokens (e.g. 500, 1,150, 2,600, or 7,000 tokens){" "}
                  <strong>never expire</strong>. Unused tokens remain
                  permanently valid in your account for ATS checks, cover
                  letters, and fit analyses.
                </li>
                <li>
                  <strong>Daily AI Scraped Matches Window:</strong> Standard
                  bundles (Starter, Pro, Ultra) provide <strong>30 days</strong>{" "}
                  of automated daily scraping delivery. The Annual VIP Pass
                  provides <strong>365 days (1 full year)</strong> of VIP
                  priority daily scraping.
                </li>
                <li>
                  <strong>Post-Window Access:</strong> When your 30-day or
                  365-day delivery window concludes, automated daily scraping
                  delivery pauses, but your account, application tracking
                  history, saved resumes, and unused tokens remain completely
                  accessible without recurring subscription fees.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                4. Billing & Payment Gateway
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                All payments on Career Graph are securely processed through our
                Merchant of Record partner, <strong>Polar.sh</strong> (in
                partnership with Stripe). By purchasing a package:
              </p>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc pl-5">
                <li>
                  You authorize Polar to charge your chosen payment method for
                  the specified one-time package amount.
                </li>
                <li>
                  All prices are clearly stated in USD ($) and do not feature
                  deceptive hidden recurring billing loops.
                </li>
                <li>
                  Refund eligibility is governed by our published Refund &
                  Cancellation Policy.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                5. External Job Postings & Links
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Job postings displayed in the Daily Matches feed and Marketplace
                originate from third-party websites (e.g. LinkedIn, company
                career portals). Career Graph does not control, endorse, or
                verify third-party employment terms, salary guarantees, or
                recruiter validity. Users should exercise prudence when
                submitting sensitive information to external hiring sites.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                6. User Conduct & Acceptable Use
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                You agree not to misuse Career Graph services. Prohibited
                actions include:
              </p>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc pl-5">
                <li>
                  Attempting to bypass API rate limits, authentication tokens,
                  or token balances.
                </li>
                <li>
                  Uploading malicious payloads, virus-infected resumes, or
                  defamatory documents.
                </li>
                <li>
                  Using automated scripts to scrape or overload Career Graph
                  infrastructure.
                </li>
                <li>
                  Sharing your account credentials with multiple commercial
                  entities.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                7. Limitation of Liability
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                To the fullest extent permitted by law, Career Graph and its
                operators shall not be liable for any indirect, incidental,
                punitive, or consequential damages resulting from your use of
                the platform, third-party job listings, or recruitment outcomes.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                8. Contact Information
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Questions regarding these Terms of Service may be submitted to:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-white">
                  Career Graph Legal Team
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Email:{" "}
                  <a
                    href="mailto:support@careergraph.com"
                    className="text-blue-600 dark:text-blue-400 underline font-medium"
                  >
                    support@careergraph.com
                  </a>
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Address & Inquiry Portal:{" "}
                  <Link
                    href="/contact"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    careergraph.com/contact
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
