import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  Mail,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter, LandingNavbar } from "@/components/landing";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Career Graph",
  description:
    "Review Career Graph's fair 7-day money-back guarantee, token usage terms, and transparent cancellation policies for AI packages.",
};

export default function RefundPolicyPage() {
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
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Customer Satisfaction Guarantee</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
              Refund & Cancellation Policy
            </h1>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Effective Date & Last Updated: {lastUpdated}</span>
            </div>
          </div>

          {/* Content Document */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 text-sm sm:text-base leading-relaxed">
            {/* Guarantee Highlight Callout */}
            <div className="not-prose p-5 sm:p-6 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-900 dark:text-emerald-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 text-sm sm:text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Our 7-Day Fair Money-Back Guarantee</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">
                We want you to be completely satisfied with Career Graph. If you
                purchase any token package (Starter, Pro, Ultra, or Annual VIP)
                and find that our platform does not suit your job search, you
                may request a{" "}
                <strong>100% full refund within 7 days of purchase</strong>,
                provided you have consumed less than 10% of the package&apos;s
                token balance.
              </p>
            </div>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                1. Token Nature & Digital Consumption
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Career Graph provides instant access to advanced AI computing
                power (powered by the Google Gemini API). Because computational
                costs are incurred in real-time when generating ATS audits,
                cover letters, and fit analysis reports:
              </p>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc pl-5">
                <li>
                  Tokens that have already been consumed for AI features cannot
                  be refunded once used.
                </li>
                <li>
                  Refunds apply exclusively to packages where the user has
                  utilized less than 10% of the purchased tokens.
                </li>
                <li>
                  Upon issuing a refund, the package tokens and active scraping
                  delivery window are cancelled.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                2. Automated Job Scraping & No Recurring Trap
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                We respect your budget. All Career Graph token packages are{" "}
                <strong>one-time purchases</strong>, not hidden subscription
                traps:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>No Automatic Renewal Charges</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    When your 30-day or 365-day scraping delivery finishes, you
                    will never be silently billed again.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>Lifetime Token Retention</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Any remaining token balance stays permanently in your
                    account. You can use them for ATS audits anytime.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                3. How to Request a Refund
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Requesting a refund is quick and straightforward. You do not
                need to navigate through complex menus:
              </p>
              <div className="not-prose p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Send an Email to Our Billing Desk</span>
                </div>
                <div className="space-y-1 text-slate-600 dark:text-slate-300">
                  <p>
                    Send an email to{" "}
                    <a
                      href="mailto:support@careergraph.com"
                      className="text-blue-600 dark:text-blue-400 font-semibold underline"
                    >
                      support@careergraph.com
                    </a>{" "}
                    with the subject line:{" "}
                    <strong>&quot;Refund Request - [Your Email]&quot;</strong>.
                  </p>
                  <p>Please include:</p>
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-500 dark:text-slate-400">
                    <li>Your registered Career Graph account email</li>
                    <li>
                      The Polar Checkout / Order ID (found on your payment
                      receipt)
                    </li>
                    <li>
                      A brief sentence describing why the product did not fit
                      your needs (helps us improve)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                4. Processing Timeframes
              </h2>
              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>
                    <strong>Review & Approval:</strong> Inquiries are reviewed
                    and approved within <strong>12 to 24 business hours</strong>
                    .
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    <strong>Bank Credit:</strong> Once approved via Polar /
                    Stripe, refunds typically reflect on your bank or credit
                    card statement in <strong>3 to 5 business days</strong>.
                  </span>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                5. Chargebacks & Friendly Resolution
              </h2>
              <div className="not-prose p-4 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-xs sm:text-sm space-y-2 text-amber-900 dark:text-amber-200">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>Please Reach Out to Us First</span>
                </div>
                <p className="leading-relaxed">
                  Bank disputes and chargebacks take up to 60 days to resolve
                  through credit card intermediaries. If you experience an
                  unrecognized transaction or dissatisfaction, reaching out to{" "}
                  <a
                    href="mailto:support@careergraph.com"
                    className="underline font-bold"
                  >
                    support@careergraph.com
                  </a>{" "}
                  allows us to resolve and process your refund within 24 hours
                  directly.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
