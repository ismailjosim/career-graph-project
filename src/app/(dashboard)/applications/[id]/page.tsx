"use client";

import { ArrowLeft, Check, Edit3, ExternalLink, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useJobApplications } from "@/hooks/useApi";
import { confirmAction } from "@/lib/alerts";
import { useSession } from "@/lib/auth-client";
import { useDocumentTitle } from "@/components/PageTitleManager";
import type { JobApplication } from "@/lib/validation";

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { updateApplication, deleteApplication } = useJobApplications();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<JobApplication>>({});
  const [id, setId] = useState<string>("");

  useDocumentTitle(
    application
      ? `${application.jobTitle} at ${application.company}`
      : "Application Details",
  );

  useEffect(() => {
    const resolveParams = async () => {
      const { id: resolvedId } = await params;
      setId(resolvedId);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id || !userId) return;

    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/applications/${id}`, {
          headers: { "x-user-id": userId },
        });
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setApplication(data);
        setFormData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id, userId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updated = await updateApplication(id, {
        status: newStatus as JobApplication["status"],
      });
      setApplication(updated);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await updateApplication(id, formData);
      setApplication(updated);
      setIsEditing(false);
      toast.success("Application updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update application",
      );
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmAction({
      title: "Delete Application?",
      text: `Are you sure you want to delete this application for ${application?.jobTitle || "this role"}? This cannot be undone.`,
      isDestructive: true,
      confirmButtonText: "Delete Application",
    });

    if (!confirmed) return;

    try {
      await deleteApplication(id);
      toast.success("Application deleted successfully!");
      router.push("/applications");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete application",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="card p-12 text-center max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Application Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          The application you are looking for does not exist or has been
          deleted.
        </p>
        <Link href="/applications" className="btn-primary">
          Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/applications"
            className="p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {application.jobTitle}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-base mt-0.5">
              {application.company}
            </p>
          </div>
        </div>

        {application.jobLink && (
          <a
            href={application.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline hidden sm:inline-flex"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Job Posting</span>
          </a>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Info Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Job Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Job Title
                </label>
                <div className="mt-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.jobTitle || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, jobTitle: e.target.value })
                      }
                      className="input py-2 text-sm"
                    />
                  ) : (
                    <p className="text-slate-900 dark:text-slate-100 font-medium">
                      {application.jobTitle}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Company
                </label>
                <div className="mt-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.company || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="input py-2 text-sm"
                    />
                  ) : (
                    <p className="text-slate-900 dark:text-slate-100 font-medium">
                      {application.company}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Location
                </label>
                <div className="mt-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="input py-2 text-sm"
                    />
                  ) : (
                    <p className="text-slate-900 dark:text-slate-100">
                      {application.location || "Not specified"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Employment Type
                </label>
                <p className="text-slate-900 dark:text-slate-100 mt-1 capitalize">
                  {application.employmentType?.replace("-", " ") || "Full-time"}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Salary Range
                </label>
                <p className="text-slate-900 dark:text-slate-100 mt-1">
                  {application.salary || "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Fit Score
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {application.fitScore ? `${application.fitScore}%` : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(application);
                  }}
                  className="btn-secondary text-sm"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-primary text-sm">
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Description Card */}
          {application.description && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Job Description
              </h2>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                {application.description}
              </p>
            </div>
          )}

          {/* Notes Card */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
              Application Notes
            </h2>
            {isEditing ? (
              <textarea
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="input h-32 text-sm"
                placeholder="Write your notes here..."
              />
            ) : (
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {application.notes || "No notes added yet."}
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Status, Timeline & Quick Actions */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
              Current Status
            </h2>
            <select
              value={application.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="input text-sm cursor-pointer"
            >
              <option value="applied">Applied</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="interviewed">Interviewed</option>
              <option value="offer_received">Offer Received</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Timeline Card */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
              Timeline
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Applied on
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {new Date(application.appliedAt).toLocaleDateString()}
                </span>
              </div>
              {application.responseAt && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Response
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {new Date(application.responseAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone / Delete */}
          <div className="card p-6 border-rose-200 dark:border-rose-900/40">
            <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-2">
              Manage Application
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Permanently remove this application from your tracking dashboard.
            </p>
            <button
              onClick={handleDelete}
              className="btn-danger w-full text-sm py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
