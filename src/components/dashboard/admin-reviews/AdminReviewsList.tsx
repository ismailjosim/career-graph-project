"use client";

import {
  Briefcase,
  Building2,
  CheckCircle2,
  Eye,
  Loader2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UserCheck,
  XCircle,
} from "lucide-react";
import type { AdminReview } from "./admin-reviews.types";

interface AdminReviewsListProps {
  reviews: AdminReview[];
  loading: boolean;
  actionLoadingId: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onUpdateStatus: (
    id: string,
    status: "approved" | "rejected" | "featured" | "pending",
  ) => void;
  onInspect: (review: AdminReview) => void;
  onDelete: (id: string) => void;
}

export function AdminReviewsList({
  reviews = [],
  loading,
  actionLoadingId,
  page,
  totalPages,
  onPageChange,
  onUpdateStatus,
  onInspect,
  onDelete,
}: AdminReviewsListProps) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  if (loading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
        <p className="text-xs">Loading feedback table...</p>
      </div>
    );
  }

  if (safeReviews.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm py-20 text-center space-y-2">
        <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          No reviews found
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No feedback matching your filters. Try clearing search keywords or
          selecting &quot;All Statuses&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3.5">Reviewer</th>
              <th className="px-4 py-3.5">Role</th>
              <th className="px-4 py-3.5">Rating & Outcome</th>
              <th className="px-5 py-3.5 min-w-70">Review Quote</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {safeReviews.map((rev) => {
              const initials = (rev.authorName || "User")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              const isPendingReview = rev.status === "pending";
              const isApprovedReview = rev.status === "approved";
              const isRejectedReview = rev.status === "rejected";
              const isFeaturedReview = rev.status === "featured";

              return (
                <tr
                  key={rev._id}
                  className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Column 1: Reviewer Info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {initials}
                      </div>
                      <div className="min-w-0 max-w-42.5">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {rev.authorName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {rev.headline || rev.companyOrTarget || "Member"}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Role / Persona */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {rev.role === "job_seeker" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 font-medium text-[11px]">
                        <UserCheck className="w-3 h-3" />
                        <span>Candidate</span>
                      </span>
                    )}
                    {rev.role === "recruiter" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50 font-medium text-[11px]">
                        <Briefcase className="w-3 h-3" />
                        <span>Recruiter</span>
                      </span>
                    )}
                    {rev.role === "employer" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 font-medium text-[11px]">
                        <Building2 className="w-3 h-3" />
                        <span>Employer</span>
                      </span>
                    )}
                  </td>

                  {/* Column 3: Rating & Outcome */}
                  <td className="px-4 py-4">
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={`r-${rev._id}-${i}`}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200 dark:text-slate-800"
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 ml-1">
                          {rev.rating}.0
                        </span>
                      </div>
                      {rev.verifiedOutcome && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium truncate max-w-47.5">
                          <ShieldCheck className="w-3 h-3 shrink-0 text-emerald-500" />
                          <span className="truncate">
                            {rev.verifiedOutcome}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Column 4: Review Quote */}
                  <td className="px-5 py-4">
                    <p className="text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed text-xs">
                      &ldquo;{rev.content}&rdquo;
                    </p>
                    {rev.tags && rev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {rev.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Column 5: Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {isPendingReview && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Pending
                      </span>
                    )}
                    {isApprovedReview && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                      </span>
                    )}
                    {isRejectedReview && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 font-semibold text-[10px]">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    )}
                    {isFeaturedReview && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold text-[10px]">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </td>

                  {/* Column 6: Moderation Action Buttons */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      {/* Quick Approve Button */}
                      {!isApprovedReview && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(rev._id, "approved")}
                          disabled={actionLoadingId === rev._id}
                          title="Approve Review"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Quick Reject Button */}
                      {!isRejectedReview && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(rev._id, "rejected")}
                          disabled={actionLoadingId === rev._id}
                          title="Reject Review"
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Feature toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateStatus(
                            rev._id,
                            isFeaturedReview ? "approved" : "featured",
                          )
                        }
                        disabled={actionLoadingId === rev._id}
                        title={
                          isFeaturedReview ? "Unfeature" : "Mark as Featured"
                        }
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isFeaturedReview
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>

                      {/* View details modal button */}
                      <button
                        type="button"
                        onClick={() => onInspect(rev)}
                        title="Inspect Details"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => onDelete(rev._id)}
                        disabled={actionLoadingId === rev._id}
                        title="Delete Permanently"
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <span className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
