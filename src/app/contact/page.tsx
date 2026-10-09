"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  MessageSquare,
  Send,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { LandingFooter, LandingNavbar } from "@/components/landing";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Technical Support",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSubmitted(true);
        toast.success(data.message || "Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          subject: "Technical Support",
          message: "",
        });
      } else {
        toast.error(
          data.error || "Failed to submit message. Please try again.",
        );
      }
    } catch {
      toast.error(
        "Failed to connect. Please send an email directly to support@careergraph.com",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <LandingNavbar />

      <main className="flex-1 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-3">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>We&apos;re Here to Help</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
              Contact & Customer Support
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Have questions about your token balance, daily job match delivery,
              or billing? Our engineering and support team is ready to assist
              you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Contact Details & Channels (Left) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Channel Cards */}
              <div className="rounded-2xl p-6 bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Direct Email Support
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    For all general, billing, and technical inquiries:
                  </p>
                  <a
                    href="mailto:support@careergraph.com"
                    className="inline-block mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    support@careergraph.com
                  </a>
                </div>
              </div>

              <div className="rounded-2xl p-6 bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Guaranteed Response SLA
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    We process and reply to inquiries within:
                  </p>
                  <div className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    12 to 24 Business Hours
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-600/10 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Billing & Polar Refund Inquiries
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Have an issue with a transaction or Polar checkout? Please
                    include your <strong>Checkout ID</strong> or{" "}
                    <strong>Account Email</strong> for instant resolution.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form (Right) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl">
                {isSubmitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Message Received!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Career Graph. A support ticket
                      has been created and an engineer will reply to your email
                      within 12–24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Send Us a Message
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Fill out the details below and we&apos;ll get back to
                        you directly.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                        >
                          Your Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="e.g. Alex Johnson"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                        >
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="alex@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Inquiry Category
                      </label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="Technical Support">
                          Technical Support / Bug Report
                        </option>
                        <option value="Billing & Token Packages">
                          Billing & Token Packages
                        </option>
                        <option value="Daily AI Matches Question">
                          Daily AI Matches & Scraping
                        </option>
                        <option value="Refund Request">Refund Request</option>
                        <option value="Feature Suggestion">
                          Feature Suggestion & Feedback
                        </option>
                        <option value="Other">Other Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Your Message <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        placeholder="Please describe how we can assist you..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Submitting inquiry...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Quick FAQ Strip */}
          <div className="mt-16 sm:mt-20 border-t border-slate-200 dark:border-slate-800 pt-12">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-space-grotesk">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Quick answers to common questions before reaching out.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Do AI tokens expire?</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  No. All purchased AI Diamond Tokens carry lifetime validity.
                  They never expire, even after your 30-day automated scraping
                  period finishes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  <HelpCircle className="w-4 h-4" />
                  <span>How does job matching work?</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Our scraper engine aggregates real job openings every morning
                  and runs AI semantic keyword alignment against your resume
                  skills and target role.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Can I request a refund?</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Yes. We offer a fair 7-day money-back guarantee for unused
                  token packages if you have consumed less than 10% of the
                  purchased tokens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
