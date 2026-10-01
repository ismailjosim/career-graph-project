"use client";

import { Star, X } from "lucide-react";
import type { AdminReview } from "./admin-reviews.types";

interface AdminReviewDetailModalProps {
  review: AdminReview | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: "approved" | "rejected") => void;
}

export function AdminReviewDetailModal({
  review,
  onClose,
  onUpdateStatus,
}: AdminReviewDetailModalProps) {
  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {review.authorName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {review.authorName}
              </h3>
              <p className="text-[11px] text-slate-400">
                {review.headline || "Member"} • ID: {review.userId.slice(-6)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Perspective / Role:</span>
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              {review.role.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Rating:</span>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].slice(0, review.rating).map((starNum) => (
                <Star
                  key={`detail-star-${starNum}`}
                  className="w-3.5 h-3.5 fill-amber-400"
                />
              ))}
              <span className="font-bold text-slate-800 dark:text-slate-200 ml-1">
                {review.rating}.0
              </span>
            </div>
          </div>

          {review.verifiedOutcome && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Verified Outcome:</span>
              <span className="font-semibold text-emerald-600">
                {review.verifiedOutcome}
              </span>
            </div>
          )}

          <div>
            <span className="text-slate-500 block mb-1">Full Feedback:</span>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed italic">
              &ldquo;{review.content}&rdquo;
            </div>
          </div>

          {review.tags && review.tags.length > 0 && (
            <div>
              <span className="text-slate-500 block mb-1">
                Tags Highlighted:
              </span>
              <div className="flex flex-wrap gap-1">
                {review.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>
              Submitted: {new Date(review.createdAt).toLocaleString()}
            </span>
            <span className="font-semibold capitalize">
              Status: {review.status}
            </span>
          </div>
        </div>

        {/* Quick Action Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onUpdateStatus(review._id, "rejected")}
            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold cursor-pointer"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => onUpdateStatus(review._id, "approved")}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold shadow-xs cursor-pointer"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
