"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { UploadResponse } from "@/lib/upload-client";
import {
  type PlanUsageData,
  ResumePlanLimitBanner,
} from "./ResumePlanLimitBanner";
import { ResumeSourceSelector } from "./ResumeSourceSelector";
import type { AddResumeModalProps, ResumeFormData } from "./types";

const initialFormState: ResumeFormData = {
  name: "",
  fileName: "",
  fileUrl: "",
  cloudinaryPublicId: "",
  fileSize: undefined,
};

export function AddResumeModal({
  isOpen,
  onClose,
  onAdd,
  resumes = [],
  onDeleteResume,
}: AddResumeModalProps) {
  const [formData, setFormData] = useState<ResumeFormData>(initialFormState);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planUsage, setPlanUsage] = useState<PlanUsageData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPlanUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/user/plan-usage");
      if (res.ok) {
        const data = await res.json();
        setPlanUsage(data);
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchPlanUsage();
    }
  }, [isOpen, fetchPlanUsage]);

  if (!isOpen) return null;

  const isLimitReached = planUsage
    ? planUsage.resumes.isLimitReached
    : resumes.length >= 1; // Default fallback to 1 for free

  const handleUploadSuccess = (res: UploadResponse) => {
    setUploadedFile(res);
    setFormData((prev) => {
      let suggestedName = prev.name;
      if (!suggestedName) {
        suggestedName = res.fileName
          ? res.fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
          : "My Resume";
      }
      return {
        ...prev,
        name: suggestedName,
        fileName: res.fileName || "resume.pdf",
        fileUrl: res.url,
        cloudinaryPublicId: res.publicId,
        fileSize: res.fileSize,
      };
    });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteExisting = async (id: string, name: string) => {
    if (!onDeleteResume) return;
    setDeletingId(id);
    try {
      await onDeleteResume(id);
      toast.success(`"${name}" removed. Space is now available to upload!`);
      await fetchPlanUsage();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove resume",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) {
      setError(
        "Resume limit reached. Please remove an older resume or upgrade to add more.",
      );
      return;
    }

    if (!formData.fileUrl) {
      setError("Please upload a PDF resume or provide a valid file URL.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onAdd(formData);
      setFormData(initialFormState);
      setUploadedFile(null);
      setUploadMode("file");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add resume version",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setUploadedFile(null);
    setUploadMode("file");
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="section-title text-xl">Add New Resume</h2>
              {planUsage && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                  {planUsage.badge} ({planUsage.resumes.count}/
                  {planUsage.resumes.max})
                </span>
              )}
            </div>
            <p className="section-subtitle text-xs mt-0.5">
              Upload a PDF version of your resume to link to job applications
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Limit Reached Warning Card */}
          {isLimitReached && (
            <ResumePlanLimitBanner
              planUsage={planUsage}
              resumes={resumes}
              deletingId={deletingId}
              onDeleteExisting={handleDeleteExisting}
              onCloseModal={onClose}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-sm">
                {error}
              </div>
            )}

            {/* Source Selection (Upload or URL) */}
            <ResumeSourceSelector
              uploadMode={uploadMode}
              onModeChange={setUploadMode}
              fileUrl={formData.fileUrl}
              onUrlChange={handleChange}
              uploadedFile={uploadedFile}
              onUploadSuccess={handleUploadSuccess}
              onError={(err) => setError(err)}
            />

            {/* Display Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Resume Label / Title *
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Software Engineer 2026, Frontend Lead"
                value={formData.name}
                onChange={handleChange}
                className="input text-sm"
                required
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary text-xs py-2 px-4 cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.fileUrl || isLimitReached}
                className="btn-primary text-xs py-2 px-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Resume..." : "Save Resume"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
