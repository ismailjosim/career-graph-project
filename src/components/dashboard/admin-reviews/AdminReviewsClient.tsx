"use client";

import { ArrowLeft, Loader2, ShieldAlert, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { AdminReviewDetailModal } from "./AdminReviewDetailModal";
import { AdminReviewsFilters } from "./AdminReviewsFilters";
import { AdminReviewsList } from "./AdminReviewsList";
import { AdminReviewsStats } from "./AdminReviewsStats";
import type { AdminReview, ReviewMetrics } from "./admin-reviews.types";

export function AdminReviewsClient() {
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
  const [detailModalReview, setDetailModalReview] =
    useState<AdminReview | null>(null);
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
  }, [session, sessionPending]);

  const isAdmin = verifiedRole === "admin" || verifiedRole === "super_admin";

  const loadReviews = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        status: selectedStatus,
        role: selectedRole,
        search,
      });

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setReviews(data.reviews || data.data || []);
        if (data.metrics) setMetrics(data.metrics);
        if (data.pagination)
          setTotalPages(
            data.pagination.totalPages || data.pagination.pages || 1,
          );
      } else {
        setReviews([]);
        throw new Error(data.error || "Failed to load reviews");
      }
    } catch (err: unknown) {
      setReviews([]);
      setBannerMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to load reviews",
      });
    } finally {
      setLoading(false);
    }
  }, [page, selectedStatus, selectedRole, search, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadReviews();
    }
  }, [loadReviews, isAdmin]);

  const handleUpdateStatus = async (
    reviewId: string,
    newStatus: "approved" | "rejected" | "featured" | "pending",
  ) => {
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
        text: `Review updated to status "${newStatus}".`,
      });

      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, status: newStatus } : r)),
      );

      if (detailModalReview?._id === reviewId) {
        setDetailModalReview((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }

      loadReviews();
    } catch (err: unknown) {
      setBannerMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Failed to update review status",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?"))
      return;

    setActionLoadingId(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete review");
      }

      setBannerMessage({
        type: "success",
        text: "Review permanently deleted.",
      });
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

  if (sessionPending || checkingRole) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500">
          Verifying administrative access...
        </p>
      </div>
    );
  }

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
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
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
            <span className="text-blue-600 font-semibold">
              Feedback & Reviews
            </span>
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
            type="button"
            onClick={() => setBannerMessage(null)}
            className="p-1 hover:opacity-75 transition-opacity cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Metric Summary Cards */}
      <AdminReviewsStats metrics={metrics} />

      {/* Controls Bar: Search & Filters */}
      <AdminReviewsFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        selectedRole={selectedRole}
        onRoleChange={(val) => {
          setSelectedRole(val);
          setPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(val) => {
          setSelectedStatus(val);
          setPage(1);
        }}
      />

      {/* Main Table Card */}
      <AdminReviewsList
        reviews={reviews}
        loading={loading}
        actionLoadingId={actionLoadingId}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onUpdateStatus={handleUpdateStatus}
        onInspect={(rev) => setDetailModalReview(rev)}
        onDelete={handleDeleteReview}
      />

      {/* Review Detail Inspection Modal */}
      <AdminReviewDetailModal
        review={detailModalReview}
        onClose={() => setDetailModalReview(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
