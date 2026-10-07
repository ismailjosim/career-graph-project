"use client";

import { Award, Pencil, Trash2 } from "lucide-react";
import type { EducationEntry } from "./types";

interface EducationItemCardProps {
  entry: EducationEntry;
  index: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export function EducationItemCard({
  entry,
  index,
  onEdit,
  onRemove,
}: EducationItemCardProps) {
  const timeline =
    entry.startYear || entry.endYear
      ? `${entry.startYear || ""}${
          entry.startYear && entry.endYear ? " - " : ""
        }${entry.endYear || ""}`
      : null;

  return (
    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 group transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {entry.degree}
              {entry.fieldOfStudy ? ` in ${entry.fieldOfStudy}` : ""}
            </h4>
            {timeline && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40">
                {timeline}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
            {entry.institution}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(index)}
            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
            title="Edit qualification"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
            title="Delete qualification"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grade and Credits Tags */}
      {(entry.grade || entry.credits) && (
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
          {entry.grade && (
            <span className="inline-flex items-center gap-1 font-medium bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              <Award className="w-3 h-3 text-amber-500" />
              <span>Grade: {entry.grade}</span>
            </span>
          )}
          {entry.credits && (
            <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-medium">
              Credits: {entry.credits}
            </span>
          )}
        </div>
      )}

      {entry.activities && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
          {entry.activities}
        </p>
      )}
    </div>
  );
}
