"use client";

import { Check, Copy, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { confirmAction } from "@/lib/alerts";
import {
  formatCoverLetterDate,
  getWordAndCharCount,
} from "./coverLetter.utils";
import type { CoverLetterCardProps } from "./types";

export function CoverLetterCard({
  letter,
  onEdit,
  onDelete,
}: CoverLetterCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { words } = getWordAndCharCount(letter.content);
  const formattedDate = formatCoverLetterDate(letter.updatedAt);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter.content);
      setCopied(true);
      toast.success("Cover letter copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy cover letter:", err);
      toast.error("Failed to copy text to clipboard");
    }
  };

  const handleDelete = async () => {
    if (!letter._id) return;
    const confirmed = await confirmAction({
      title: "Delete Cover Letter?",
      text: `Are you sure you want to delete "${letter.title}"? This cannot be undone.`,
      isDestructive: true,
      confirmButtonText: "Delete Letter",
    });

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(letter._id);
      toast.success("Cover letter deleted successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete cover letter",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card p-6 group hover:shadow-lg transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {letter.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Updated {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                copied
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200 dark:border-emerald-800"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent"
              }`}
              title={copied ? "Copied!" : "Copy cover letter"}
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => onEdit(letter)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl transition-colors cursor-pointer"
              title="Edit cover letter"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              title="Delete cover letter"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap line-clamp-3 mb-4 leading-relaxed font-normal">
          {letter.content}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md font-medium">
          {words} {words === 1 ? "word" : "words"}
        </span>

        <button
          type="button"
          onClick={() => onEdit(letter)}
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
        >
          View & Edit Letter →
        </button>
      </div>
    </div>
  );
}
