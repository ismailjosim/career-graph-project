"use client";

import { CheckCircle2, Link2, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { FileUploadProgress } from "@/components/ui/FileUploadProgress";
import type { UploadResponse } from "@/lib/upload-client";
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
}: AddResumeModalProps) {
  const [formData, setFormData] = useState<ResumeFormData>(initialFormState);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUploadSuccess = (res: UploadResponse) => {
    setUploadedFile(res);
    setFormData((prev) => {
      // Suggest clean display name if user hasn't typed one
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            <h2 className="section-title text-xl">Add New Resume</h2>
            <p className="section-subtitle text-xs">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-sm">
              {error}
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUploadMode("file")}
              className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                uploadMode === "file"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload PDF File</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("url")}
              className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                uploadMode === "url"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>External URL</span>
            </button>
          </div>

          {/* Cloudinary File Upload Dropzone */}
          {uploadMode === "file" && (
            <div className="space-y-3">
              <FileUploadProgress
                type="resume"
                label="Select or Drag & Drop PDF Resume"
                description="Secure upload to Cloudinary (PDF up to 10MB)"
                onSuccess={handleUploadSuccess}
                onError={(err) => setError(err)}
              />

              {uploadedFile && (
                <div className="flex items-center gap-3 p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {uploadedFile.fileName || "resume.pdf"}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      Uploaded successfully •{" "}
                      {(uploadedFile.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <a
                    href={uploadedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-emerald-700 dark:text-emerald-300 hover:text-emerald-900"
                  >
                    Preview
                  </a>
                </div>
              )}
            </div>
          )}

          {/* External URL Mode */}
          {uploadMode === "url" && (
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
          )}

          {/* Resume Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Resume Name / Title *
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

          {/* File Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              File Name Display *
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

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading || !formData.fileUrl}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Resume"}
            </button>
            <button
              type="button"
              onClick={handleClose}
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
