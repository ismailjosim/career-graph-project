"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";

const USER_ID = "demo-user";

interface CoverLetter {
  _id?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function CoverLettersPage() {
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchCoverLetters();
  }, []);

  const fetchCoverLetters = async () => {
    try {
      const response = await fetch("/api/cover-letters", {
        headers: { "x-user-id": USER_ID },
      });
      if (response.ok) {
        const data = await response.json();
        setLetters(data);
      }
    } catch (error) {
      console.error("Error fetching cover letters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update
        const response = await fetch(`/api/cover-letters/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": USER_ID,
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const updated = await response.json();
          setLetters(letters.map((l) => (l._id === editingId ? updated : l)));
          setEditingId(null);
        }
      } else {
        // Create
        const response = await fetch("/api/cover-letters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": USER_ID,
          },
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
    if (!id) return;
    if (confirm("Are you sure you want to delete this cover letter?")) {
      try {
        await fetch(`/api/cover-letters/${id}`, {
          method: "DELETE",
          headers: { "x-user-id": USER_ID },
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cover Letters</h1>
              <p className="text-gray-600">Manage your cover letters</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ title: "", content: "" });
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            New Letter
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? "Edit Cover Letter" : "Create New Cover Letter"}
            </h2>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ title: "", content: "" });
                  }}
                  className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Letters List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading cover letters...</p>
            </div>
          </div>
        ) : letters.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">
              No cover letters yet. Create one to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {letters.map((letter) => (
              <div
                key={letter._id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {letter.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Last updated: {new Date(letter.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(letter)}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(letter._id)}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">
                  {letter.content}
                </p>
                <button
                  onClick={() => handleEdit(letter)}
                  className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                >
                  View Full Letter
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
