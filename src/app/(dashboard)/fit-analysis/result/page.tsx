"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Award,
  BookmarkPlus,
  Check,
  CheckCircle2,
  Copy,
  Layers,
  Printer,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { StoredAnalysisPayload } from "@/interfaces/fit-analysis";
import { useSession } from "@/lib/auth-client";

export default function FitAnalysisResultPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [data, setData] = useState<StoredAnalysisPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("fit_analysis_result");
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load analysis result from sessionStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCopyAdjustment = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAllAdjustments = () => {
    if (!data?.result) return;
    const allText = data.result.resumeAdjustments
      .map(
        (adj) =>
          `[${adj.section}] (${adj.impact.toUpperCase()} IMPACT)\nIssue: ${adj.issue}\nAdjustment: ${adj.suggestion}\n`,
      )
      .join("\n");
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCreateApplication = async () => {
    if (!data?.result || !userId) return;
    setApplying(true);
    try {
      const jobTitle =
        data.meta?.jobTitle || data.jobInput?.title || "Target Position";
      const company = data.meta?.company || data.jobInput?.company || "Company";
      const description = data.jobInput?.description || "";
      const jobLink = data.jobInput?.link || "";
      const resumeUsed = data.meta?.savedResumeId || "default";

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          jobTitle,
          company,
          description: description.slice(0, 1000),
          jobLink,
          resumeUsed,
          fitScore: data.result.fitScore,
          status: "applied",
          notes: `AI Fit Score: ${data.result.fitScore}%. Verdict: ${data.result.verdict.badge}. ${data.result.verdict.rationale}`,
        }),
      });

      if (res.ok) {
        setAppliedSuccess(true);
      }
    } catch (err) {
      console.error("Failed to create application:", err);
    } finally {
      setApplying(false);
    }
  };

  const getVerdictStyle = (decision: string) => {
    switch (decision) {
      case "strongly_recommended":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
          badge: "bg-emerald-500 text-white",
          icon: CheckCircle2,
          iconColor: "text-emerald-500",
          glow: "shadow-emerald-500/10",
        };
      case "recommended":
        return {
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300",
          badge: "bg-blue-600 text-white",
          icon: Sparkles,
          iconColor: "text-blue-500",
          glow: "shadow-blue-500/10",
        };
      case "proceed_with_caution":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
          badge: "bg-amber-500 text-white",
          icon: AlertTriangle,
          iconColor: "text-amber-500",
          glow: "shadow-amber-500/10",
        };
      default:
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300",
          badge: "bg-rose-600 text-white",
          icon: AlertCircle,
          iconColor: "text-rose-500",
          glow: "shadow-rose-500/10",
        };
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-20 text-center space-y-4 animate-fade-in">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Loading your analysis report...
        </p>
      </div>
    );
  }

  if (!data || !data.result) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <TrendingUp className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            No Analysis Report Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
            You haven't performed a fit analysis yet in this session, or the
            session expired. Please start a new analysis.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/fit-analysis" className="btn-primary px-6 py-3 text-sm">
            <Sparkles className="w-4 h-4" />
            Go to Fit Analysis
          </Link>
        </div>
      </div>
    );
  }

  const { result } = data;
  const jobTitle = data.meta?.jobTitle || data.jobInput?.title || "Target Role";
  const company =
    data.meta?.company || data.jobInput?.company || "Target Company";
  const verdictStyle = getVerdictStyle(result.verdict.decision);
  const VerdictIcon = verdictStyle.icon;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-20 animate-fade-in">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/fit-analysis"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Analysis Report
              </span>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <span className="text-xs text-slate-500">
                {data.analyzedAt
                  ? new Date(data.analyzedAt).toLocaleDateString()
                  : "Just now"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 mt-0.5">
              <span>{jobTitle}</span>
              <span className="text-slate-400 font-normal text-lg">at</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {company}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="btn-outline text-xs py-2 px-3 print:hidden"
            title="Print Report"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <Link
            href="/fit-analysis"
            className="btn-primary text-xs py-2 px-4 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Analyze Another Job
          </Link>
        </div>
      </div>

      {/* Hero Verdict & Fit Percentage Card */}
      <div
        className={`card p-6 sm:p-8 border-2 ${verdictStyle.bg} ${verdictStyle.glow} relative overflow-hidden`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Verdict Text Details */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2.5">
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs ${verdictStyle.badge}`}
              >
                {result.verdict.badge}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Official Recommendation
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <VerdictIcon
                className={`w-8 h-8 ${verdictStyle.iconColor} shrink-0`}
              />
              Should I Apply?
            </h2>

            <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed max-w-2xl">
              {result.verdict.rationale}
            </p>
          </div>

          {/* Large Circular / Metric Gauge */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md shrink-0 min-w-45 w-full sm:w-auto">
            <div className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-baseline">
              {result.fitScore}
              <span className="text-3xl text-blue-600 dark:text-blue-400 font-bold ml-1">
                %
              </span>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider">
              Overall Fit Match
            </span>
          </div>
        </div>

        {/* 3 Metric Breakdown Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">
                Technical Skills Match
              </span>
              <span className="text-slate-900 dark:text-slate-100">
                {result.scoreBreakdown.skillsMatch}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${result.scoreBreakdown.skillsMatch}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">
                Experience & Seniority
              </span>
              <span className="text-slate-900 dark:text-slate-100">
                {result.scoreBreakdown.experienceMatch}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${result.scoreBreakdown.experienceMatch}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">
                Core Requirements
              </span>
              <span className="text-slate-900 dark:text-slate-100">
                {result.scoreBreakdown.requirementsMatch}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-700"
                style={{
                  width: `${result.scoreBreakdown.requirementsMatch}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="card p-6 sm:p-7 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-2.5">
          <Layers className="w-4 h-4 text-blue-600" />
          Executive Fit Summary
        </h3>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {result.executiveSummary}
        </p>
      </div>

      {/* Strengths & Missing Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="card p-6 border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-300">
                Key Strengths & Matches ({result.strengths.length})
              </h3>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-400">
                Qualifications that strongly align with the job description
              </p>
            </div>
          </div>
          <ul className="space-y-2.5 pt-1">
            {result.strengths.map((str) => (
              <li
                key={str}
                className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
              >
                <span className="text-emerald-600 font-bold mt-0.5 shrink-0">
                  ✓
                </span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Skills */}
        <div className="card p-6 border border-rose-200 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-950 dark:text-rose-300">
                Missing Skills & ATS Gaps ({result.missingSkills.length})
              </h3>
              <p className="text-xs text-rose-700/80 dark:text-rose-400">
                Keywords and requirements from the JD absent in your resume
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {result.missingSkills.map((gap) => (
              <span
                key={gap}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SPECIFIC RESUME ADJUSTMENTS */}
      <div className="card p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Tailored Resume Adjustments ({result.resumeAdjustments.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Apply these specific bullet point changes and keyword placements
              to maximize interview callbacks
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyAllAdjustments}
            className="btn-secondary text-xs py-2 px-3.5 self-start sm:self-auto"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied All Changes
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy All Adjustments
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {result.resumeAdjustments.map((adj) => {
            const isHigh = adj.impact === "high";
            return (
              <div
                key={`${adj.section}-${adj.suggestion.slice(0, 30)}`}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {adj.section}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        isHigh
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {adj.impact} impact
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopyAdjustment(
                        adj.suggestion,
                        `${adj.section}-${adj.suggestion.slice(0, 20)}`,
                      )
                    }
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    title="Copy suggestion"
                  >
                    {copiedKey ===
                    `${adj.section}-${adj.suggestion.slice(0, 20)}` ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    Current Resume Weakness:
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                    {adj.issue}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Exact Recommended Revision:
                  </p>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-mono leading-relaxed select-all">
                    {adj.suggestion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interview Strategy Tips */}
      {result.interviewTips.length > 0 && (
        <div className="card p-6 sm:p-7 border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-3">
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            Interview Preparation Insights
          </h3>
          <ul className="space-y-2.5">
            {result.interviewTips.map((tip) => (
              <li
                key={tip}
                className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
              >
                <span className="text-indigo-600 font-bold mt-0.5 shrink-0">
                  &bull;
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Controls Bar */}
      <div className="card p-6 sm:p-7 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleCreateApplication}
            disabled={applying || appliedSuccess}
            className={`flex-1 btn-primary py-3.5 font-bold text-sm sm:text-base ${
              appliedSuccess ? "bg-emerald-600 hover:bg-emerald-600" : ""
            }`}
          >
            {applying ? (
              "Saving to Applications..."
            ) : appliedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Application Logged in Tracker!
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                Log in Applications Tracker with {result.fitScore}% Fit Score
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push("/applications")}
            className="btn-secondary text-sm py-3.5 px-6 shrink-0"
          >
            Go to Applications Tracker
          </button>
        </div>

        {appliedSuccess && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center">
            Saved to your Applications dashboard with this fit score and
            tailoring notes.
          </p>
        )}
      </div>
    </div>
  );
}
