import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Lock,
  Shield,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter, LandingNavbar } from "@/components/landing";

export const metadata: Metadata = {
  title: "Privacy Policy | Career Graph",
  description:
    "Learn how Career Graph protects candidate privacy, secures uploaded resumes, and maintains strict confidentiality during AI processing.",
};

export default function PrivacyPolicyPage() {
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
              <Shield className="w-3.5 h-3.5" />
              <span>Candidate Data Protection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
              Privacy Policy
            </h1>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Effective Date & Last Updated: {lastUpdated}</span>
            </div>
          </div>

          {/* Content Document */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 text-sm sm:text-base leading-relaxed">
            {/* Summary Box */}
            <div className="not-prose p-5 sm:p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 text-xs sm:text-sm space-y-3">
              <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300">
                <Sparkles className="w-4 h-4" />
                <span>Our Privacy Promise to Candidates</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Career Graph is built to empower job seekers. We respect your
                personal privacy:{" "}
                <strong>
                  we never sell your resumes or personal contact details to
                  third-party advertisers
                </strong>
                , and we never use your private resume text to train public AI
                foundation models.
              </p>
            </div>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                1. Information We Collect
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                We only collect information necessary to provide you with
                tailored job recommendations, ATS scoring, and AI application
                tools:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-5">
                <li>
                  <strong>Account Credentials:</strong> Your name, email
                  address, and encrypted password hash when registering for an
                  account.
                </li>
                <li>
                  <strong>Resume & Career Profile:</strong> Uploaded resume
                  files (PDF, DOCX, TXT), extracted skill tags, employment
                  history, education, and your stated target seeking role.
                </li>
                <li>
                  <strong>Job Applications & Bookmarks:</strong> Records of
                  positions you track, custom notes, interview dates, and
                  wishlist items.
                </li>
                <li>
                  <strong>Payment & Billing Data:</strong> All transactions are
                  processed securely through our merchant partner,{" "}
                  <strong>Polar.sh</strong> (powered by Stripe). Career Graph
                  never stores your raw credit card numbers or banking secrets.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                2. How We Use Your Information
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Your data is utilized strictly to deliver and improve our career
                services:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Daily AI Job Matching</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comparing scraped market opportunities against your target
                    role and skills.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>ATS Resume Audits</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Calculating formatting scores and suggesting industry
                    keywords.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Cover Letter Drafting</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generating role-tailored letters prefilled with your
                    relevant experience.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Account Support</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Responding to customer inquiries, token queries, and billing
                    issues.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                3. Artificial Intelligence & Third-Party Processing
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                To power features such as the ATS Checker and Cover Letter
                Architect, Career Graph securely interfaces with the Google
                Gemini API.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Enterprise Privacy Guarantee</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Data sent to the Google Gemini API is encrypted via TLS during
                  transit and processed ephemeral-only. Under Google Enterprise
                  API terms, your submitted resumes and queries are{" "}
                  <strong>
                    not used to train or refine Google&apos;s machine learning
                    models
                  </strong>
                  .
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                4. Automated Job Scraping Transparency
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Our automated scraping engine aggregates publicly accessible job
                postings from reputable hiring platforms (including LinkedIn,
                Indeed, and company careers pages). Career Graph strictly
                indexes public job descriptions and application URLs; we do not
                scrape or access any private employer internal systems.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                5. Data Retention & Your Right to Delete
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                We believe candidates should have full autonomy over their
                career records:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-5">
                <li>
                  <strong>Resume Deletion:</strong> You can delete any uploaded
                  resume or cover letter draft at any time from your dashboard,
                  which immediately removes the document and extracted text from
                  our database.
                </li>
                <li>
                  <strong>Full Account Erasure:</strong> You may request
                  complete account and data deletion at any time via Settings or
                  by emailing{" "}
                  <a
                    href="mailto:support@careergraph.com"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    support@careergraph.com
                  </a>
                  .
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                6. GDPR & CCPA Compliance
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Depending on your location, you hold statutory privacy rights
                under regulations such as the European General Data Protection
                Regulation (GDPR) and the California Consumer Privacy Act
                (CCPA), including:
              </p>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc pl-5">
                <li>
                  The right to access and receive a copy of your personal data.
                </li>
                <li>The right to rectify inaccurate personal information.</li>
                <li>
                  The right to request data portability and complete erasure.
                </li>
                <li>
                  The right not to be discriminated against for exercising
                  privacy rights.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                7. Contact Our Privacy Officer
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                If you have questions, concerns, or requests regarding this
                Privacy Policy or your personal information, please reach out
                to:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-white">
                  Career Graph Privacy & Security Team
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
                  Response Window: Within 24 business hours
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
