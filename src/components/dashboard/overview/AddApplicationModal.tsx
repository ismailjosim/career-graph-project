"use client";

import { X } from "lucide-react";
import { useState } from "react";
import type { JobApplication } from "@/lib/validation";
import type { AddApplicationForm, AddApplicationModalProps } from "./types";

const initialFormState: AddApplicationForm = {
  jobTitle: "",
  company: "",
  description: "",
  jobLink: "",
  fitScore: "",
  notes: "",
  status: "applied",
  salary: "",
  location: "",
  employmentType: "",
};

export function AddApplicationModal({
  isOpen,
  onClose,
  createApplication,
  onSuccess,
}: AddApplicationModalProps) {
  const [formData, setFormData] =
    useState<AddApplicationForm>(initialFormState);
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
      const submissionData: Omit<
        JobApplication,
        "_id" | "userId" | "appliedAt"
      > = {
        jobTitle: formData.jobTitle,
        company: formData.company,
        description: formData.description || undefined,
        jobLink: formData.jobLink || undefined,
        fitScore: formData.fitScore
          ? Number.parseInt(formData.fitScore, 10)
          : undefined,
        notes: formData.notes || undefined,
        status: formData.status as JobApplication["status"],
        salary: formData.salary || undefined,
        location: formData.location || undefined,
        employmentType: formData.employmentType as
          | JobApplication["employmentType"]
          | undefined,
        resumeUsed: "default-resume",
      };

      await createApplication(submissionData);
      setFormData(initialFormState);
      onClose();
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create application",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="section-title text-xl">Add Job Application</h2>
            <p className="section-subtitle text-xs">
              Fill in the details to update your charts and tracking metrics
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-sm">
              {error}
            </div>
          )}

          {/* Job Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g., Senior Full Stack Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g., Stripe"
              />
            </div>
          </div>

          {/* Location & Employment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Remote / New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Status & Fit Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="applied">Applied</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="interviewed">Interviewed</option>
                <option value="offer_received">Offer Received 🎉</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Fit Score (0-100)
              </label>
              <input
                type="number"
                name="fitScore"
                value={formData.fitScore}
                onChange={handleChange}
                min="0"
                max="100"
                className="input"
                placeholder="e.g., 92"
              />
            </div>
          </div>

          {/* Salary Range & Job Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Salary Range
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="input"
                placeholder="e.g., $140,000 - $170,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Job Link
              </label>
              <input
                type="url"
                name="jobLink"
                value={formData.jobLink}
                onChange={handleChange}
                className="input"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="input"
              placeholder="Notes about interview rounds, referral, or benefits..."
            />
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Application"}
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
