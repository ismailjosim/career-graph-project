"use client";

import {
  ArrowRight,
  Briefcase,
  Building2,
  Loader2,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 12,
    averageRating: 4.9,
    roleCounts: { all: 12, job_seeker: 6, recruiter: 3, employer: 3 },
  });
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch up to 12 reviews for the infinite carousel
      const res = await fetch("/api/reviews?limit=12");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load carousel reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Duplicate items for a seamless continuous CSS marquee loop
  const marqueeItems = [...reviews, ...reviews];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wider mb-4">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span>
              {stats.averageRating.toFixed(1)} / 5.0 Rating • 100% Verified
              Community Feedback
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
            Loved by Job Seekers, Recruiters & Employers
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Real outcomes from ambitious professionals, talent scouts, and
            hiring teams transforming their career workflows.
          </p>
        </div>
      </div>

      {/* Infinite Horizontal Reviews Carousel */}
      <div className="relative w-full overflow-hidden">
        {/* Left and Right Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs">Loading verified reviews...</p>
          </div>
        ) : (
          <div className="flex gap-6 py-4 animate-marquee hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
            {marqueeItems.map((rev, index) => {
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
                  key={`${rev._id}-${index}`}
                  className="w-85 sm:w-95 shrink-0 p-6 sm:p-7 bg-white dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-blue-500/5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:scale-[1.01]"
                >
                  <div>
                    {/* Top Row: Rating Stars + Role Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={`star-${rev._id}-${index}-${i}`}
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
                        <span className="truncate">{rev.verifiedOutcome}</span>
                      </div>
                    )}

                    {/* Review Quote */}
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-4">
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
                      // biome-ignore lint/performance/noImgElement: Testimonial author avatars from OAuth
                      <img
                        src={rev.authorImage}
                        alt={rev.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full bg-linear-to-tr ${gradient} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs`}
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

      {/* "See All Reviews" CTA Section Below Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold shadow-lg shadow-slate-900/10 dark:shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] group"
          >
            <span>See All Reviews</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            Filtered by star ratings, candidate roles & recruitment teams
          </span>
        </div>
      </div>
    </section>
  );
}
