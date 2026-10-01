"use client";
import { CheckCircle2, Coins, Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PostJobRequirementsSectionProps {
  requirements: string[];
  setRequirements: (reqs: string[]) => void;
  computedTokenCost: number;
}

export function PostJobRequirementsSection({
  requirements,
  setRequirements,
  computedTokenCost,
}: PostJobRequirementsSectionProps) {
  const [newRequirementText, setNewRequirementText] = useState("");

  const handleAddRequirement = () => {
    const text = newRequirementText.trim();
    if (!text) return;
    if (requirements.includes(text)) {
      toast.error("Requirement already added");
      return;
    }
    setRequirements([...requirements, text]);
    setNewRequirementText("");
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, idx) => idx !== index));
  };

  return (
    <div className="card p-6 sm:p-7 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Requirements Builder & Token Cost</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Each requirement dynamically adjusts the token cost applicants pay.
          </p>
        </div>

        {/* Live Token Calculator Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 font-extrabold text-sm shrink-0 shadow-xs">
          <Coins className="w-4 h-4 text-amber-500" />
          <span>{computedTokenCost} Tokens to Apply</span>
        </div>
      </div>

      {/* Add requirement input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newRequirementText}
          onChange={(e) => setNewRequirementText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddRequirement();
            }
          }}
          placeholder="Add requirement (e.g. 5+ years React and Node.js)"
          className="input text-sm h-10 flex-1"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="btn-secondary text-xs px-4 h-10 cursor-pointer font-bold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Requirements list */}
      <div className="space-y-2">
        {requirements.map((req, idx) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Requirement index
            key={idx}
            className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                {req}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveRequirement(idx)}
              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Remove requirement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
