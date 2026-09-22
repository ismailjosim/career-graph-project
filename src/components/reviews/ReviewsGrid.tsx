"use client";

import { Loader2, ShieldCheck, Sparkles, Star } from "lucide-react";
import {
  AVATAR_GRADIENTS,
  type ReviewItem,
  ROLE_BADGES,
} from "./reviews.types";

interface ReviewsGridProps {
  reviews: ReviewItem[];
  loading: boolean;
  onResetFilters: () => void;
}

export function ReviewsGrid({
  reviews,
  loading,
  onResetFilters,
}: ReviewsGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs">Loading verified feedback...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto shadow-sm space-y-3">
        <Sparkles className="w-10 h-10 text-blue-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          No matching reviews found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          No verified reviews match your current filters. Try resetting search
          or star ratings.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((rev, index) => {
        const roleConfig = ROLE_BADGES[rev.role] || ROLE_BADGES.job_seeker;
        const RoleIcon = roleConfig.icon;
        const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
        const initials = (rev.authorName || "Member")
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <div
            key={rev._id}
            className="p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md shadow-blue-500/5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-xl group"
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
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                    {rev.rating}.0
                  </span>
                </div>

                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${roleConfig.color}`}
                >
                  <RoleIcon className="w-3 h-3" />
                  <span>{roleConfig.label}</span>
                </div>
              </div>

              {/* Verified Outcome Banner */}
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

              {/* Tags */}
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

            {/* Author Footer */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              {rev.authorImage ? (
                // biome-ignore lint/performance/noImgElement: External user avatar from various OAuth providers
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
                  {rev.headline || rev.companyOrTarget || "Career Graph Member"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
