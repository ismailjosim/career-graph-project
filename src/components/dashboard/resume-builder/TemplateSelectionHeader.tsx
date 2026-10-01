"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TemplateSelectionHeaderProps {
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  onNext: () => void;
  templatesCount: number;
  totalTemplates: number;
  page: number;
  totalPages: number;
}

export function TemplateSelectionHeader({
  categoryFilter,
  onCategoryFilterChange,
  onNext,
  templatesCount,
  totalTemplates,
  page,
  totalPages,
}: TemplateSelectionHeaderProps) {
  const categories = [
    { id: "all", label: "All Templates (50)" },
    { id: "tech", label: "Software & Tech" },
    { id: "creative", label: "Product & Creative" },
    { id: "executive", label: "Executive & Finance" },
    { id: "general", label: "Startups & General" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href="/resumes"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
            title="Back to Resumes"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 uppercase tracking-wider">
                Step 1 of 2
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                50 Recruiter-Approved Layouts • Showing 10 Per Page
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-space-grotesk">
              Select Your Resume Template & Variants
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Choose from 50 high-converting templates. You can pick custom font
              pairings and color swatches on any template.
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={onNext}
          className="btn-primary py-2.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 cursor-pointer bg-linear-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm shrink-0"
        >
          <span>Next: Edit Resume</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Filter Pills & Result Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryFilterChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                categoryFilter === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
          Showing {templatesCount} of {totalTemplates} templates • Page {page}{" "}
          of {totalPages}
        </span>
      </div>
    </div>
  );
}
