"use client";

import {
  ArrowLeft,
  ArrowUpDown,
  Briefcase,
  Building2,
  Filter,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LandingFooter, LandingNavbar } from "@/components/landing";
import { useSession } from "@/lib/auth-client";
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
  createdAt: string;
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
  ratingCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
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

export default function PublicReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 12,
    averageRating: 4.9,
    roleCounts: { all: 12, job_seeker: 6, recruiter: 3, employer: 3 },
    ratingCounts: { 5: 11, 4: 1, 3: 0, 2: 0, 1: 0 },
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
                  Discover how job seekers land high-fit roles in weeks,
                  recruiters identify pre-screened talent, and employers build
                  high-performing teams with Career Graph.
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
                    <span className="text-xs text-slate-400 block">
                      Based on
                    </span>
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
                        key={starVal}
                        onClick={() =>
                          setSelectedRating(
                            selectedRating === starVal.toString()
                              ? "all"
                              : starVal.toString(),
                          )
                        }
                        className={`w-full flex items-center gap-2 py-0.5 hover:opacity-80 transition-opacity text-left ${
                          selectedRating === starVal.toString()
                            ? "font-bold text-amber-300"
                            : "text-slate-300"
                        }`}
                      >
                        <span className="w-10 text-[11px] shrink-0">
                          {starVal} ★
                        </span>
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

          {/* Interactive Filters Bar */}
          <div
            id="reviews-grid"
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            {/* Top row: Role tabs & Search */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Role / Persona Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-800 w-full lg:w-auto">
                <button
                  onClick={() => setSelectedRole("all")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedRole === "all"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>All Stories</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300">
                    {stats.roleCounts.all}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedRole("job_seeker")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedRole === "job_seeker"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
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
                  onClick={() => setSelectedRole("recruiter")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedRole === "recruiter"
                      ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs"
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
                  onClick={() => setSelectedRole("employer")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedRole === "employer"
                      ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
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

              {/* Search Bar */}
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reviews, outcome, company..."
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Row: Rating dropdown & Sort selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  <span>Rating:</span>
                </span>
                <div className="flex items-center gap-1">
                  {["all", "5", "4", "3"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRating(r)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedRating === r
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {r === "all" ? "All Stars" : `${r} ★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" />
                  <span>Sort by:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "featured" | "highest" | "recent",
                    )
                  }
                  aria-label="Sort reviews"
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Featured Stories</option>
                  <option value="highest">Highest Rated</option>
                  <option value="recent">Most Recent</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs">Loading verified feedback...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto shadow-sm space-y-3">
              <Sparkles className="w-10 h-10 text-blue-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching reviews found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No verified reviews match your current filters. Try resetting
                search or star ratings.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs"
              >
                Reset All Filters
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
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
