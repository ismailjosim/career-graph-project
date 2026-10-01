"use client";

import { Coins, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useTokens } from "@/context/tokens-context";
import { confirmTokenUsage } from "@/lib/alerts";

interface CoverLetterAiArchitectProps {
  initialJobTitle?: string;
  initialCompany?: string;
  initialJobDescription?: string;
  initialAutoOpen?: boolean;
  onGenerated: (data: { title: string; content: string }) => void;
}

export function CoverLetterAiArchitect({
  initialJobTitle = "",
  initialCompany = "",
  initialJobDescription = "",
  initialAutoOpen = false,
  onGenerated,
}: CoverLetterAiArchitectProps) {
  const { tokens, refreshTokens, updateTokensLocally } = useTokens();

  const [showAi, setShowAi] = useState(initialAutoOpen);
  const [aiJobTitle, setAiJobTitle] = useState(initialJobTitle);
  const [aiCompany, setAiCompany] = useState(initialCompany);
  const [aiJobDescription, setAiJobDescription] = useState(
    initialJobDescription,
  );
  const [aiTone, setAiTone] = useState("confident and professional");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateWithAi = async () => {
    if (!aiJobTitle.trim()) {
      const msg = "Please provide a target job title.";
      setAiError(msg);
      toast.error(msg);
      return;
    }

    const confirmed = await confirmTokenUsage({
      featureName: "AI Cover Letter Architect",
      tokenCost: 20,
      currentTokens: tokens,
    });

    if (!confirmed) return;

    setAiGenerating(true);
    setAiError(null);
    const toastId = toast.loading("Crafting tailored cover letter with AI...");

    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: aiJobTitle.trim(),
          company: aiCompany.trim(),
          jobDescription: aiJobDescription.trim(),
          tone: aiTone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate cover letter");
      }

      onGenerated({
        title: data.title,
        content: data.content,
      });

      if (typeof data.remainingTokens === "number") {
        updateTokensLocally(data.remainingTokens);
      }
      refreshTokens();
      setShowAi(false);
      toast.success(
        "Cover letter generated successfully! 20 tokens deducted.",
        {
          id: toastId,
        },
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI generation failed";
      setAiError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="p-6 pb-0">
      <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 bg-linear-to-r from-indigo-50/50 via-purple-50/30 to-indigo-50/50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-indigo-950/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                AI Cover Letter Architect
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Draft a tailored letter in seconds based on your profile (Cost:
                20 Tokens)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAi(!showAi)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            {showAi ? "Hide AI Form" : "Generate with AI"}
          </button>
        </div>

        {showAi && (
          <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/40 space-y-3">
            {tokens < 20 ? (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>
                    You have <strong>{tokens} tokens</strong>. Generating a
                    cover letter requires <strong>20 tokens</strong>.
                  </span>
                </div>
                <Link
                  href="/pricing"
                  className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] shrink-0"
                >
                  Top Up
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Target Role / Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Frontend Engineer"
                      value={aiJobTitle}
                      onChange={(e) => setAiJobTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Stripe, Linear"
                      value={aiCompany}
                      onChange={(e) => setAiCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Job Description / Requirements (Recommended)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Paste the full job post description, responsibilities, or qualification requirements here..."
                    value={aiJobDescription}
                    onChange={(e) => setAiJobDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden resize-y"
                  />
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    AI Engine will analyze this full post and tailor your
                    background and achievements directly to match.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Letter Tone & Voice
                  </label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  >
                    <option value="confident and professional">
                      Confident & Professional (Standard)
                    </option>
                    <option value="enthusiastic, high-energy, and ambitious">
                      Enthusiastic & High-Energy
                    </option>
                    <option value="executive, strategic, and metric-oriented">
                      Executive & Strategic
                    </option>
                    <option value="conversational, modern, and personable">
                      Conversational & Modern
                    </option>
                    <option value="formal and traditional">
                      Formal & Academic
                    </option>
                  </select>
                </div>

                {aiError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {aiError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleGenerateWithAi}
                  disabled={aiGenerating}
                  className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Crafting Custom Cover Letter with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Cover Letter (20 Tokens)</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
