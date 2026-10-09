"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LandingFooter, LandingNavbar } from "@/components/landing";
import { useSession } from "@/lib/auth-client";
import type { ReviewRole } from "@/lib/validation";
import { ReviewsFilterBar } from "./ReviewsFilterBar";
import { ReviewsGrid } from "./ReviewsGrid";
import { ReviewsHeaderStats } from "./ReviewsHeaderStats";
import type { ReviewItem, ReviewStats } from "./reviews.types";

export function PublicReviewsClient() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    roleCounts: { all: 0, job_seeker: 0, recruiter: 0, employer: 0 },
    ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedRole, setSelectedRole] = useState<"all" | ReviewRole>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "highest" | "recent">(
    "featured",
  );

  // Admin status check
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/users/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (
            data?.user?.role === "admin" ||
            data?.user?.role === "super_admin"
          ) {
            setIsAdmin(true);
          }
        })
        .catch(() => {});
    }
  }, [session?.user]);

  // Fetch reviews with query parameters
  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedRole !== "all") params.set("role", selectedRole);
      if (selectedRating !== "all") params.set("rating", selectedRating);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (sortBy !== "featured") params.set("sort", sortBy);
      params.set("limit", "60");

      const res = await fetch(`/api/reviews?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load community reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, selectedRating, searchQuery, sortBy]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const hasActiveFilters =
    selectedRole !== "all" ||
    selectedRating !== "all" ||
    searchQuery.trim() !== "" ||
    sortBy !== "featured";

  const handleResetFilters = () => {
    setSelectedRole("all");
    setSelectedRating("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <LandingNavbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin/reviews"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admin Moderation Center</span>
              </Link>
            )}
          </div>

          {/* Hero Banner & Overall Platform Score */}
          <ReviewsHeaderStats
            stats={stats}
            selectedRating={selectedRating}
            onSelectRating={setSelectedRating}
          />

          {/* Interactive Filters Bar */}
          <ReviewsFilterBar
            stats={stats}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            selectedRating={selectedRating}
            onSelectRating={setSelectedRating}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
          />

          {/* Reviews Grid */}
          <ReviewsGrid
            reviews={reviews}
            loading={loading}
            onResetFilters={handleResetFilters}
          />
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
