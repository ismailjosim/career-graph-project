"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useJobApplications } from "@/hooks/useApi";
import type { JobApplication } from "@/lib/validation";

export default function NewApplicationPage() {
  const router = useRouter();
  const { createApplication } = useJobApplications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    description: "",
    jobLink: "",
    resumeUsed: "",
    coverLetterUsed: "",
    fitScore: "",
    notes: "",
    status: "applied",
    salary: "",
    location: "",
    employmentType: "",
  });

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
          ? parseInt(formData.fitScore, 10)
          : undefined,
        notes: formData.notes || undefined,
        status: formData.status as JobApplication["status"],
        salary: formData.salary || undefined,
        location: formData.location || undefined,
        employmentType: formData.employmentType as
          | JobApplication["employmentType"]
          | undefined,
        resumeUsed: formData.resumeUsed || "default-resume",
        coverLetterUsed: formData.coverLetterUsed || undefined,
      };

      await createApplication(submissionData);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create application",
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/applications"
          className="p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Add Job Application
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Keep track of job details, interview progress, and notes
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-sm">
            {error}
          </div>
        )}

        {/* Job Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
            className="input"
            placeholder="e.g., Senior Frontend Developer"
          />
        </div>

        {/* Company */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company *
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="input"
            placeholder="e.g., Google"
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input"
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        {/* Employment Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Salary */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Range
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="input"
            placeholder="e.g., $100k - $150k"
          />
        </div>

        {/* Job Link */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input"
            placeholder="Paste the job description here..."
          />
        </div>

        {/* Fit Score */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            placeholder="e.g., 85"
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="input"
            placeholder="Add any notes about this application..."
          />
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 input"
          >
            <option value="applied">Applied</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="interviewed">Interviewed</option>
            <option value="offer_received">Offer Received</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary py-3"
          >
            {loading ? "Creating..." : "Create Application"}
          </button>
          <Link
            href="/applications"
            className="flex-1 btn-secondary py-3 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
