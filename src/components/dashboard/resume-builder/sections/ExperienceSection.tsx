"use client";

import { Briefcase, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTokens } from "@/context/tokens-context";
import { generateId } from "../resumeBuilder.utils";
import type { ResumeExperienceItem } from "../types";
import { ExperienceItemCard } from "./ExperienceItemCard";

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
        exp.id === expId
          ? { ...exp, highlights: [...exp.highlights, ""] }
          : exp,
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
              No work experience added yet. Click &quot;Add Role&quot; above to
              list your career history.
            </div>
          ) : (
            experiences.map((exp, expIdx) => (
              <ExperienceItemCard
                key={exp.id}
                exp={exp}
                roleNumber={experiences.length - expIdx}
                onUpdate={(fields) => updateExperience(exp.id, fields)}
                onRemove={() => removeExperience(exp.id)}
                onAddHighlight={() => addHighlightToExperience(exp.id)}
                onUpdateHighlight={(idx, val) =>
                  updateHighlight(exp.id, idx, val)
                }
                onRemoveHighlight={(idx) => removeHighlight(exp.id, idx)}
                onAiPolish={() => handleAiPolishBullets(exp.id)}
                isPolishing={isPolishing}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
