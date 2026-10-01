"use client";

import { X } from "lucide-react";
import { useState } from "react";
import type { AddWishlistModalProps, WishlistFormData } from "./types";

const initialFormState: WishlistFormData = {
  title: "",
  company: "",
  description: "",
  link: "",
  notes: "",
  status: "saved",
};

export function AddWishlistModal({
  isOpen,
  onClose,
  onAdd,
}: AddWishlistModalProps) {
  const [formData, setFormData] = useState<WishlistFormData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onAdd({
        title: formData.title,
        company: formData.company,
        description: formData.description,
        link: formData.link,
        notes: formData.notes || undefined,
        status: formData.status,
      });
      setFormData(initialFormState);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add job to wishlist",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="section-title text-xl">Add Job to Wishlist</h2>
            <p className="section-subtitle text-xs">
              Save a job post to review, compare, or apply later
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Lead Frontend Engineer"
                value={formData.title}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Company *
              </label>
              <input
                type="text"
                name="company"
                placeholder="e.g. Vercel"
                value={formData.company}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Job Link *
              </label>
              <input
                type="url"
                name="link"
                placeholder="https://..."
                value={formData.link}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input cursor-pointer"
              >
                <option value="saved">Saved</option>
                <option value="reviewing">Reviewing</option>
                <option value="decided">Decided</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Key job requirements or salary details..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Personal Notes
            </label>
            <textarea
              name="notes"
              placeholder="Why you're interested, referral contacts, pros/cons..."
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="input"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Job"}
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
