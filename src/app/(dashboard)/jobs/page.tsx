"use client";

import {
  Briefcase,
  Building2,
  Coins,
  Globe,
  Plus,
  SearchX,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  JobApplyModal,
  JobCard,
  type JobFilterState,
  JobFilters,
} from "@/components/dashboard/jobs";
import { useTokens } from "@/context/tokens-context";
import { useSession } from "@/lib/auth-client";
import type { JobPosting } from "@/lib/validation";

const DEFAULT_FILTERS: JobFilterState = {
  search: "",
  workplaceType: "all",
  employmentType: "all",
  experienceLevel: "all",
  sourcePlatform: "all",
  sortBy: "newest",
};

export default function JobPortalPage() {
  const { data: session } = useSession();
  const { tokens } = useTokens();

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilterState>(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    totalActive: 0,
    remoteCount: 0,
  });

  // User Wishlist IDs to show filled heart icons
  const [wishlistLinks, setWishlistLinks] = useState<Set<string>>(new Set());

  // Apply Modal state
  const [selectedJobForApply, setSelectedJobForApply] =
    useState<JobPosting | null>(null);

  // User's applied jobs set
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const canPostJob =
    session?.user &&
    ["admin", "super_admin", "recruiter", "employer"].includes(
      (session.user as unknown as { role?: string }).role || "",
    );

  // Fetch Jobs from API
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.workplaceType !== "all")
        params.set("workplaceType", filters.workplaceType);
      if (filters.employmentType !== "all")
        params.set("employmentType", filters.employmentType);
      if (filters.experienceLevel !== "all")
        params.set("experienceLevel", filters.experienceLevel);
      if (filters.sourcePlatform !== "all")
        params.set("sourcePlatform", filters.sourcePlatform);
      params.set("sortBy", filters.sortBy);
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        if (data.pagination) setPagination(data.pagination);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
      toast.error("Failed to load jobs list");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Load user wishlist and applications to reflect state
  useEffect(() => {
    if (!session?.user) return;

    fetch("/api/wishlist")
      .then((res) => (res.ok ? res.json() : []))
      .then((items) => {
        const linkSet = new Set<string>();
        for (const item of items) {
          if (item.link) linkSet.add(item.link);
        }
        setWishlistLinks(linkSet);
      })
      .catch(() => {});

    fetch("/api/applications")
      .then((res) => (res.ok ? res.json() : []))
      .then((apps) => {
        const idSet = new Set<string>();
        for (const a of apps) {
          if (a.jobLink?.startsWith("/jobs/")) {
            idSet.add(a.jobLink.replace("/jobs/", ""));
          }
        }
        setAppliedJobIds(idSet);
      })
      .catch(() => {});
  }, [session?.user]);

  const handleFilterChange = <K extends keyof JobFilterState>(
    key: K,
    value: JobFilterState[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Wishlist Save Toggle
  const handleWishlistToggle = async (job: JobPosting) => {
    const jobLink = `/jobs/${job._id}`;
    const isSaved = wishlistLinks.has(jobLink);

    try {
      if (isSaved) {
        // Find and delete
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const items = await res.json();
          const target = items.find(
            (i: { link?: string }) => i.link === jobLink,
          );
          if (target?._id) {
            await fetch(`/api/wishlist/${target._id}`, { method: "DELETE" });
            setWishlistLinks((prev) => {
              const next = new Set(prev);
              next.delete(jobLink);
              return next;
            });
            toast.success("Removed from wishlist");
            return;
          }
        }
      }

      // Add to wishlist
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: job.title,
          company: job.company,
          description: job.description,
          link: jobLink,
          notes: `${job.workplaceType} • ${job.tokenCost} tokens • ${job.sourcePlatform}`,
        }),
      });

      if (res.ok) {
        setWishlistLinks((prev) => new Set([...prev, jobLink]));
        toast.success("Saved to your wishlist!");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error("Failed to update wishlist");
    }
  };

  const handleApplySuccess = (_appId: string) => {
    if (selectedJobForApply?._id) {
      setAppliedJobIds(
        (prev) => new Set([...prev, selectedJobForApply._id as string]),
      );
    }
  };

  return (
    <div className="w-full space-y-7 animate-fade-in pb-16">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Job Marketplace</span>
          </div>
          <h1 className="section-title">Job Portal</h1>
          <p className="section-subtitle">
            Explore and apply for verified roles from recruiters and platform
            sources using tokens.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* User's current token balance pill */}
          <Link
            href="/pricing"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
            title="View or buy tokens"
          >
            <Coins className="w-4 h-4" />
            <span>{tokens} Tokens Available</span>
          </Link>

          {/* Post a Job Button (Recruiters & Admins) */}
          <Link
            href="/jobs/new"
            className="btn-primary text-xs sm:text-sm py-2 px-4 shadow-sm cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{canPostJob ? "Post a Job" : "Post a Job (Recruiter)"}</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {stats.totalActive}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Active Roles
            </div>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {stats.remoteCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Remote Positions
            </div>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              5 - 15
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Tokens per Apply
            </div>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Direct
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Verified Hiring
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <JobFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalFiltered={pagination.total}
      />

      {/* Job Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Loading placeholders
            <div key={idx} className="card p-6 space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-800 space-y-4 max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <SearchX className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No matching job postings found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try modifying your search terms or clearing your active filters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="btn-outline text-xs py-2 px-4 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jobs.map((job) => {
            const jobLink = `/jobs/${job._id}`;
            const isSaved = wishlistLinks.has(jobLink);
            const hasApplied = appliedJobIds.has(String(job._id));

            return (
              <JobCard
                key={job._id}
                job={job}
                isSaved={isSaved}
                hasApplied={hasApplied}
                onSaveToggle={handleWishlistToggle}
                onApply={(j) => setSelectedJobForApply(j)}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            className="btn-outline text-xs py-2 px-3.5 disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs text-slate-600 dark:text-slate-400 px-2 font-medium">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            className="btn-outline text-xs py-2 px-3.5 disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Apply Modal */}
      <JobApplyModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
}
