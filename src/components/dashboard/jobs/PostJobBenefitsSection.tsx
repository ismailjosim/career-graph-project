"use client";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface PostJobBenefitsSectionProps {
  benefits: string[];
  setBenefits: (benefits: string[]) => void;
}

export function PostJobBenefitsSection({
  benefits,
  setBenefits,
}: PostJobBenefitsSectionProps) {
  const [newBenefitText, setNewBenefitText] = useState("");

  const handleAddBenefit = () => {
    const text = newBenefitText.trim();
    if (!text) return;
    setBenefits([...benefits, text]);
    setNewBenefitText("");
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, idx) => idx !== index));
  };

  return (
    <div className="card p-6 sm:p-7 space-y-4">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        Benefits & Perks (Optional)
      </h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={newBenefitText}
          onChange={(e) => setNewBenefitText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddBenefit();
            }
          }}
          placeholder="Add perk (e.g. $2,000 learning budget)"
          className="input text-sm h-10 flex-1"
        />
        <button
          type="button"
          onClick={handleAddBenefit}
          className="btn-secondary text-xs px-4 h-10 cursor-pointer font-bold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {benefits.map((benefit, idx) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: Benefit index
            key={idx}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-semibold"
          >
            <span>★ {benefit}</span>
            <button
              type="button"
              onClick={() => handleRemoveBenefit(idx)}
              className="hover:text-rose-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
