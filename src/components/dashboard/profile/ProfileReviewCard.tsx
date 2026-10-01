"use client";

import {
  CheckCircle2,
  MessageSquareHeart,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ReviewModal } from "@/components/reviews/ReviewModal";
import type { ReviewRole } from "@/lib/validation";

interface UserReview {
  _id: string;
  rating: number;
  role: ReviewRole;
  content: string;
  headline?: string;
  companyOrTarget?: string;
  verifiedOutcome?: string;
  createdAt: string;
}

export function ProfileReviewCard() {
  const [review, setReview] = useState<UserReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUserReview = useCallback(() => {
    fetch("/api/reviews/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.review) {
          setReview(data.review);
        } else {
          setReview(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUserReview();
  }, [fetchUserReview]);

  if (loading) return null;

  return (
    <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <MessageSquareHeart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Verified Platform Review
            </h4>
            <p className="text-[11px] text-slate-400">
              1 review per verified account
            </p>
          </div>
        </div>

        {review && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>Published</span>
          </span>
        )}
      </div>

      {review ? (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((starNum) => (
                <Star
                  key={`user-review-star-${starNum}`}
                  className={`w-3.5 h-3.5 ${
                    starNum <= review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200 dark:text-slate-800"
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                {review.rating}.0
              </span>
            </div>

            {review.verifiedOutcome && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium truncate max-w-40">
                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{review.verifiedOutcome}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-3 leading-relaxed">
            &ldquo;{review.content}&rdquo;
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Update Your Review & Outcome
          </button>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Have you applied for roles, improved your resume score, or
            interviewed with Career Graph? Share your outcome to help fellow
            members.
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Share Your Verified Experience</span>
          </button>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchUserReview}
      />
    </div>
  );
}
