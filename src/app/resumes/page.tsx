"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Star } from "lucide-react";

const USER_ID = "demo-user";

interface Resume {
  _id?: string;
  name: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  isDefault: boolean;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fileName: "",
    fileUrl: "",
  });

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes", {
        headers: { "x-user-id": USER_ID },
      });
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResume = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": USER_ID,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newResume = await response.json();
        setResumes([newResume, ...resumes]);
        setFormData({ name: "", fileName: "", fileUrl: "" });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error adding resume:", error);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this resume?")) {
      try {
        await fetch(`/api/resumes/${id}`, {
          method: "DELETE",
          headers: { "x-user-id": USER_ID },
        });
        setResumes(resumes.filter((r) => r._id !== id));
      } catch (error) {
        console.error("Error deleting resume:", error);
      }
    }
  };

  const handleSetDefault = async (id?: string) => {
    if (!id) return;
    try {
      // Set all to not default first
      for (const resume of resumes) {
        if (resume._id && resume.isDefault) {
          await fetch(`/api/resumes/${resume._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": USER_ID,
            },
            body: JSON.stringify({ isDefault: false }),
          });
        }
      }

      // Set selected as default
      const response = await fetch(`/api/resumes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": USER_ID,
        },
        body: JSON.stringify({ isDefault: true }),
      });

      if (response.ok) {
        fetchResumes();
      }
    } catch (error) {
      console.error("Error setting default resume:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resumes</h1>
              <p className="text-gray-600">Manage your resume versions</p>
            </div>
          </div>
          <button
            onClick={() => {
              setFormData({ name: "", fileName: "", fileUrl: "" });
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Resume
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Resume</h2>
            <form onSubmit={handleAddResume}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Developer Resume"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., john_doe_resume.pdf"
                  value={formData.fileName}
                  onChange={(e) =>
                    setFormData({ ...formData, fileName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File URL *
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.fileUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, fileUrl: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Upload your resume to cloud storage (e.g., Google Drive, Dropbox) and paste the shareable link
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add Resume
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resumes List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading resumes...</p>
            </div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">
              No resumes yet. Add your first resume to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {resume.name}
                      </h3>
                      {resume.isDefault && (
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {resume.fileName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleSetDefault(resume._id)}
                      className={`p-2 rounded transition ${
                        resume.isDefault
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                      title="Set as default"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
