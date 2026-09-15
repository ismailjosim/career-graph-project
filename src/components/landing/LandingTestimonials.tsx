"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Star,
  UserCheck,
  Briefcase,
  Building2,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { ReviewModal } from "@/components/reviews/ReviewModal";
import type { ReviewRole } from "@/lib/validation";

interface ReviewItem {
  _id: string;
  userId: string;
  authorName: string;
  authorImage?: string;
  role: ReviewRole;
  rating: number;
  content: string;
  headline?: string;
  companyOrTarget?: string;
  verifiedOutcome?: string;
  tags?: string[];
  status?: string;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  roleCounts: {
    all: number;
    job_seeker: number;
    recruiter: number;
    employer: number;
  };
}

const ROLE_BADGES: Record<
  ReviewRole,
  { label: string; color: string; icon: typeof UserCheck }
> = {
  job_seeker: {
    label: "Candidate",
    color:
      "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
    icon: UserCheck,
  },
  recruiter: {
    label: "Recruiter",
    color:
      "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60",
    icon: Briefcase,
  },
  employer: {
    label: "Employer",
    color:
      "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
    icon: Building2,
  },
};

const AVATAR_GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-purple-600 to-pink-600",
  "from-teal-600 to-emerald-600",
  "from-amber-600 to-orange-600",
  "from-rose-600 to-red-600",
  "from-cyan-600 to-blue-600",
];

export function LandingTestimonials() {
  const [activeTab, setActiveTab] = useState<"all" | ReviewRole>("all");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 6,
    averageRating: 5.0,
    roleCounts: { all: 6, job_seeker: 3, recruiter: 2, employer: 1 },
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        activeTab === "all" ? "/api/reviews" : `/api/reviews?role=${activeTab}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load dynamic reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Live Average Rating Pill */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wider mb-4">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span>
              {stats.averageRating.toFixed(1)} / 5.0 Rating • Verified Community
              Feedback
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
            Loved by Job Seekers, Recruiters & Employers
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Real outcomes from ambitious professionals, talent scouts, and
            hiring teams transforming their career workflows.
          </p>
        </div>

        {/* Filter Tabs & "Share Your Experience" Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Persona Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>All Stories</span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300">
                {stats.roleCounts.all}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("job_seeker")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "job_seeker"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Job Seekers</span>
              <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-[10px] text-blue-700 dark:text-blue-300">
                {stats.roleCounts.job_seeker}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("recruiter")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "recruiter"
                  ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Recruiters</span>
              <span className="px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/60 text-[10px] text-teal-700 dark:text-teal-300">
                {stats.roleCounts.recruiter}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("employer")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "employer"
                  ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Employers</span>
              <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-[10px] text-purple-700 dark:text-purple-300">
                {stats.roleCounts.employer}
              </span>
            </button>
          </div>

          {/* Leave a review button */}
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-blue-500" />
            <span>Leave a Review</span>
          </button>
        </div>

        {/* Dynamic Reviews Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs">Loading verified reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No reviews in this category yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Be the first to share your experience with Career Graph!
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev, index) => {
              const roleConfig =
                ROLE_BADGES[rev.role] || ROLE_BADGES.job_seeker;
              const RoleIcon = roleConfig.icon;
              const gradient =
                AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
              const initials = (rev.authorName || "Member")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div
                  key={rev._id}
                  className="p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md shadow-blue-500/5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-lg"
                >
                  <div>
                    {/* Top Row: Stars + Role Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={`star-${rev._id}-${i}`}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200 dark:text-slate-800"
                            }`}
                          />
                        ))}
                      </div>

                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${roleConfig.color}`}
                      >
                        <RoleIcon className="w-3 h-3" />
                        <span>{roleConfig.label}</span>
                      </div>
                    </div>

                    {/* Verified Outcome Banner if available */}
                    {rev.verifiedOutcome && (
                      <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                        <span>{rev.verifiedOutcome}</span>
                      </div>
                    )}

                    {/* Review Quote */}
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                      &ldquo;{rev.content}&rdquo;
                    </p>

                    {/* Feature Highlight Tags */}
                    {rev.tags && rev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {rev.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Author Card Footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {rev.authorImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rev.authorImage}
                        alt={rev.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full bg-linear-to-tr ${gradient} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm`}
                      >
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {rev.authorName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {rev.headline ||
                          rev.companyOrTarget ||
                          "Career Graph Member"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Submission & Edit Modal */}
      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchReviews}
      />
    </section>
  );
}
