"use client";

import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  MapPin,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { JobMatchSuggestion } from "@/lib/validation";

interface CuratedDailyMatchesCardProps {
  maxItems?: number;
  showFullPageLink?: boolean;
}

export function CuratedDailyMatchesCard({
  maxItems = 3,
  showFullPageLink = true,
}: CuratedDailyMatchesCardProps) {
  const [matches, setMatches] = useState<JobMatchSuggestion[]>([]);
  const [targetRole, setTargetRole] = useState("Full-Stack Engineer");
  const [syncedTime, setSyncedTime] = useState("Synced today at 06:00 AM");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs/daily-matches");
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
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
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
        toast.success(
          "Generated fresh candidate matches based on your latest profile!",
        );
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

  const displayMatches = matches.slice(0, maxItems);

  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-white shadow-xl animate-pulse">
        <div className="h-6 w-64 bg-slate-800 rounded-lg mb-4" />
        <div className="space-y-3">
          <div className="h-24 bg-slate-800/60 rounded-2xl" />
          <div className="h-24 bg-slate-800/60 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-slate-950/95 dark:bg-slate-950 border border-slate-800/80 shadow-2xl p-6 md:p-7 text-white space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-sm tracking-wider shadow-lg shadow-blue-500/25 shrink-0">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">
                Today&apos;s Curated Matches (
                {matches.length > 0 ? `${matches.length} New Jobs` : "Active"})
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Profile:{" "}
              <span className="text-slate-200 font-medium">{targetRole}</span> •{" "}
              {syncedTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Re-match latest scraped jobs against your resume"
            className="p-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-400" : ""}`}
            />
          </button>

          {showFullPageLink && (
            <Link
              href="/daily-matches"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-blue-500/20 group cursor-pointer"
            >
              <span>Get Your Daily 10-15 Matches</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Matched Job Cards */}
      <div className="space-y-3.5">
        {displayMatches.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 p-6">
            <Sparkles className="w-10 h-10 mx-auto text-blue-400 mb-2 opacity-60" />
            <h3 className="text-sm font-bold text-white">
              Generating Personalized Job Matches
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Our background engine is syncing new web jobs across hiring
              platforms. Click below to generate your initial AI match
              recommendations.
            </p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
            >
              Sync Matches Now
            </button>
          </div>
        ) : (
          displayMatches.map((job) => (
            <div
              key={job.jobId || job.jobTitle}
              className="p-4 md:p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1 min-w-0">
                {/* Meta platform & time line */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-blue-400 hover:underline">
                    {job.company}
                  </span>
                  <span>•</span>
                  <span>Recently active</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 font-medium">
                    via {job.source || "LinkedIn Jobs"}
                  </span>
                </div>

                {/* Role Title */}
                <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors truncate">
                  {job.jobTitle}
                </h3>

                {/* Location & Compensation */}
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{job.location || "Remote (Worldwide)"}</span>
                  </span>
                  <span>•</span>
                  <span className="font-medium text-emerald-400">
                    {job.salary || "Competitive"}
                  </span>
                </div>

                {/* Matched Skills Chips */}
                {job.matchedSkills && job.matchedSkills.length > 0 && (
                  <div className="flex items-center flex-wrap gap-1.5 pt-1">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mr-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Matched Skills:
                    </span>
                    {job.matchedSkills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 border border-slate-700 text-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.matchedSkills.length > 5 && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        +{job.matchedSkills.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Match Score & Action Button */}
              <div className="flex items-center md:flex-col justify-between md:justify-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-medium">
                      Resume Match
                    </div>
                    <div className="text-lg md:text-xl font-extrabold text-blue-400 font-mono">
                      {job.matchScore}%
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Zap className="w-4 h-4 fill-blue-400" />
                  </div>
                </div>

                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleTrackApply(job)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-950 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <span>Apply / Track</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer info line */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-900 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>
            Scraped across LinkedIn, Indeed, Google Jobs, Glassdoor, and active
            tech job boards.
          </span>
        </div>

        <Link
          href="/jobs"
          className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
        >
          <span>Explore all job listings</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
