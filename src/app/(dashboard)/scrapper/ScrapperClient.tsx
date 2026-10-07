"use client";

import {
  Bot,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Database,
  ExternalLink,
  Layers,
  Lock,
  MapPin,
  Play,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

const SKELETON_ROW_KEYS = [
  "sk-row-1",
  "sk-row-2",
  "sk-row-3",
  "sk-row-4",
  "sk-row-5",
  "sk-row-6",
  "sk-row-7",
  "sk-row-8",
  "sk-row-9",
  "sk-row-10",
];

function getSourceBadgeStyle(source: string) {
  const src = (source || "").toLowerCase();
  if (src.includes("linkedin")) {
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  }
  if (src.includes("indeed")) {
    return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
  }
  if (src.includes("google")) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  }
  if (src.includes("glassdoor")) {
    return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
  }
  return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
}

interface ScraperRunRecord {
  _id: string;
  platform: string;
  targetRole: string;
  location: string;
  targetCount: number;
  scrapedCount: number;
  newJobsCount: number;
  duplicateCount: number;
  status: "queued" | "running" | "completed" | "failed";
  apifyRunId?: string;
  startedAt: string;
  finishedAt?: string;
  durationSeconds?: number;
  error?: string;
}

interface ScrapedJobItem {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  skills: string[];
  source: string;
  applyUrl: string;
  scrapedAt: string;
}

interface ScraperStats {
  totalRuns: number;
  totalJobsInDb: number;
  totalScrapedJobs: number;
  totalNewJobs: number;
  completedRuns: number;
  failedRuns: number;
}

const PLATFORMS = [
  {
    id: "all",
    name: "All Platforms",
    subtitle: "Google Jobs Universal Aggregator (LinkedIn, Indeed, Glassdoor)",
    badge: "Recommended",
    badgeColor:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    color: "from-purple-500 to-indigo-600",
    borderColor: "border-purple-500/40",
    icon: Layers,
  },
  {
    id: "linkedin",
    name: "LinkedIn Jobs",
    subtitle: "Official actor (bebity/linkedin-jobs-scraper)",
    badge: "Popular",
    badgeColor:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    color: "from-blue-600 to-blue-700",
    borderColor: "border-blue-500/40",
    icon: Briefcase,
  },
  {
    id: "indeed",
    name: "Indeed Jobs",
    subtitle: "Real-time feed (borderline/indeed-scraper)",
    badge: "High Yield",
    badgeColor:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    color: "from-amber-500 to-orange-600",
    borderColor: "border-amber-500/40",
    icon: Search,
  },
  {
    id: "google_jobs",
    name: "Google Jobs",
    subtitle: "epctex/google-jobs-scraper multi-board index",
    badge: "Aggregated",
    badgeColor:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    color: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-500/40",
    icon: Database,
  },
  {
    id: "glassdoor",
    name: "Glassdoor Jobs",
    subtitle: "bebity/glassdoor-jobs-scraper with salary intel",
    badge: "Verified",
    badgeColor:
      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    color: "from-cyan-500 to-blue-600",
    borderColor: "border-cyan-500/40",
    icon: Zap,
  },
];

const SUGGESTED_ROLES = [
  "Full Stack Developer",
  "Frontend Engineer",
  "Backend Engineer",
  "React Developer",
  "DevOps Engineer",
  "AI / ML Engineer",
  "Data Engineer",
  "UI/UX Designer",
  "Product Manager",
];

const SUGGESTED_LOCATIONS = [
  "Remote",
  "United States (Remote)",
  "Europe (Remote)",
  "Worldwide",
  "New York, NY",
  "San Francisco, CA",
];

const QUANTITY_PRESETS = [10, 25, 50, 100];

export default function ScrapperClient() {
  const { data: session, isPending: sessionLoading } = useSession();
  const router = useRouter();

  // Role verification
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Form inputs
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [targetRole, setTargetRole] = useState<string>("Full Stack Developer");
  const [location, setLocation] = useState<string>("Remote");
  const [jobCount, setJobCount] = useState<number>(50);

  // Execution state
  const [isStarting, setIsStarting] = useState(false);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [activeRun, setActiveRun] = useState<ScraperRunRecord | null>(null);
  const [_sampleJobs, setSampleJobs] = useState<ScrapedJobItem[]>([]);

  // History & explorer
  const [activeTab, setActiveTab] = useState<"explorer" | "history">(
    "explorer",
  );
  const [historyRuns, setHistoryRuns] = useState<ScraperRunRecord[]>([]);
  const [stats, setStats] = useState<ScraperStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<ScrapedJobItem[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsSearch, setJobsSearch] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalJobsCount, setTotalJobsCount] = useState<number>(0);
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  // Check admin role
  useEffect(() => {
    if (!sessionLoading) {
      fetch("/api/users/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const role =
            data?.user?.role ||
            (session?.user as unknown as Record<string, unknown>)?.role;
          const isAdm = role === "admin" || role === "super_admin";
          setIsAdmin(isAdm);
          if (!isAdm) router.replace("/dashboard");
        })
        .catch(() => {
          const role = (session?.user as unknown as Record<string, unknown>)
            ?.role;
          const isAdm = role === "admin" || role === "super_admin";
          setIsAdmin(isAdm);
          if (!isAdm) router.replace("/dashboard");
        });
    }
  }, [sessionLoading, session?.user, router]);

  // Fetch history & statistics
  const fetchHistoryAndStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/scraper/history?limit=15");
      if (res.ok) {
        const data = await res.json();
        setHistoryRuns(data.runs || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.warn("Failed to fetch scraper history:", err);
    }
  }, []);

  // Fetch recent scraped jobs with 10 per page server pagination
  const fetchRecentJobs = useCallback(
    async (page = 1, query = "", source = "all") => {
      setJobsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "10",
        });
        if (query.trim()) params.set("query", query.trim());
        if (source && source !== "all") params.set("source", source);

        const res = await fetch(`/api/admin/scraper/jobs?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setRecentJobs(data.jobs || []);
          if (data.pagination) {
            setCurrentPage(data.pagination.page || 1);
            setTotalPages(data.pagination.totalPages || 1);
            setTotalJobsCount(data.pagination.total || 0);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch jobs:", err);
      } finally {
        setJobsLoading(false);
      }
    },
    [],
  );

  const handleSearchChange = (val: string) => {
    setJobsSearch(val);
    fetchRecentJobs(1, val, sourceFilter);
  };

  const handleSourceFilterChange = (source: string) => {
    setSourceFilter(source);
    fetchRecentJobs(1, jobsSearch, source);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      fetchRecentJobs(newPage, jobsSearch, sourceFilter);
    }
  };

  // Candidate Demand Analysis State
  const [demandData, setDemandData] = useState<{
    totalJobSeekers: number;
    totalWithResumes: number;
    clusters: Array<{
      roleName: string;
      userCount: number;
      topSkills: string[];
      sampleSearchQuery: string;
    }>;
  } | null>(null);
  const [demandLoading, setDemandLoading] = useState(false);
  const [matchingInProgress, setMatchingInProgress] = useState(false);

  const fetchCandidateDemand = useCallback(async () => {
    setDemandLoading(true);
    try {
      const res = await fetch("/api/admin/scraper/candidate-demand");
      if (res.ok) {
        const data = await res.json();
        setDemandData(data.demand || null);
      }
    } catch (err) {
      console.warn("Failed to load candidate demand:", err);
    } finally {
      setDemandLoading(false);
    }
  }, []);

  const handleTriggerMatching = async () => {
    setMatchingInProgress(true);
    try {
      const res = await fetch("/api/admin/scraper/candidate-demand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run_matching" }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          data.message ||
            "Candidate matching successfully executed for all candidates!",
        );
      } else {
        toast.error(data.error || "Failed to trigger matching");
      }
    } catch {
      toast.error("Error executing candidate matching");
    } finally {
      setMatchingInProgress(false);
    }
  };

  const handleSelectDemandCluster = (cluster: {
    roleName: string;
    topSkills: string[];
  }) => {
    setTargetRole(cluster.roleName);
    toast.info(
      `Scraper target role set to "${cluster.roleName}" with matching candidate skills!`,
    );
  };

  useEffect(() => {
    if (isAdmin) {
      fetchHistoryAndStats();
      fetchRecentJobs(1, "", "all");
      fetchCandidateDemand();
    }
  }, [isAdmin, fetchHistoryAndStats, fetchRecentJobs, fetchCandidateDemand]);

  // Polling hook for active run
  useEffect(() => {
    if (!activeRunId) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/scraper/status/${activeRunId}`);
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        if (data.run) {
          setActiveRun(data.run);

          if (data.sampleJobs && data.sampleJobs.length > 0) {
            setSampleJobs(data.sampleJobs);
          }

          if (data.run.status === "completed") {
            clearInterval(interval);
            setActiveRunId(null);
            toast.success(
              `Scraping complete! Ingested ${data.run.newJobsCount} new jobs (${data.run.duplicateCount} duplicates skipped).`,
            );
            fetchHistoryAndStats();
            fetchRecentJobs(1, jobsSearch, sourceFilter);
          } else if (data.run.status === "failed") {
            clearInterval(interval);
            setActiveRunId(null);
            toast.error(data.run.error || "Scraper run failed on Apify");
            fetchHistoryAndStats();
          }
        }
      } catch (err) {
        console.warn("Error polling scraper status:", err);
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [
    activeRunId,
    fetchHistoryAndStats,
    fetchRecentJobs,
    jobsSearch,
    sourceFilter,
  ]);

  // Handle start scraping submission
  const handleStartScraping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error(
        "Only administrators are authorized to initiate scraping runs.",
      );
      return;
    }
    if (!targetRole.trim()) {
      toast.error("Please enter a target job role");
      return;
    }

    setIsStarting(true);
    try {
      const res = await fetch("/api/admin/scraper/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatform,
          targetRole: targetRole.trim(),
          location: location.trim() || "Remote",
          jobCount: Number(jobCount) || 50,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate scraper");
      }

      toast.success(
        `Apify actor launched for ${jobCount} jobs on ${selectedPlatform}!`,
      );
      setActiveRunId(data.runId);
      setActiveRun({
        _id: data.runId,
        platform: selectedPlatform,
        targetRole,
        location,
        targetCount: jobCount,
        scrapedCount: 0,
        newJobsCount: 0,
        duplicateCount: 0,
        status: "running",
        apifyRunId: data.apifyRunId,
        startedAt: new Date().toISOString(),
      });
      fetchHistoryAndStats();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error initiating Apify scraper",
      );
    } finally {
      setIsStarting(false);
    }
  };

  // Loading state
  if (sessionLoading || isAdmin === null) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">
            Checking administrator permissions...
          </p>
        </div>
      </div>
    );
  }

  // Unauthorized view
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Administrator Access Required
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          The Apify Multi-Platform Scraper is an administrative utility. Your
          current account does not have administrator privileges.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Apify Job Scrapper
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Admin Console
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Automated multi-platform job extraction powered by Apify Store
                actors with live deduplication.
              </p>
            </div>
          </div>
        </div>

        {/* Apify Connection Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Apify Token Connected (ismailjosim)</span>
          </div>
          <button
            onClick={() => {
              fetchHistoryAndStats();
              fetchRecentJobs();
              toast.success("Scraper metrics updated");
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aggregate Metrics Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Total Scraped Jobs
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalJobsInDb.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Available for AI matching
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Scraper Runs
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalRuns}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {stats.completedRuns} successful ({stats.failedRuns} failed)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              New Ingestions
            </div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.totalNewJobs.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Deduplicated automatically
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Active Apify Actors
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              5 Platforms
            </div>
            <div className="text-xs text-slate-500 mt-1">
              LinkedIn, Indeed, Google, Glassdoor
            </div>
          </div>
        </div>
      )}

      {/* Candidate Demand & Skillset Analysis Panel */}
      <div className="p-6 md:p-7 rounded-3xl bg-linear-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/20 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
                  Candidate Demand & Skillset Analysis
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                  {demandLoading && (
                    <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
                  )}
                  <span>
                    {demandData?.totalJobSeekers || 10} Job Seekers Active
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live profile and resume analysis of roles candidates want to
                land. Click any card to target the scraper.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTriggerMatching}
            disabled={matchingInProgress}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all cursor-pointer whitespace-nowrap"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${matchingInProgress ? "animate-spin" : ""}`}
            />
            <span>
              {matchingInProgress
                ? "Matching Candidates..."
                : "Run AI Matching for All Candidates"}
            </span>
          </button>
        </div>

        {/* Demand Clusters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(
            demandData?.clusters || [
              {
                roleName: "React Developer",
                userCount: 5,
                topSkills: [
                  "React 19",
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "Redux",
                ],
                sampleSearchQuery: "React Developer Remote",
              },
              {
                roleName: "Full Stack Developer",
                userCount: 2,
                topSkills: [
                  "Node.js",
                  "Express",
                  "React",
                  "MongoDB",
                  "PostgreSQL",
                ],
                sampleSearchQuery: "Full Stack Developer Remote",
              },
              {
                roleName: "AI / ML Engineer",
                userCount: 5,
                topSkills: ["Python", "PyTorch", "LangChain", "OpenAI", "LLMs"],
                sampleSearchQuery: "AI Engineer Remote",
              },
            ]
          ).map((cluster) => {
            const isCurrentlySelected =
              targetRole.toLowerCase() === cluster.roleName.toLowerCase();
            return (
              <div
                key={cluster.roleName}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
                  isCurrentlySelected
                    ? "bg-blue-900/30 border-blue-500/50 shadow-md ring-1 ring-blue-500/40"
                    : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                        Candidate Target Role
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                        {cluster.roleName}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      {cluster.userCount}{" "}
                      {cluster.userCount === 1 ? "User" : "Users"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-2">
                    Top skillset keywords from resumes:
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {cluster.topSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-200 border border-slate-700/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectDemandCluster(cluster)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrentlySelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {isCurrentlySelected
                      ? "Targeting This Role in Scraper"
                      : `Select for Scraping (${cluster.userCount} Users)`}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-start sm:items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Candidate Delivery Workflow:</strong> When you start
            scraping, extracted jobs are automatically scored against each job
            seeker&apos;s resume and skills to deliver personalized 10–15 daily
            job recommendations with match percentages straight to their
            dashboard.
          </span>
        </div>
      </div>

      {/* Main Form: Scraper Launch Controls */}
      <form
        onSubmit={handleStartScraping}
        className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                1. Select Platform
              </h2>
              <p className="text-xs text-slate-500">
                Choose the target platform or use the Universal Aggregator to
                scrape across all boards simultaneously.
              </p>
            </div>
          </div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatform === platform.id;
              return (
                <button
                  type="button"
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all relative group flex flex-col justify-between ${
                    isSelected
                      ? `${platform.borderColor} bg-slate-50 dark:bg-slate-800/80 shadow-md`
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-2.5 rounded-lg text-white bg-linear-to-br ${platform.color} shadow-xs`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${platform.badgeColor}`}
                    >
                      {platform.badge}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">
                      {platform.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {platform.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Job Role & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              2. Target Role / Keywords <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer, AI Engineer..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGGESTED_ROLES.slice(0, 6).map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setTargetRole(role)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    targetRole === role
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              3. Location & Workplace Type
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote, Worldwide, United States..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGGESTED_LOCATIONS.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    location === loc
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quantity Preset & Submit Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              4. Jobs to Scrape (Apify Quota)
            </label>
            <div className="flex items-center gap-2">
              {QUANTITY_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setJobCount(preset)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    jobCount === preset
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {preset} jobs
                </button>
              ))}
              <div className="flex items-center gap-1.5 pl-2">
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={jobCount}
                  onChange={(e) => setJobCount(Number(e.target.value) || 50)}
                  className="w-20 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-400">custom</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isStarting || Boolean(activeRunId) || !isAdmin}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/25 cursor-pointer disabled:cursor-not-allowed"
            >
              {!isAdmin ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Admin Access Required</span>
                </>
              ) : isStarting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Launching Apify Actor...</span>
                </>
              ) : activeRunId ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scraper in Progress...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Scrapping ({jobCount} Jobs)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Live Execution Progress Card (when running) */}
      {activeRun && (
        <div className="p-6 md:p-8 rounded-2xl bg-linear-to-br from-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-500/30 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">
                    Scraping in Progress: {activeRun.targetRole}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                    {activeRun.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Platform: {activeRun.platform} &bull; Target:{" "}
                  {activeRun.targetCount} jobs &bull; Location:{" "}
                  {activeRun.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Elapsed: {activeRun.durationSeconds || 0}s</span>
              {activeRun.apifyRunId && (
                <span className="font-mono text-slate-400 text-[11px]">
                  ID: {activeRun.apifyRunId.slice(0, 10)}...
                </span>
              )}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <div className="text-slate-400 mb-1">1. Apify Actor</div>
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Spawned & Active
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <div className="text-slate-400 mb-1">
                2. Target Data Extraction
              </div>
              <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Querying {activeRun.platform}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <div className="text-slate-400 mb-1">3. Ingested to MongoDB</div>
              <div className="font-semibold text-indigo-300">
                {activeRun.newJobsCount} new jobs added
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <div className="text-slate-400 mb-1">4. Deduplication Filter</div>
              <div className="font-semibold text-amber-300">
                {activeRun.duplicateCount} duplicates skipped
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explorer / History Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("explorer")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "explorer"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Extracted Jobs Explorer ({totalJobsCount})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "history"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Scraper Run History ({historyRuns.length})
            </button>
          </div>

          {activeTab === "explorer" && (
            <div className="flex items-center gap-2.5">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search title, company, skills..."
                  value={jobsSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                {jobsSearch && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                  >
                    ×
                  </button>
                )}
              </div>

              <select
                value={sourceFilter}
                onChange={(e) => handleSourceFilterChange(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Sources</option>
                <option value="linkedin">LinkedIn</option>
                <option value="indeed">Indeed</option>
                <option value="google_jobs">Google Jobs</option>
                <option value="glassdoor">Glassdoor</option>
              </select>

              <button
                onClick={() =>
                  fetchRecentJobs(currentPage, jobsSearch, sourceFilter)
                }
                disabled={jobsLoading}
                title="Refresh jobs"
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${jobsLoading ? "animate-spin text-blue-600" : ""}`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Extracted Jobs Explorer (Table Format with 10 per page Server Pagination) */}
        {activeTab === "explorer" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-3 text-center w-12">#</th>
                      <th className="py-3 px-4 min-w-30">Job Title & Role</th>
                      <th className="py-3 px-4 min-w-30">Company & Location</th>
                      <th className="py-3 px-3.5 min-w-25">Platform</th>
                      <th className="py-3 px-3.5 min-w-25">Compensation</th>
                      <th className="py-3 px-4 min-w-50">Skills Required</th>
                      <th className="py-3 px-3.5 min-w-25">Scraped Date</th>
                      <th className="py-3 px-4 text-right min-w-25">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {jobsLoading ? (
                      SKELETON_ROW_KEYS.map((key) => (
                        <tr key={key} className="animate-pulse">
                          <td className="py-3.5 px-3 text-center">
                            <div className="h-3 w-4 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded mb-1.5" />
                            <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800/60 rounded" />
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-1.5" />
                            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800/60 rounded" />
                          </td>
                          <td className="py-3.5 px-3.5">
                            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
                          </td>
                          <td className="py-3.5 px-3.5">
                            <div className="h-3.5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex gap-1">
                              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                          </td>
                          <td className="py-3.5 px-3.5">
                            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : recentJobs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <Database className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            No scraped jobs found
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {jobsSearch
                              ? "Try clearing search filters."
                              : "Run an Apify scraping job using the control card above."}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      recentJobs.map((job, idx) => {
                        const rowIndex = (currentPage - 1) * 10 + idx + 1;
                        return (
                          <tr
                            key={job._id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                          >
                            <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-400">
                              {rowIndex}
                            </td>
                            <td className="py-3 px-4">
                              <a
                                href={job.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 block text-sm"
                                title={job.title}
                              >
                                {job.title}
                              </a>
                              <span className="text-[11px] text-slate-500 capitalize">
                                {job.jobType || "Full-Time"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                                {job.company}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                                <span>{job.location || "Remote"}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3.5">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase border ${getSourceBadgeStyle(job.source)}`}
                              >
                                {job.source}
                              </span>
                            </td>
                            <td className="py-3 px-3.5">
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                                {job.salary && job.salary !== "Competitive"
                                  ? job.salary
                                  : "Competitive"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {job.skills && job.skills.length > 0 ? (
                                  <>
                                    {job.skills.slice(0, 3).map((skill) => (
                                      <span
                                        key={skill}
                                        className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 truncate"
                                        title={skill}
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                    {job.skills.length > 3 && (
                                      <span className="text-[10px] text-slate-400 px-1 py-0.5 font-medium">
                                        +{job.skills.length - 3}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-slate-400 text-[11px] italic">
                                    Not specified
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              {job.scrapedAt
                                ? new Date(job.scrapedAt).toLocaleDateString()
                                : "—"}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <a
                                href={job.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs group-hover:shadow-xs"
                              >
                                <span>Apply / View</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Server Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-xs">
                <div className="text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {totalJobsCount === 0 ? 0 : (currentPage - 1) * 10 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {Math.min(currentPage * 10, totalJobsCount)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {totalJobsCount}
                  </span>{" "}
                  jobs (10 per page)
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || jobsLoading}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  {/* Render page numbers */}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={jobsLoading}
                          className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white shadow-xs"
                              : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={pageNum} className="text-slate-400 px-0.5">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || jobsLoading}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-xs cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Run History Audit Table */}
        {activeTab === "history" && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Date / Time</th>
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Target Role</th>
                    <th className="py-3 px-4 text-center">Requested</th>
                    <th className="py-3 px-4 text-center">New Inserted</th>
                    <th className="py-3 px-4 text-center">Duplicates</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {historyRuns.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-8 text-center text-slate-400"
                      >
                        No previous runs recorded.
                      </td>
                    </tr>
                  ) : (
                    historyRuns.map((run) => (
                      <tr
                        key={run._id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                          {new Date(run.startedAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                            {run.platform}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                          {run.targetRole}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {run.targetCount}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          +{run.newJobsCount}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                          {run.duplicateCount}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {run.durationSeconds
                            ? `${run.durationSeconds}s`
                            : "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              run.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : run.status === "running"
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {run.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
