import { ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import type { ReviewStats } from "./reviews.types";

interface ReviewsHeaderStatsProps {
  stats: ReviewStats;
  selectedRating: string;
  onSelectRating: (rating: string) => void;
}

export function ReviewsHeaderStats({
  stats,
  selectedRating,
  onSelectRating,
}: ReviewsHeaderStatsProps) {
  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-br from-slate-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-2xl border border-slate-800">
      {/* Background Glow Orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left text */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>100% VERIFIED COMMUNITY REVIEWS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-space-grotesk leading-tight">
            Real Reviews from Real Professionals
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Discover how job seekers land high-fit roles in weeks, recruiters
            identify pre-screened talent, and employers build high-performing
            teams with Career Graph.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#reviews-grid"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Verified Feedback</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
            >
              <span>Return to Home</span>
            </Link>
          </div>
        </div>

        {/* Right: Score Breakdown Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-extrabold font-space-grotesk">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 text-amber-400 mt-1">
                {[1, 2, 3, 4, 5].map((starNum) => (
                  <Star
                    key={`summary-star-${starNum}`}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Based on</span>
              <span className="text-xl font-bold text-white font-space-grotesk">
                {stats.totalReviews} Reviews
              </span>
            </div>
          </div>

          {/* Rating Distribution Bars */}
          <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
            {[5, 4, 3, 2, 1].map((starVal) => {
              const count =
                stats.ratingCounts[starVal as 1 | 2 | 3 | 4 | 5] || 0;
              const percent =
                stats.totalReviews > 0
                  ? Math.round((count / stats.totalReviews) * 100)
                  : 0;
              return (
                <button
                  type="button"
                  key={starVal}
                  onClick={() =>
                    onSelectRating(
                      selectedRating === starVal.toString()
                        ? "all"
                        : starVal.toString(),
                    )
                  }
                  className={`w-full flex items-center gap-2 py-0.5 hover:opacity-80 transition-opacity text-left cursor-pointer ${
                    selectedRating === starVal.toString()
                      ? "font-bold text-amber-300"
                      : "text-slate-300"
                  }`}
                >
                  <span className="w-10 text-[11px] shrink-0">{starVal} ★</span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-[11px] text-right text-slate-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
