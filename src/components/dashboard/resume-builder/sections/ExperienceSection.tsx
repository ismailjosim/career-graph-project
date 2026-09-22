"use client";

import { Briefcase, ChevronDown, ChevronUp, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTokens } from "@/context/tokens-context";
import { generateId } from "../resumeBuilder.utils";
import type { ResumeExperienceItem } from "../types";

interface ExperienceSectionProps {
  experiences: ResumeExperienceItem[];
  onChange: (experiences: ResumeExperienceItem[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ExperienceSection({
  experiences,
  onChange,
  isOpen,
  onToggle,
}: ExperienceSectionProps) {
  const { updateTokensLocally } = useTokens();
  const [isPolishing, setIsPolishing] = useState(false);

  const addExperience = () => {
    const newExp: ResumeExperienceItem = {
      id: generateId(),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      highlights: [""],
    };
    onChange([...experiences, newExp]);
  };

  const updateExperience = (
    id: string,
    fields: Partial<ResumeExperienceItem>,
  ) => {
    onChange(
      experiences.map((exp) => (exp.id === id ? { ...exp, ...fields } : exp)),
    );
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  const addHighlightToExperience = (expId: string) => {
    onChange(
      experiences.map((exp) =>
        exp.id === expId ? { ...exp, highlights: [...exp.highlights, ""] } : exp,
      ),
    );
  };

  const updateHighlight = (
    expId: string,
    highlightIdx: number,
    val: string,
  ) => {
    onChange(
      experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        const newHighlights = [...exp.highlights];
        newHighlights[highlightIdx] = val;
        return { ...exp, highlights: newHighlights };
      }),
    );
  };

  const removeHighlight = (expId: string, highlightIdx: number) => {
    onChange(
      experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          highlights: exp.highlights.filter((_, i) => i !== highlightIdx),
        };
      }),
    );
  };

  const handleAiPolishBullets = async (expId: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;

    const rawText =
      exp.highlights.length > 0 ? exp.highlights.join("\n") : exp.description;
    if (!rawText || !rawText.trim()) {
      toast.error(
        "Please provide bullet points or a role description for AI to rewrite.",
      );
      return;
    }

    setIsPolishing(true);
    try {
      const res = await fetch("/api/ai/resume-polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bullet",
          text: rawText,
          role: exp.role,
          company: exp.company,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to rewrite bullets");
      }

      const parsedBullets = resData.enhancedText
        .split("\n")
        .map((line: string) => line.replace(/^[•\-*]\s*/, "").trim())
        .filter(Boolean);

      onChange(
        experiences.map((e) =>
          e.id === expId ? { ...e, highlights: parsedBullets } : e,
        ),
      );

      if (typeof resData.newBalance === "number") {
        updateTokensLocally(resData.newBalance);
      }

      toast.success(
        "Experience bullet points rewritten with AI! (10 Tokens used)",
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "AI bullet polish failed",
      );
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
          <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Work Experience ({experiences.length})</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addExperience}
            className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-100"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Role</span>
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
        <div className="p-5 space-y-5 bg-white dark:bg-slate-900">
          {experiences.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No work experience added yet. Click &quot;Add Role&quot; above
              to list your career history.
            </div>
          ) : (
            experiences.map((exp, expIdx) => (
              <div
                key={exp.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3 relative group"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Role #{experiences.length - expIdx}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAiPolishBullets(exp.id)}
                      disabled={isPolishing}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold flex items-center gap-1 cursor-pointer hover:opacity-90 disabled:opacity-50"
                      title="Rewrite bullet points using Google XYZ formula (10 Tokens)"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>AI Bullets (10🪙)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                      title="Remove role"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Job Title / Role *
                    </label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) =>
                        updateExperience(exp.id, { role: e.target.value })
                      }
                      placeholder="Lead Full-Stack Engineer"
                      className="input-field text-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, { company: e.target.value })
                      }
                      placeholder="Acme Corp"
                      className="input-field text-sm w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location || ""}
                      onChange={(e) =>
                        updateExperience(exp.id, { location: e.target.value })
                      }
                      placeholder="San Francisco, CA"
                      className="input-field text-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, {
                          startDate: e.target.value,
                        })
                      }
                      placeholder="Jan 2022"
                      className="input-field text-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      End Date
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={exp.isCurrent ? "Present" : exp.endDate || ""}
                        disabled={exp.isCurrent}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            endDate: e.target.value,
                          })
                        }
                        placeholder="Dec 2024"
                        className="input-field text-sm w-full disabled:opacity-60"
                      />
                      <label className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 shrink-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.isCurrent}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              isCurrent: e.target.checked,
                              endDate: e.target.checked ? "Present" : "",
                            })
                          }
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Current
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bullet Points Highlights */}
                <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Key Accomplishments & Bullet Points
                    </label>
                    <button
                      type="button"
                      onClick={() => addHighlightToExperience(exp.id)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>

                  {exp.highlights.map((bullet, bIdx) => (
                    <div
                      key={`exp-highlight-${exp.id}-${bIdx}`}
                      className="flex items-start gap-2"
                    >
                      <span className="text-slate-400 text-xs mt-2">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) =>
                          updateHighlight(exp.id, bIdx, e.target.value)
                        }
                        placeholder="Action verb + Context + Metric (e.g., Architected microservices pipeline reducing latency by 40%)..."
                        className="input-field text-xs w-full leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlight(exp.id, bIdx)}
                        className="text-slate-400 hover:text-rose-500 p-1 mt-1 transition-colors cursor-pointer"
                        title="Remove bullet"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
