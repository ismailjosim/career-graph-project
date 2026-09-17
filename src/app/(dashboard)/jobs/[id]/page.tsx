"use client";

import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  Coins,
  DollarSign,
  ExternalLink,
  FileCheck2,
  FileText,
  Heart,
  MapPin,
  Share2,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { JobApplyModal } from "@/components/dashboard/jobs";
import { useTokens } from "@/context/tokens-context";
import type { JobPosting } from "@/lib/validation";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

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
    if (!id) return;
    setJob((prev) =>
      prev
        ? { ...prev, externalClicksCount: (prev.externalClicksCount || 0) + 1 }
        : null,
    );
    fetch(`/api/jobs/${id}/click`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  };

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetch(`/api/jobs/${id}`)
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
      .finally(() => setLoadingDataFalse());

    function setLoadingDataFalse() {
      setLoading(false);
    }
  }, [id]);

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
    // Store in session storage for fit analysis page to pre-populate
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

  const tokenCost = job.tokenCost || 5;

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
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0 overflow-hidden">
              {job.companyLogo ? (
                <Image
                  src={job.companyLogo}
                  alt={job.company}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                job.company.charAt(0).toUpperCase()
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 uppercase tracking-wide">
                  {job.sourcePlatform === "direct"
                    ? "Platform Direct"
                    : job.sourcePlatform}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                  {job.workplaceType}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                  {job.employmentType}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-200">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{job.company}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{job.location}</span>
                </div>

                {job.salary && (
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-4 h-4 shrink-0" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Token Fee Box */}
          <div className="w-full sm:w-auto p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-center sm:text-right shrink-0 space-y-1">
            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-amber-700 dark:text-amber-300 font-extrabold text-lg sm:text-xl">
              <Coins className="w-5 h-5 text-amber-500" />
              <span>{tokenCost} Tokens</span>
            </div>
            <div className="text-[11px] text-amber-800/80 dark:text-amber-300/80 font-medium">
              Base 5 + {job.requirements?.length || 0} requirements
            </div>
            <div className="text-[10px] text-slate-500 pt-1">
              Your balance:{" "}
              <strong className="text-slate-700 dark:text-slate-300">
                {tokens} tokens
              </strong>
            </div>
          </div>
        </div>

        {/* 5 Main Action Buttons Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Left Action Buttons: Apply, Save, Share */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {hasApplied ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Application Submitted</span>
                {existingApplicationId && (
                  <Link
                    href={`/applications/${existingApplicationId}`}
                    className="underline text-emerald-800 dark:text-emerald-200 ml-1"
                  >
                    View Status →
                  </Link>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowApplyModal(true)}
                className="btn-primary text-xs sm:text-sm py-2.5 px-6 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Apply for Job ({tokenCost} Tokens)</span>
              </button>
            )}

            {/* Save Job Button */}
            <button
              type="button"
              onClick={handleSaveToggle}
              className={`btn-outline text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 cursor-pointer transition-colors ${
                isSaved
                  ? "border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/40 text-rose-600"
                  : ""
              }`}
              title={isSaved ? "Saved in your wishlist" : "Save to wishlist"}
            >
              <Heart
                className={`w-4 h-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`}
              />
              <span>{isSaved ? "Saved" : "Save Job"}</span>
            </button>

            {/* Share Job Button */}
            <button
              type="button"
              onClick={handleShare}
              className="btn-outline text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 cursor-pointer"
              title="Share this job opportunity"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Right Action Buttons: Tailored Cover Letter & Tailored Resume */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Create Cover Letter Button */}
            <button
              type="button"
              onClick={handleCreateCoverLetter}
              className="btn-secondary text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 cursor-pointer text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              title="Generate tailored cover letter pre-filled with this job"
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Create Cover Letter</span>
            </button>

            {/* Tailor Resume Button */}
            <button
              type="button"
              onClick={handleTailorResume}
              className="btn-secondary text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 cursor-pointer text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              title="Analyze resume fit and tailor keywords for this job"
            >
              <FileCheck2 className="w-4 h-4 text-blue-500" />
              <span>Tailor Resume</span>
            </button>
          </div>
        </div>
      </div>

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
        <div className="space-y-6">
          {/* Company Information Card */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>Company Information</span>
            </h3>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden shadow-xs">
                {job.companyLogo ? (
                  <Image
                    src={job.companyLogo}
                    alt={job.company}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  job.company.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {job.company}
                </h4>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Workplace Model</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {job.workplaceType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Listed Via</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {job.sourcePlatform === "direct"
                    ? "Career Graph Portal"
                    : job.sourcePlatform}
                </span>
              </div>
              {job.salary && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Salary Range</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {job.salary}
                  </span>
                </div>
              )}
              {job.originalJobUrl && (
                <div className="pt-2">
                  <a
                    href={job.originalJobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleTrackClick}
                    className="btn-outline w-full text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    <span>View on {job.sourcePlatform}</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-100/70 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                      {job.externalClicksCount || 0} clicks
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Job Overview Summary */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Job Overview
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Employment Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {job.employmentType}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Workplace Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {job.workplaceType}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Experience Level</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {job.experienceLevel} Level
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Source Platform</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {job.sourcePlatform}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Date Posted</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Applications</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {job.applicantsCount || 0} Candidates
                </span>
              </div>
            </div>
          </div>

          {/* Quick AI Match Upsell */}
          <div className="card p-6 bg-linear-to-br from-indigo-500/10 via-blue-500/10 to-cyan-500/10 border border-indigo-500/20 space-y-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Check Your Fit Score First?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Compare your resume against this job description before applying
              to maximize interview probability.
            </p>
            <button
              type="button"
              onClick={handleTailorResume}
              className="btn-primary w-full text-xs py-2 cursor-pointer font-bold shadow-xs"
            >
              Run AI Fit Match
            </button>
          </div>
        </div>
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
