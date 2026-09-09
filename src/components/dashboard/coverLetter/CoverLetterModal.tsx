"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getWordAndCharCount } from "./coverLetter.utils";
import type { CoverLetterFormData, CoverLetterModalProps } from "./types";

export function CoverLetterModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: CoverLetterModalProps) {
  const [formData, setFormData] = useState<CoverLetterFormData>({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
      });
    } else {
      setFormData({ title: "", content: "" });
    }
    setError(null);
  }, [initialData]);

  if (!isOpen) return null;

  const { words, chars } = getWordAndCharCount(formData.content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save cover letter",
      );
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(initialData?._id);

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-3xl animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="section-title text-xl">
              {isEditing ? "Edit Cover Letter" : "Create New Cover Letter"}
            </h2>
            <p className="section-subtitle text-xs">
              Tailor this cover letter for your target role or company
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer - Stripe"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="input"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Content *
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {words} words • {chars} characters
              </span>
            </div>
            <textarea
              placeholder="Write or paste your personalized cover letter here..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              rows={14}
              className="input font-sans text-sm leading-relaxed"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Cover Letter"
                  : "Create Cover Letter"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
