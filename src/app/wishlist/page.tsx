"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const USER_ID = "demo-user";

interface WishlistItem {
  _id?: string;
  title: string;
  company: string;
  description: string;
  link: string;
  notes?: string;
  savedAt: string;
  status: "saved" | "reviewing" | "decided";
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    link: "",
    notes: "",
    status: "saved" as const,
  });

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist", {
        headers: { "x-user-id": USER_ID },
      });
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": USER_ID,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newItem = await response.json();
        setWishlist([newItem, ...wishlist]);
        setFormData({
          title: "",
          company: "",
          description: "",
          link: "",
          notes: "",
          status: "saved",
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDeleteItem = async (id?: string) => {
    if (!id) return;
    try {
      await fetch(`/api/wishlist/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": USER_ID },
      });
      setWishlist(wishlist.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleStatusChange = async (id: string | undefined, newStatus: string) => {
    if (!id) return;
    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": USER_ID,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const updated = await response.json();
        setWishlist(wishlist.map((item) => (item._id === id ? updated : item)));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleMoveToApplications = async (item: WishlistItem) => {
    try {
      // Create a new job application
      const appResponse = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": USER_ID,
        },
        body: JSON.stringify({
          jobTitle: item.title,
          company: item.company,
          description: item.description,
          jobLink: item.link,
          resumeUsed: "default-resume",
          notes: item.notes,
          status: "applied",
        }),
      });

      if (appResponse.ok) {
        // Delete from wishlist
        await handleDeleteItem(item._id);
      }
    } catch (error) {
      console.error("Error moving to applications:", error);
    }
  };

  const statusColors = {
    saved: "bg-blue-100 text-blue-800",
    reviewing: "bg-yellow-100 text-yellow-800",
    decided: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Wishlist</h1>
              <p className="text-gray-600">Save and review interesting job posts</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Job
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Job Post</h2>
            <form onSubmit={handleAddItem}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Job Title *"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Company *"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="url"
                placeholder="Job Link *"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <textarea
                placeholder="Job Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Save Job
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

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading wishlist...</p>
            </div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">
              No jobs saved yet. Add interesting job posts to your wishlist!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {wishlist.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.company}</p>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[item.status]
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>

                {item.description && (
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {item.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                    <p className="text-sm text-yellow-800">{item.notes}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="saved">Saved</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="decided">Decided</option>
                    </select>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Post
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToApplications(item)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
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
