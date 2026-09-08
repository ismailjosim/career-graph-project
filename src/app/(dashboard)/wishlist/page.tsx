"use client";

import { ArrowLeft, ExternalLink, Heart, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

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
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

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

  const fetchWishlist = useCallback(async () => {
    if (!userId) {
      if (!isPending) setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        headers: { "x-user-id": userId },
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, isPending]);

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchWishlist, userId, isPending]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
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
    if (!id || !userId) return;
    try {
      await fetch(`/api/wishlist/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      setWishlist(wishlist.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleStatusChange = async (
    id: string | undefined,
    newStatus: string,
  ) => {
    if (!id || !userId) return;
    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "saved":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "reviewing":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
      case "decided":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="section-title flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Job Wishlist
            </h1>
            <p className="section-subtitle">
              Save and review interesting job posts before applying
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary shadow-lg hover:shadow-xl whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Job
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card p-6 mb-8 animate-fade-in">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-6">
            Add New Job Post
          </h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Job Title *"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="input"
              />
              <input
                type="text"
                placeholder="Company *"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
                className="input"
              />
            </div>
            <input
              type="url"
              placeholder="Job Link *"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              required
              className="input"
            />
            <textarea
              placeholder="Job Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="input"
            />
            <textarea
              placeholder="Notes (why you're interested)"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
              className="input"
            />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                Save Job
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary flex-1"
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
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">
              Loading wishlist...
            </p>
          </div>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            No jobs saved yet. Add interesting job posts to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="card p-6 group hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {item.company}
                      </p>
                    </div>
                    <span
                      className={`badge text-xs whitespace-nowrap ${getStatusColor(
                        item.status,
                      )}`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {item.notes && (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 mb-4">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        💡 {item.notes}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Saved {new Date(item.savedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="w-full md:w-auto flex flex-col gap-2">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    className="input text-sm"
                  >
                    <option value="saved">Saved</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="decided">Decided</option>
                  </select>

                  <div className="flex gap-2">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn-outline justify-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Post
                    </a>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
