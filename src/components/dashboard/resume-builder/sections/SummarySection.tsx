"use client";

import { BookOpen, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTokens } from "@/context/tokens-context";

interface SummarySectionProps {
  summary: string;
  headline?: string;
  onChange: (summary: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SummarySection({
  summary,
  headline,
  onChange,
  isOpen,
  onToggle,
}: SummarySectionProps) {
  const { updateTokensLocally } = useTokens();
  const [isPolishing, setIsPolishing] = useState(false);

  const handleAiPolishSummary = async () => {
    if (!summary || !summary.trim()) {
      toast.error(
        "Please write a draft summary before asking AI to enhance it.",
      );
      return;
    }

    setIsPolishing(true);
    try {
      const res = await fetch("/api/ai/resume-polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "summary",
          text: summary,
          role: headline,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to enhance summary");
      }

      onChange(resData.enhancedText);

      if (typeof resData.newBalance === "number") {
        updateTokensLocally(resData.newBalance);
      }

      toast.success("Summary enhanced with AI! (15 Tokens used)");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI enhancement failed");
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Professional Summary</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAiPolishSummary}
            disabled={isPolishing}
            className="text-xs px-2.5 py-1 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
            title="Enhance summary with AI (15 Tokens)"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{isPolishing ? "Polishing..." : "AI Polish (15🪙)"}</span>
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="p-1 cursor-pointer text-slate-400"
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 bg-white dark:bg-slate-900">
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Provide a concise 3-4 sentence summary highlighting your core expertise, quantified accomplishments, and career focus..."
            className="input-field text-sm w-full leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}
