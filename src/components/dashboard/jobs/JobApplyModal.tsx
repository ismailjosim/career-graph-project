"use client";

import { AlertCircle, Briefcase, Coins, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTokens } from "@/context/tokens-context";
import type { JobApplyModalProps } from "./types";

interface SavedResumeOption {
  _id: string;
  name: string;
  fileName: string;
  isDefault: boolean;
}

interface SavedCoverLetterOption {
  _id: string;
  title: string;
}

export function JobApplyModal({
  job,
  isOpen,
  onClose,
  onSuccess,
}: JobApplyModalProps) {
  const { tokens, updateTokensLocally, refreshTokens } = useTokens();

  const [resumes, setResumes] = useState<SavedResumeOption[]>([]);
  const [coverLetters, setCoverLetters] = useState<SavedCoverLetterOption[]>(
    [],
  );
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenCost = job?.tokenCost || 5;
  const hasEnoughTokens = tokens >= tokenCost;
  const balanceAfter = tokens - tokenCost;

  useEffect(() => {
    if (!isOpen || !job) return;

    setError(null);
    setLoadingData(true);

    Promise.all([
      fetch("/api/resumes")
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => []),
      fetch("/api/cover-letters")
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => []),
    ])
      .then(([resumesData, coverLettersData]) => {
        setResumes(resumesData);
        setCoverLetters(coverLettersData);

        // Pre-select default resume
        const def = resumesData.find((r: SavedResumeOption) => r.isDefault);
        if (def) {
          setSelectedResumeId(def._id);
        } else if (resumesData.length > 0) {
          setSelectedResumeId(resumesData[0]._id);
        }
      })
      .finally(() => setLoadingData(false));
  }, [isOpen, job]);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId) {
      setError("Please select a resume for this application.");
      return;
    }

    if (!hasEnoughTokens) {
      setError(
        `Insufficient tokens. You have ${tokens} tokens, but ${tokenCost} are required.`,
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/jobs/${job._id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          coverLetterId: selectedCoverLetterId || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      toast.success(
        `Application sent! ${tokenCost} tokens deducted. Job added to your pipeline.`,
      );
      if (typeof data.newBalance === "number") {
        updateTokensLocally(data.newBalance);
      } else {
        await refreshTokens();
      }

      onSuccess(data.application?._id || "", data.newBalance ?? balanceAfter);
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit application";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-lg p-5 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 mb-1.5">
              <Briefcase className="w-3 h-3" />
              <span>Apply to Platform Role</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
              {job.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {job.company} • {job.location}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Token Deduction Breakdown Card */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Application Token Fee:</span>
            </div>
            <span className="font-bold font-mono text-sm">
              {tokenCost} Tokens
            </span>
          </div>

          <p className="text-[11px] text-amber-700 dark:text-amber-300">
            Calculated fairly based on {job.requirements?.length || 0}{" "}
            requirements (Base 5 + 1 per requirement).
          </p>

          <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/60 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              Current balance: <strong>{tokens} Tokens</strong>
            </span>
            <span
              className={`font-semibold ${
                hasEnoughTokens
                  ? "text-slate-700 dark:text-slate-300"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {hasEnoughTokens
                ? `Remaining after: ${balanceAfter}`
                : "Insufficient Balance"}
            </span>
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* If Insufficient Tokens: CTA to buy tokens */}
        {!hasEnoughTokens && (
          <div className="p-3.5 rounded-xl bg-linear-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="text-amber-800 dark:text-amber-300">
              Need {tokenCost - tokens} more tokens to submit this application.
            </div>
            <Link
              href="/pricing"
              className="btn-primary text-xs py-1.5 px-3 shrink-0 shadow-xs"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Get Tokens</span>
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resume Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Select Resume <span className="text-rose-500">*</span>
            </label>

            {loadingData ? (
              <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : resumes.length === 0 ? (
              <div className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-center space-y-2">
                <p className="text-slate-500">
                  You don&apos;t have any uploaded resumes yet.
                </p>
                <Link
                  href="/resumes"
                  className="text-blue-600 font-semibold hover:underline inline-block"
                >
                  + Upload a resume first
                </Link>
              </div>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                required
                className="input text-xs sm:text-sm h-10 w-full"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} {r.isDefault ? "(Default)" : ""} - {r.fileName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Optional Cover Letter Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Cover Letter (Optional)
              </label>
              <Link
                href={`/cover-letters?title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`}
                className="text-[11px] text-blue-600 hover:underline font-semibold"
              >
                + Draft custom letter
              </Link>
            </div>

            <select
              value={selectedCoverLetterId}
              onChange={(e) => setSelectedCoverLetterId(e.target.value)}
              className="input text-xs sm:text-sm h-10 w-full"
            >
              <option value="">None (Submit without cover letter)</option>
              {coverLetters.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Notes / Referral Info (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Referred by Sarah; followed up via hiring manager message"
              rows={2}
              className="input py-2 text-xs sm:text-sm w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs sm:text-sm py-2 px-4 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !hasEnoughTokens || resumes.length === 0}
              className="btn-primary text-xs sm:text-sm py-2 px-5 cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Deduct {tokenCost} Tokens & Apply</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
