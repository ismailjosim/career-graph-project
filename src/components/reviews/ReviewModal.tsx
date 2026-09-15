"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  UserCheck,
  Building2,
  Trash2,
  Loader2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import type { ReviewRole } from "@/lib/validation";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ROLE_TAGS: Record<ReviewRole, string[]> = {
  job_seeker: [
    "AI Fit Analyzer",
    "Resume Optimizer",
    "Cover Letters",
    "Pipeline Tracker",
    "Interview Prep",
    "Saved Time",
  ],
  recruiter: [
    "Fast Screening",
    "High Quality Candidates",
    "ATS Benchmarks",
    "Clean UI",
    "Time Saver",
  ],
  employer: [
    "Quality Hires",
    "Reduced Time-to-Hire",
    "Bot-Free Applicants",
    "Smooth Onboarding",
  ],
};

const RATING_LABELS = [
  "",
  "Needs Improvement",
  "Fair Experience",
  "Good Platform",
  "Very Impressive",
  "Exceptional Experience!",
];

export function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const { data: session } = useSession();
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [role, setRole] = useState<ReviewRole>("job_seeker");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState("");
  const [headline, setHeadline] = useState("");
  const [companyOrTarget, setCompanyOrTarget] = useState("");
  const [verifiedOutcome, setVerifiedOutcome] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch current user's existing review (if any) when modal opens
  useEffect(() => {
    if (!isOpen || !session?.user) return;

    let isMounted = true;
    setLoadingInitial(true);
    setError(null);
    setSuccessMessage(null);

    fetch("/api/reviews/me")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated && data.review) {
          const r = data.review;
          setIsUpdate(true);
          setRole(r.role || "job_seeker");
          setRating(r.rating || 5);
          setContent(r.content || "");
          setHeadline(r.headline || "");
          setCompanyOrTarget(r.companyOrTarget || "");
          setVerifiedOutcome(r.verifiedOutcome || "");
          setSelectedTags(r.tags || []);
        } else {
          setIsUpdate(false);
          // Set role based on user's profile if available
          const userRole = (session?.user as unknown as { role?: string })
            ?.role;
          if (userRole === "recruiter" || userRole === "employer") {
            setRole(userRole);
          } else {
            setRole("job_seeker");
          }
          setRating(5);
          setContent("");
          setHeadline("");
          setCompanyOrTarget("");
          setVerifiedOutcome("");
          setSelectedTags(["AI Fit Analyzer", "Resume Optimizer"]);
        }
      })
      .catch((err) => {
        console.error("Failed to load user review:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingInitial(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, session?.user]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError("Please sign in to submit a review.");
      return;
    }

    if (content.trim().length < 10) {
      setError("Review must be at least 10 characters long.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          rating,
          content: content.trim(),
          headline: headline.trim(),
          companyOrTarget: companyOrTarget.trim(),
          verifiedOutcome: verifiedOutcome.trim(),
          tags: selectedTags,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccessMessage(
        isUpdate
          ? "Your review has been successfully updated!"
          : "Thank you! Your verified review is now live.",
      );
      setIsUpdate(true);

      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews/me", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete review");
      }

      setIsUpdate(false);
      setContent("");
      setVerifiedOutcome("");
      setSuccessMessage("Review deleted successfully.");
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-space-grotesk">
                {isUpdate ? "Update Your Review" : "Share Your Experience"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1 verified review per account • Always editable
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!session?.user ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                  Sign in to leave a review
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  To keep all platform ratings authentic and verified, reviews
                  are linked to your verified Career Graph account.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all"
                >
                  Sign In to Continue
                </Link>
              </div>
            </div>
          ) : loadingInitial ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
              <p className="text-xs">Loading your profile review status...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Alert Status */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Persona / Role Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Your Perspective / Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("job_seeker")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      role === "job_seeker"
                        ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Job Seeker</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("recruiter")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      role === "recruiter"
                        ? "bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Recruiter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("employer")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      role === "employer"
                        ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Employer</span>
                  </button>
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Overall Rating
                  </label>
                  <span className="text-xs font-medium text-amber-500">
                    {RATING_LABELS[hoverRating || rating]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 rounded-lg hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                            : "text-slate-300 dark:text-slate-700 fill-transparent"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-300 font-space-grotesk">
                    {rating}.0
                  </span>
                </div>
              </div>

              {/* Verified Outcome / Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Title / Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Verified Outcome / Milestone
                  </label>
                  <input
                    type="text"
                    value={verifiedOutcome}
                    onChange={(e) => setVerifiedOutcome(e.target.value)}
                    placeholder="e.g. Landed role @ Stripe, Hired 2 Devs"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Tags Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Highlight Key Features (Select up to 5)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ROLE_TAGS[role].map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Your Review / Feedback
                  </label>
                  <span
                    className={`text-[10px] ${
                      content.length > 550 ? "text-amber-500" : "text-slate-400"
                    }`}
                  >
                    {content.length}/600 chars
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="How did Career Graph help you in your job search, recruiting, or hiring? Mention any specific features that made a difference..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                {isUpdate ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting || submitting}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {deleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Delete Review</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Posting as <strong>{session.user.name || "Member"}</strong>
                  </span>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || content.trim().length < 10}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    <span>{isUpdate ? "Save Changes" : "Submit Review"}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
