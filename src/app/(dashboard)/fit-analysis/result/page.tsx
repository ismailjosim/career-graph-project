"use client";

import {
  ArrowLeft,
  Printer,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ExecutiveSummaryCard,
  FitResultHero,
  InterviewTipsCard,
  QuickApplyBanner,
  ResumeAdjustmentsList,
  SkillsComparisonCard,
} from "@/components/dashboard/fit-analysis/result";
import type { StoredAnalysisPayload } from "@/interfaces/fit-analysis";
import { useSession } from "@/lib/auth-client";

export default function FitAnalysisResultPage() {
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
            <span>Go to Fit Analysis</span>
          </Link>
        </div>
      </div>
    );
  }

  const { result } = data;
  const jobTitle = data.meta?.jobTitle || data.jobInput?.title || "Target Role";
  const company =
    data.meta?.company || data.jobInput?.company || "Target Company";

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-20 animate-fade-in">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/fit-analysis"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition cursor-pointer"
            title="Back to Input"
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex flex-wrap items-baseline gap-x-2 gap-y-1 mt-0.5">
              <span>{jobTitle}</span>
              <span className="text-slate-400 font-normal text-base sm:text-lg">
                at
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {company}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-outline text-xs py-2 px-3 print:hidden cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <Link
            href="/fit-analysis"
            className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Analyze Another Job</span>
          </Link>
        </div>
      </div>

      {/* Hero Verdict & Fit Percentage Card */}
      <FitResultHero result={result} />

      {/* Quick Application Tracker Banner */}
      <QuickApplyBanner
        onApply={handleCreateApplication}
        applying={applying}
        appliedSuccess={appliedSuccess}
      />

      {/* Executive Summary */}
      <ExecutiveSummaryCard summary={result.executiveSummary} />

      {/* Key Strengths & Missing Skills */}
      <SkillsComparisonCard
        strengths={result.strengths}
        missingSkills={result.missingSkills}
      />

      {/* Resume Tailoring Adjustments */}
      <ResumeAdjustmentsList
        adjustments={result.resumeAdjustments}
        onCopyAdjustment={handleCopyAdjustment}
        copiedKey={copiedKey}
        onCopyAll={handleCopyAllAdjustments}
        copiedAll={copiedAll}
      />

      {/* Strategic Interview Tips */}
      <InterviewTipsCard tips={result.interviewTips} />
    </div>
  );
}
