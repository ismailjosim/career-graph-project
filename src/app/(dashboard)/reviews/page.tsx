"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  Search,
  UserCheck,
  Briefcase,
  Building2,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Sparkles,
  ArrowLeft,
  X,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import type { ReviewRole, ReviewStatus } from "@/lib/validation";

interface AdminReview {
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
  status: ReviewStatus;
  helpfulVotes?: number;
  createdAt: string;
  updatedAt: string;
}

interface ReviewMetrics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  featured: number;
  averageRating: number;
  roleBreakdown: {
    job_seeker: number;
    recruiter: number;
    employer: number;
  };
}

export default function AdminReviewsPage() {
  const { data: session, isPending: sessionPending } = useSession();

  const [verifiedRole, setVerifiedRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  // Reviews & metrics state
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [metrics, setMetrics] = useState<ReviewMetrics>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    featured: 0,
    averageRating: 5.0,
    roleBreakdown: { job_seeker: 0, recruiter: 0, employer: 0 },
  });

  // Filters
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Actions state
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [detailModalReview, setDetailModalReview] = useState<AdminReview | null>(null);
  const [bannerMessage, setBannerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Check verified role
  useEffect(() => {
    if (session?.user) {
      fetch("/api/users/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user?.role) {
            setVerifiedRole(data.user.role);
          }
        })
        .catch(() => {})
        .finally(() => setCheckingRole(false));
    } else if (!sessionPending) {
      setCheckingRole(false);
    }
  }, [session?.user, sessionPending]);

  const activeRole =
    verifiedRole || (session?.user as unknown as { role?: string })?.role;
  const isAdmin = activeRole === "admin" || activeRole === "super_admin";

  // Fetch reviews
  const loadReviews = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedRole !== "all") params.set("role", selectedRole);
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      params.set("page", page.toString());
      params.set("limit", "15");

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews || []);
        if (data.metrics) setMetrics(data.metrics);
        if (data.pagination) setTotalPages(data.pagination.totalPages || 1);
      } else {
        setBannerMessage({ type: "error", text: data.error || "Failed to load reviews" });
      }
    } catch (err) {
      console.error("Failed to load admin reviews:", err);
      setBannerMessage({ type: "error", text: "Network error loading reviews" });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, search, selectedRole, selectedStatus, page]);

  useEffect(() => {
    if (isAdmin) {
      loadReviews();
    }
  }, [isAdmin, loadReviews]);

  // Handle status change (Approve, Reject, Feature, etc.)
  const handleUpdateStatus = async (reviewId: string, newStatus: ReviewStatus) => {
    setActionLoadingId(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update review status");
      }

      setBannerMessage({
        type: "success",
        text: `Review marked as ${newStatus.toUpperCase()}`,
      });

      // Update in local state immediately
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, status: newStatus } : r))
      );

      if (detailModalReview?._id === reviewId) {
        setDetailModalReview((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      // Re-fetch metrics in background
      loadReviews();
    } catch (err: unknown) {
      setBannerMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update status",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle permanent delete
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;

    setActionLoadingId(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete review");
      }

      setBannerMessage({ type: "success", text: "Review permanently deleted." });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      if (detailModalReview?._id === reviewId) {
        setDetailModalReview(null);
      }
      loadReviews();
    } catch (err: unknown) {
      setBannerMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete review",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // 1. Loading state
  if (sessionPending || checkingRole) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Verifying administrative access...</p>
      </div>
    );
  }

  // 2. Unauthorized screen
  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-900/50">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Access Restricted
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          This portal is reserved for System Administrators and Super Admins to
          moderate user reviews and community feedback.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in pb-16">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              Administration
            </span>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Feedback & Reviews</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-space-grotesk">
            Feedback & Reviews Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review, approve, reject, or feature community feedback from Job
            Seekers, Recruiters, and Employers in one centralized control panel.
          </p>
        </div>
      </div>

      {/* Toast / Banner notification */}
      {bannerMessage && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-medium ${
            bannerMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300"
          }`}
        >
          <span>{bannerMessage.text}</span>
          <button
            onClick={() => setBannerMessage(null)}
            className="p-1 hover:opacity-75 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Feedback */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Feedback
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-space-grotesk">
            {metrics.total}
          </div>
          <span className="text-[11px] text-slate-400">All-time submissions</span>
        </div>

        {/* Pending Moderation */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Pending Action
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-space-grotesk">
            {metrics.pending}
          </div>
          <span className="text-[11px] text-slate-400">Awaiting approval</span>
        </div>

        {/* Approved Reviews */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Live / Approved
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-space-grotesk">
            {metrics.approved}
          </div>
          <span className="text-[11px] text-slate-400">Visible on landing page</span>
        </div>

        {/* Rejected Reviews */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              Rejected / Hidden
            </span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1 font-space-grotesk">
            {metrics.rejected}
          </div>
          <span className="text-[11px] text-slate-400">Filtered from public</span>
        </div>

        {/* Average Rating */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Average Score
            </span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-space-grotesk">
            {metrics.averageRating.toFixed(1)} / 5.0
          </div>
          <span className="text-[11px] text-slate-400">Overall sentiment</span>
        </div>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search reviewer, outcome, content..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Selectors */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by reviewer role"
              className="flex-1 sm:flex-none px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="job_seeker">Job Seekers</option>
              <option value="recruiter">Recruiters</option>
              <option value="employer">Employers</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by review status"
              className="flex-1 sm:flex-none px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
            <p className="text-xs">Loading feedback table...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No reviews found
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No feedback matching your filters. Try clearing search keywords or
              selecting "All Statuses".
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Reviewer</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Rating & Outcome</th>
                  <th className="px-5 py-3.5 min-w-[280px]">Review Quote</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {reviews.map((rev) => {
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
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div className="min-w-0 max-w-[170px]">
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
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium truncate max-w-[190px]">
                              <ShieldCheck className="w-3 h-3 shrink-0 text-emerald-500" />
                              <span className="truncate">{rev.verifiedOutcome}</span>
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
                              onClick={() => handleUpdateStatus(rev._id, "approved")}
                              disabled={actionLoadingId === rev._id}
                              title="Approve Review"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Quick Reject Button */}
                          {!isRejectedReview && (
                            <button
                              onClick={() => handleUpdateStatus(rev._id, "rejected")}
                              disabled={actionLoadingId === rev._id}
                              title="Reject Review"
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Feature toggle */}
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                rev._id,
                                isFeaturedReview ? "approved" : "featured"
                              )
                            }
                            disabled={actionLoadingId === rev._id}
                            title={isFeaturedReview ? "Unfeature" : "Mark as Featured"}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isFeaturedReview
                                ? "bg-purple-600 text-white border-purple-600"
                                : "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                            }`}
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          {/* View details modal button */}
                          <button
                            onClick={() => setDetailModalReview(rev)}
                            title="Inspect Details"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            disabled={actionLoadingId === rev._id}
                            title="Delete Permanently"
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 transition-colors"
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
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Detail Inspection Modal */}
      {detailModalReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {detailModalReview.authorName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {detailModalReview.authorName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {detailModalReview.headline || "Member"} • ID: {detailModalReview.userId.slice(-6)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailModalReview(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Perspective / Role:</span>
                <span className="font-semibold uppercase tracking-wider text-blue-600">
                  {detailModalReview.role.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Rating:</span>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(detailModalReview.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="font-bold text-slate-800 dark:text-slate-200 ml-1">
                    {detailModalReview.rating}.0
                  </span>
                </div>
              </div>

              {detailModalReview.verifiedOutcome && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Verified Outcome:</span>
                  <span className="font-semibold text-emerald-600">
                    {detailModalReview.verifiedOutcome}
                  </span>
                </div>
              )}

              <div>
                <span className="text-slate-500 block mb-1">Full Feedback:</span>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed italic">
                  &ldquo;{detailModalReview.content}&rdquo;
                </div>
              </div>

              {detailModalReview.tags && detailModalReview.tags.length > 0 && (
                <div>
                  <span className="text-slate-500 block mb-1">Tags Highlighted:</span>
                  <div className="flex flex-wrap gap-1">
                    {detailModalReview.tags.map((t) => (
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
                <span>Submitted: {new Date(detailModalReview.createdAt).toLocaleString()}</span>
                <span className="font-semibold capitalize">Status: {detailModalReview.status}</span>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleUpdateStatus(detailModalReview._id, "rejected")}
                className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold"
              >
                Reject
              </button>
              <button
                onClick={() => handleUpdateStatus(detailModalReview._id, "approved")}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold shadow-xs"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
