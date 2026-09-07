"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useJobApplications } from "@/hooks/useApi";
import type { JobApplication } from "@/lib/validation";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

const USER_ID = "demo-user";

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { updateApplication, deleteApplication } = useJobApplications();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<JobApplication>>({});
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const resolveParams = async () => {
      const { id: resolvedId } = await params;
      setId(resolvedId);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/applications/${id}`, {
          headers: { "x-user-id": USER_ID },
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
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updated = await updateApplication(id, { status: newStatus });
      setApplication(updated);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplication(id);
        router.push("/dashboard");
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      const updated = await updateApplication(id, formData);
      setApplication(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Application not found</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {application.jobTitle}
            </h1>
            <p className="text-gray-600">{application.company}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Job Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Title</label>
                  <p className="text-gray-900 mt-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.jobTitle || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, jobTitle: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      application.jobTitle
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Company</label>
                  <p className="text-gray-900 mt-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.company || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      application.company
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-gray-900 mt-1">
                    {application.location || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Employment Type
                  </label>
                  <p className="text-gray-900 mt-1">
                    {application.employmentType?.replace("-", " ") || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Salary</label>
                  <p className="text-gray-900 mt-1">{application.salary || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fit Score</label>
                  <p className="text-gray-900 mt-1">
                    {application.fitScore ? `${application.fitScore}%` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {application.description && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {application.description}
                </p>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
              {isEditing ? (
                <textarea
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
                  placeholder="Add any notes about this application..."
                />
              ) : (
                <p className="text-gray-700">
                  {application.notes || "No notes added"}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div>
            {/* Status */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status</h2>
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="applied">Applied</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="interviewed">Interviewed</option>
                <option value="offer_received">Offer Received</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applied</p>
                  <p className="text-gray-900">
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                {application.responseAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Response</p>
                    <p className="text-gray-900">
                      {new Date(application.responseAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(application);
                      }}
                      className="w-full bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Job Link */}
            {application.jobLink && (
              <a
                href={application.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-center hover:bg-blue-100 transition"
              >
                View Job Posting
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
