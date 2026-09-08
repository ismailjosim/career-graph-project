"use client";

import { ArrowLeft, Edit2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

interface CoverLetter {
  _id?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function CoverLettersPage() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const fetchCoverLetters = useCallback(async () => {
    if (!userId) {
      if (!isPending) setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/cover-letters", {
        headers: { "x-user-id": userId },
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setLetters(data);
      }
    } catch (error) {
      console.error("Error fetching cover letters:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, isPending]);

  useEffect(() => {
    if (userId) {
      fetchCoverLetters();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchCoverLetters, userId, isPending]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      if (editingId) {
        const response = await fetch(`/api/cover-letters/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-user-id": userId },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const updated = await response.json();
          setLetters(letters.map((l) => (l._id === editingId ? updated : l)));
          setEditingId(null);
        }
      } else {
        const response = await fetch("/api/cover-letters", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-user-id": userId },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const newLetter = await response.json();
          setLetters([newLetter, ...letters]);
        }
      }
      setFormData({ title: "", content: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error saving cover letter:", error);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !userId) return;
    if (confirm("Are you sure you want to delete this cover letter?")) {
      try {
        await fetch(`/api/cover-letters/${id}`, {
          method: "DELETE",
          headers: { "x-user-id": userId },
        });
        setLetters(letters.filter((l) => l._id !== id));
      } catch (error) {
        console.error("Error deleting cover letter:", error);
      }
    }
  };

  const handleEdit = (letter: CoverLetter) => {
    setFormData({ title: letter.title, content: letter.content });
    setEditingId(letter._id || null);
    setShowForm(true);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Cover Letters
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your cover letters
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: "", content: "" });
            setShowForm(!showForm);
          }}
          className="btn-primary shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" /> New Letter
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {editingId ? "Edit Cover Letter" : "Create New Cover Letter"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Software Engineer Position"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Content *
              </label>
              <textarea
                placeholder="Write your cover letter here..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows={12}
                className="input font-mono text-sm"
              />
            </div>
            <div className="flex gap-4 pt-2">
              <button type="submit" className="btn-primary">
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ title: "", content: "" });
                }}
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
            Loading cover letters...
          </p>
        </div>
      ) : letters.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            No cover letters yet. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {letters.map((letter) => (
            <div
              key={letter._id}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {letter.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Last updated:{" "}
                    {new Date(letter.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(letter)}
                    className="btn-primary text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(letter._id)}
                    className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap line-clamp-3">
                {letter.content}
              </p>
              <button
                onClick={() => handleEdit(letter)}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                View Full Letter
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
