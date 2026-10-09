"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Crown,
  ExternalLink,
  FileText,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PaginationControl } from "@/components/ui/PaginationControl";
import type { JobMatchSuggestion } from "@/lib/validation";

interface CuratedDailyMatchesCardProps {
  maxItems?: number;
  showFullPageLink?: boolean;
}

const PAGE_SIZE = 8;

/**
 * Computes application deadline status and badge metadata.
 * Returns null if deadline is not set or has already expired.
 */
function getDeadlineStatus(deadlineDate?: Date | string) {
  if (!deadlineDate) return null;
  const deadline = new Date(deadlineDate);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  if (diffMs <= 0) return null; // Expired

  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const formattedDate = deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (diffDays === 1) {
    return {
      text: "Closing tomorrow",
      detail: formattedDate,
      isUrgent: true,
    };
  }
  if (diffDays <= 3) {
    return {
      text: `${diffDays} days left`,
      detail: formattedDate,
      isUrgent: true,
    };
  }
  if (diffDays <= 7) {
    return {
      text: `${diffDays} days left`,
      detail: formattedDate,
      isUrgent: false,
    };
  }
  return {
    text: `Deadline: ${formattedDate}`,
    detail: `${diffDays} days left`,
    isUrgent: false,
  };
}

export function CuratedDailyMatchesCard({
  maxItems = 3,
  showFullPageLink = true,
}: CuratedDailyMatchesCardProps) {
  const [matches, setMatches] = useState<JobMatchSuggestion[]>([]);
  const [hasResume, setHasResume] = useState<boolean>(true);
  const [hasDailyAiMatchesPlan, setHasDailyAiMatchesPlan] =
    useState<boolean>(true);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isVip, setIsVip] = useState<boolean>(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [targetRole, setTargetRole] = useState("Full-Stack Engineer");
  const [syncedTime, setSyncedTime] = useState("Synced today at 06:00 AM");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search, filter & pagination state (for full-page view)
  const [searchQuery, setSearchQuery] = useState("");
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs/daily-matches");
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
        if (typeof data.hasResume === "boolean") {
          setHasResume(data.hasResume);
        }
        if (typeof data.hasDailyAiMatchesPlan === "boolean") {
          setHasDailyAiMatchesPlan(data.hasDailyAiMatchesPlan);
        }
        if (typeof data.isExpired === "boolean") {
          setIsExpired(data.isExpired);
        }
        if (typeof data.isVip === "boolean") {
          setIsVip(data.isVip);
        }
        if (data.daysRemaining !== undefined) {
          setDaysRemaining(data.daysRemaining);
        }
        if (data.targetRole) setTargetRole(data.targetRole);
        if (data.date) {
          setSyncedTime(
            `Synced today at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          );
        }
      }
    } catch (err) {
      console.warn("Failed to load daily curated matches:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/jobs/daily-matches", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMatches(data.matches || []);
        if (typeof data.hasResume === "boolean") {
          setHasResume(data.hasResume);
        }
        if (typeof data.hasDailyAiMatchesPlan === "boolean") {
          setHasDailyAiMatchesPlan(data.hasDailyAiMatchesPlan);
        }
        if (typeof data.isExpired === "boolean") {
          setIsExpired(data.isExpired);
        }
        if (typeof data.isVip === "boolean") {
          setIsVip(data.isVip);
        }
        if (data.daysRemaining !== undefined) {
          setDaysRemaining(data.daysRemaining);
        }
        if (data.hasResume === false) {
          toast.info(
            "Please upload your resume first to generate real matches.",
          );
        } else {
          toast.success(
            "Generated fresh candidate matches based on your latest profile!",
          );
        }
      } else if (data.code === "PLAN_REQUIRED") {
        toast.info(
          data.message ||
            "Automated match re-generation is reserved for Daily AI Matches plan members. Upgrade to Pro to unlock continuous daily delivery.",
        );
      } else {
        toast.error(data.message || "Failed to re-sync candidate matches");
      }
    } catch {
      toast.error("Failed to re-sync candidate matches");
    } finally {
      setRefreshing(false);
    }
  };

  const handleTrackApply = async (match: JobMatchSuggestion) => {
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: match.jobTitle,
          company: match.company,
          description: match.matchReason || `${match.matchScore}% resume match`,
          link: match.applyUrl,
          notes: `Tracked from Daily AI Matches (${match.matchScore}% score)`,
        }),
      });
      toast.success(`Tracked "${match.jobTitle}" in your job tracker!`);
    } catch {
      // Ignore background track failure
    }
  };

  // Distinct sources list for filter dropdown (excluding expired)
  const uniqueSources = useMemo(() => {
    const set = new Set<string>();
    const now = new Date();
    for (const m of matches) {
      if (m.deadline && new Date(m.deadline) < now) continue;
      if (m.source) set.add(m.source);
    }
    return Array.from(set);
  }, [matches]);

  // Filtered matches (always excludes jobs whose deadline has passed)
  const filteredMatches = useMemo(() => {
    const now = new Date();
    // Exclude any jobs whose application deadline has passed
    let result = matches.filter(
      (job) => !job.deadline || new Date(job.deadline) >= now,
    );

    // In widget mode (overview), simply take top maxItems
    if (showFullPageLink) {
      return result.slice(0, maxItems);
    }

    // Full page filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q) ||
          job.matchedSkills?.some((s) => s.toLowerCase().includes(q)),
      );
    }

    if (minScoreFilter > 0) {
      result = result.filter((job) => job.matchScore >= minScoreFilter);
    }

    if (sourceFilter !== "all") {
      result = result.filter((job) => job.source === sourceFilter);
    }

    return result;
  }, [
    matches,
    showFullPageLink,
    maxItems,
    searchQuery,
    minScoreFilter,
    sourceFilter,
  ]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || minScoreFilter > 0 || sourceFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setMinScoreFilter(0);
    setSourceFilter("all");
    setCurrentPage(1);
  };

  // Paginated matches
  const totalPages = Math.ceil(filteredMatches.length / PAGE_SIZE) || 1;
  const paginatedMatches = useMemo(() => {
    if (showFullPageLink) {
      return filteredMatches;
    }
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredMatches.slice(start, start + PAGE_SIZE);
  }, [filteredMatches, showFullPageLink, currentPage]);

  if (loading) {
    return (
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-xl animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-56 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="space-y-3 pt-2">
          <div className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
          <div className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
          <div className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-xl p-5 sm:p-7 text-slate-900 dark:text-white space-y-6 transition-colors">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-md shadow-blue-500/25 shrink-0">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Today&apos;s Curated Matches (
                {matches.length > 0 ? `${matches.length} New Jobs` : "Active"})
              </h2>
              {hasDailyAiMatchesPlan ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isVip ? (
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                      <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                      VIP Priority •{" "}
                      {daysRemaining ? `${daysRemaining}d left` : "Active"}
                    </span>
                  ) : daysRemaining ? (
                    `Live • ${daysRemaining}d left`
                  ) : (
                    "Live • Plan Active"
                  )}
                </span>
              ) : isExpired ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/25">
                  <Crown className="w-3 h-3 text-rose-500" />
                  30-Day Scraping Ended
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  <Crown className="w-3 h-3 text-amber-500" />
                  Plan Required for Daily Sync
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Target Profile:{" "}
              <span className="text-slate-800 dark:text-slate-200 font-semibold">
                {targetRole}
              </span>{" "}
              • {syncedTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Re-match latest scraped jobs against your resume"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-600 dark:text-blue-400" : ""}`}
            />
          </button>

          {showFullPageLink && (
            <Link
              href="/daily-matches"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide transition-all shadow-sm shadow-blue-500/20 group cursor-pointer"
            >
              <span>Get Your Daily 10-15 Matches</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Daily AI Matches Plan Upgrade/Renewal Banner */}
      {hasResume && !hasDailyAiMatchesPlan && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 border border-indigo-500/30 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3 h-3" />
                <span>
                  {isExpired
                    ? "Renew Scraping Delivery"
                    : "Daily AI Matches (30 Days)"}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isExpired
                  ? "Your 30-Day Automated Scraping Period Has Ended"
                  : "Automated Daily Scraped Job Delivery"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isExpired
                  ? `Your unused AI tokens have lifetime validity and stay in your account balance. Renew any package to resume 30 days of automated scraped jobs tailored to ${targetRole}.`
                  : `When new jobs are scraped, members receive freshly curated recommendations tailored to their target role (${targetRole}) and skills. Every package includes 30 days of scraping + lifetime AI tokens.`}
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 shrink-0 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>
                {isExpired
                  ? "Renew Scraping Plan"
                  : "Upgrade to Daily AI Matches"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-indigo-500/15 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>AI Tokens never expire (Lifetime)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>30 Days automated scraping delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Target Role & Skill matching</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Page Filters & Search Bar */}
      {!showFullPageLink && matches.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search matches by role, company, skills, or location..."
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Platform filter dropdown */}
            {uniqueSources.length > 1 && (
              <div className="shrink-0 flex items-center gap-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline">
                  Source:
                </span>
                <select
                  value={sourceFilter}
                  onChange={(e) => {
                    setSourceFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="all">All Platforms</option>
                  {uniqueSources.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quick Score Filters & Active Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 dark:text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Match Score:
              </span>
              {[
                { label: "All", value: 0 },
                { label: "85%+ Match", value: 85 },
                { label: "80%+ Match", value: 80 },
                { label: "75%+ Match", value: 75 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setMinScoreFilter(opt.value);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-xs ${
                    minScoreFilter === opt.value
                      ? "bg-blue-600 text-white shadow-2xs font-semibold"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">
              Found {filteredMatches.length} matching jobs
            </div>
          </div>
        </div>
      )}

      {/* Matched Job Cards */}
      <div className="space-y-3.5">
        {matches.length === 0 ? (
          !hasResume ? (
            <div className="py-12 text-center rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/60 p-6 sm:p-8 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Resume Uploaded Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                To calculate genuine AI match scores and recommend jobs aligned
                with your experience, please upload or create your resume first.
              </p>
              <div className="pt-2">
                <Link
                  href="/resumes"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Your Resume</span>
                </Link>
              </div>
            </div>
          ) : !hasDailyAiMatchesPlan ? (
            <div className="py-12 text-center rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/60 p-6 sm:p-8 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily AI Matches Plan Required
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Automated continuous daily job matching is reserved for Daily AI
                Matches plan members. Upgrade to have our scraper engine deliver
                fresh recommendations directly aligned with your target role (
                {targetRole}) and skills.
              </p>
              <div className="pt-2">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>View Plans & Upgrade</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/60 p-6">
              <Sparkles className="w-10 h-10 mx-auto text-blue-600 dark:text-blue-400 mb-2 opacity-60" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Generating Personalized Job Matches
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Our background engine is syncing new web jobs across hiring
                platforms. Click below to generate your initial AI match
                recommendations based on your resume.
              </p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
              >
                Sync Matches Now
              </button>
            </div>
          )
        ) : paginatedMatches.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-800 p-6 space-y-3">
            <Filter className="w-8 h-8 mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No jobs match your filter criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Try adjusting your search query or lowering the minimum match
              score threshold.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {!hasDailyAiMatchesPlan && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>
                    {isExpired
                      ? "Daily automated scraping paused • Your AI tokens remain safe. Renew any package to resume daily scraped jobs."
                      : "Showing One-Time Preview Matches (Max 7) • Every package includes 30 days of automated scraping + lifetime AI tokens."}
                  </span>
                </span>
                <Link
                  href="/pricing"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-bold shrink-0 ml-1"
                >
                  {isExpired ? "Renew Plan →" : "View Packages →"}
                </Link>
              </div>
            )}
            {paginatedMatches.map((job) => {
              const deadlineInfo = getDeadlineStatus(job.deadline);
              return (
                <div
                  key={job.jobId || job.jobTitle}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/90 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 border border-slate-200/80 hover:border-slate-300 dark:border-slate-700/60 dark:hover:border-slate-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-2xs hover:shadow-xs"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Meta platform, deadline & status line */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        {job.company}
                      </span>
                      <span>•</span>
                      <span>Recently active</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/60 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                        via {job.source || "LinkedIn Jobs"}
                      </span>
                      {deadlineInfo && (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                            deadlineInfo.isUrgent
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25 animate-pulse"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25"
                          }`}
                          title={`Application deadline: ${deadlineInfo.detail}`}
                        >
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{deadlineInfo.text}</span>
                        </span>
                      )}
                    </div>

                    {/* Role Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {job.jobTitle}
                    </h3>

                    {/* Location & Compensation */}
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{job.location || "Remote (Worldwide)"}</span>
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {job.salary || "Competitive Market Rate"}
                      </span>
                    </div>

                    {/* Matched Skills Chips */}
                    {job.matchedSkills && job.matchedSkills.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1.5 pt-1">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mr-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Matched Skills:
                        </span>
                        {job.matchedSkills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-200/70 dark:bg-slate-700/60 border border-slate-300/80 dark:border-slate-600/60 text-slate-700 dark:text-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.matchedSkills.length > 5 && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            +{job.matchedSkills.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Match Score & Action Button */}
                  <div className="flex items-center md:flex-col justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-5">
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Resume Match
                        </div>
                        <div className="text-lg md:text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                          {job.matchScore}%
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Zap className="w-4 h-4 fill-blue-600 dark:fill-blue-400" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/cover-letters?title=${encodeURIComponent(job.jobTitle)}&company=${encodeURIComponent(job.company)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                        title="Draft an ATS-optimized tailored cover letter for this role"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Tailor Letter</span>
                      </Link>

                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleTrackApply(job)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                      >
                        <span>Apply / Track</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Pagination (Full Page mode) */}
      {!showFullPageLink && filteredMatches.length > PAGE_SIZE && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredMatches.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemName="matches"
        />
      )}

      {/* Footer info line */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>
            Scraped across LinkedIn, Indeed, Google Jobs, Glassdoor, and active
            tech job boards.
          </span>
        </div>

        {showFullPageLink ? (
          <Link
            href="/daily-matches"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Explore all daily matches</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        ) : (
          <Link
            href="/jobs"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Explore all job portal listings</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
