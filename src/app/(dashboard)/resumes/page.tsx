"use client";

import { ArrowLeft, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

interface Resume {
  _id?: string;
  name: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  isDefault: boolean;
}

export default function ResumesPage() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fileName: "",
    fileUrl: "",
  });

  const fetchResumes = useCallback(async () => {
    if (!userId) {
      if (!isPending) setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/resumes", {
        headers: { "x-user-id": userId },
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, isPending]);

  useEffect(() => {
    if (userId) {
      fetchResumes();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchResumes, userId, isPending]);

  const handleAddResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
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
    if (!id || !userId) return;
    if (confirm("Are you sure you want to delete this resume?")) {
      try {
        await fetch(`/api/resumes/${id}`, {
          method: "DELETE",
          headers: { "x-user-id": userId },
        });
        setResumes(resumes.filter((r) => r._id !== id));
      } catch (error) {
        console.error("Error deleting resume:", error);
      }
    }
  };

  const handleSetDefault = async (id?: string) => {
    if (!id || !userId) return;
    try {
      for (const resume of resumes) {
        if (resume._id && resume.isDefault) {
          await fetch(`/api/resumes/${resume._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": userId,
            },
            body: JSON.stringify({ isDefault: false }),
          });
        }
      }
      const response = await fetch(`/api/resumes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ isDefault: true }),
      });
      if (response.ok) fetchResumes();
    } catch (error) {
      console.error("Error setting default resume:", error);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Resumes
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your resume versions
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setFormData({ name: "", fileName: "", fileUrl: "" });
            setShowForm(!showForm);
          }}
          className="btn-primary shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Resume
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Add New Resume
          </h2>
          <form onSubmit={handleAddResume} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                className="input"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Upload to cloud storage and paste the shareable link
              </p>
            </div>
            <div className="flex gap-4 pt-2">
              <button type="submit" className="btn-primary">
                Add Resume
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading resumes...
          </p>
        </div>
      ) : resumes.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            No resumes yet. Add your first resume to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {resume.name}
                    </h3>
                    {resume.isDefault && (
                      <span className="badge-primary text-xs">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {resume.fileName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleSetDefault(resume._id)}
                    className={`p-2 rounded-xl transition ${resume.isDefault ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                    title="Set as default"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition"
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
  );
}
