"use client";

import { X } from "lucide-react";
import { useState } from "react";
import type { AddResumeModalProps, ResumeFormData } from "./types";

const initialFormState: ResumeFormData = {
  name: "",
  fileName: "",
  fileUrl: "",
};

export function AddResumeModal({
  isOpen,
  onClose,
  onAdd,
}: AddResumeModalProps) {
  const [formData, setFormData] = useState<ResumeFormData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await onAdd(formData);
      setFormData(initialFormState);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add resume version",
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
            <h2 className="section-title text-xl">Add New Resume</h2>
            <p className="section-subtitle text-xs">
              Add a version of your resume to link to job applications
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Resume Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Senior Full-Stack Engineer Resume"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              File Name *
            </label>
            <input
              type="text"
              name="fileName"
              placeholder="e.g. ismail_resume_2026.pdf"
              value={formData.fileName}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              File URL *
            </label>
            <input
              type="url"
              name="fileUrl"
              placeholder="https://drive.google.com/... or https://..."
              value={formData.fileUrl}
              onChange={handleChange}
              required
              className="input"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Upload to Google Drive, Dropbox, or S3 and paste the shareable
              link.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Resume"}
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
