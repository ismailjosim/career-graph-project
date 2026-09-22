"use client";

import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { JobApplyModal } from "@/components/dashboard/jobs";
import { useTokens } from "@/context/tokens-context";
import type { JobPosting } from "@/lib/validation";
import { JobDetailSidebar } from "./JobDetailSidebar";
import { JobHeroCard } from "./JobHeroCard";

interface JobDetailClientProps {
  jobId: string;
}

export function JobDetailClient({ jobId }: JobDetailClientProps) {
  const router = useRouter();
  const { tokens } = useTokens();

  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [existingApplicationId, setExistingApplicationId] = useState<
    string | null
  >(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleTrackClick = () => {
    if (!jobId) return;
    setJob((prev) =>
      prev
        ? { ...prev, externalClicksCount: (prev.externalClicksCount || 0) + 1 }
        : null,
    );
    fetch(`/api/jobs/${jobId}/click`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  };

  useEffect(() => {
    if (!jobId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/jobs/${jobId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404 ? "Job not found" : "Failed to load job",
          );
        }
        return res.json();
      })
      .then((data) => {
        setJob(data.job);
        setIsSaved(Boolean(data.isWishlisted));
        setHasApplied(Boolean(data.hasApplied));
        setExistingApplicationId(data.existingApplicationId || null);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load job details",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jobId]);

  // Save / Wishlist Handler
  const handleSaveToggle = async () => {
    if (!job) return;
    const jobLink = `/jobs/${job._id}`;

    try {
      if (isSaved) {
        // Delete from wishlist
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const items = await res.json();
          const target = items.find(
            (i: { link?: string }) => i.link === jobLink,
          );
          if (target?._id) {
            await fetch(`/api/wishlist/${target._id}`, { method: "DELETE" });
            setIsSaved(false);
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
        setIsSaved(true);
        toast.success("Saved to your wishlist!");
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      toast.error("Failed to update wishlist");
    }
  };

  // Share Job Handler
  const handleShare = async () => {
    if (!job) return;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: `${job.title} at ${job.company} | Career Graph`,
      text: `Check out this ${job.title} position at ${job.company} on Career Graph!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Job link shared!");
        return;
      } catch (_e) {
        // Fallback to clipboard if cancelled or unsupported
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Job link copied to clipboard!");
    }
  };

  // Create Cover Letter Handler
  const handleCreateCoverLetter = () => {
    if (!job) return;
    const searchParams = new URLSearchParams({
      title: job.title,
      company: job.company,
      requirements: job.requirements?.join(", ") || "",
      description: job.description || "",
    });
    router.push(`/cover-letters?${searchParams.toString()}`);
  };

  // Tailor Resume / Fit Analysis Handler
  const handleTailorResume = () => {
    if (!job) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "career_graph_target_job",
        JSON.stringify({
          title: job.title,
          company: job.company,
          description: `${job.title} at ${job.company}\n\nLocation: ${job.location} (${job.workplaceType})\n\nRequirements:\n${job.requirements.map((r) => `- ${r}`).join("\n")}\n\nDescription:\n${job.description}`,
        }),
      );
    }
    router.push("/fit-analysis?source=job_portal");
  };

  const handleApplySuccess = (appId: string) => {
    setHasApplied(true);
    setExistingApplicationId(appId);
    if (job) {
      setJob({ ...job, applicantsCount: (job.applicantsCount || 0) + 1 });
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="card p-12 text-center max-w-lg mx-auto space-y-4 my-8">
        <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Job Posting Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {error ||
            "The requested job posting may have expired or been removed."}
        </p>
        <Link
          href="/jobs"
          className="btn-primary text-xs py-2 px-4 inline-block"
        >
          ← Back to All Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-7 animate-fade-in pb-20">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Portal</span>
        </Link>

        {job.originalJobUrl && (
          <a
            href={job.originalJobUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTrackClick}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
          >
            <span>Original {job.sourcePlatform} Post</span>
            <span className="px-1.5 py-0.2 rounded bg-blue-100/70 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
              {job.externalClicksCount || 0} clicks
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Hero Header Card */}
      <JobHeroCard
        job={job}
        tokens={tokens}
        isSaved={isSaved}
        hasApplied={hasApplied}
        existingApplicationId={existingApplicationId}
        onApplyClick={() => setShowApplyModal(true)}
        onSaveToggle={handleSaveToggle}
        onShare={handleShare}
        onCreateCoverLetter={handleCreateCoverLetter}
        onTailorResume={handleTailorResume}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Left Column (2 cols): Full Description & Requirements */}
        <div className="lg:col-span-2 space-y-7">
          {/* Requirements Checklist Card */}
          <div className="card p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span>Job Requirements & Skills</span>
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {job.requirements?.length || 0} Required
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              The application token cost is computed from these{" "}
              {job.requirements?.length || 0} requirements.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {job.requirements?.map((req) => (
                <div
                  key={req}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                    {req}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Job Description Card */}
          <div className="card p-6 sm:p-7 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Full Job Description
            </h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
              {job.description}
            </div>
          </div>

          {/* Benefits & Perks (if present) */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="card p-6 sm:p-7 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Benefits & Perks
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-semibold"
                  >
                    ★ {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Job Snapshot & Company Overview */}
        <JobDetailSidebar
          job={job}
          onTrackClick={handleTrackClick}
          onTailorResume={handleTailorResume}
        />
      </div>

      {/* Apply Modal */}
      <JobApplyModal
        job={job}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
}
