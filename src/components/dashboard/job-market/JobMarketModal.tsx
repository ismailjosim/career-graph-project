import { Bookmark, Globe, Loader2, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { JobMarketModalProps } from "./types";

export function JobMarketModal({
  isOpen,
  onClose,
  onSubmit,
  editingMarket,
}: JobMarketModalProps) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState<
    | "general"
    | "tech"
    | "remote"
    | "startups"
    | "freelance"
    | "design"
    | "local"
    | "other"
  >("general");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (editingMarket) {
      setName(editingMarket.name);
      setLink(editingMarket.link);
      setCategory(
        (editingMarket.category as
          | "general"
          | "tech"
          | "remote"
          | "startups"
          | "freelance"
          | "design"
          | "local"
          | "other") || "general",
      );
      setDescription(editingMarket.description || "");
      setTagsInput(editingMarket.tags ? editingMarket.tags.join(", ") : "");
      setNotes(editingMarket.notes || "");
      setRating(editingMarket.rating || 5);
      setIsFavorite(editingMarket.isFavorite || false);
    } else {
      setName("");
      setLink("");
      setCategory("general");
      setDescription("");
      setTagsInput("");
      setNotes("");
      setRating(5);
      setIsFavorite(false);
    }
    setError(null);
  }, [editingMarket, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let cleanLink = link.trim();
    if (!cleanLink.startsWith("http://") && !cleanLink.startsWith("https://")) {
      cleanLink = `https://${cleanLink}`;
    }

    try {
      new URL(cleanLink);
    } catch {
      setError("Please provide a valid website URL");
      return;
    }

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        link: cleanLink,
        category,
        description: description.trim(),
        tags: parsedTags,
        notes: notes.trim(),
        rating,
        isFavorite,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save marketplace",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="card w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingMarket ? "Edit Marketplace" : "Add Job Marketplace"}
              </h2>
              <p className="text-xs text-slate-500">
                {editingMarket
                  ? "Update platform details and your personal notes"
                  : "Save a new employment board or job marketplace to your DB"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm"
        >
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Name & URL */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Platform Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Wellfound, RemoteOK, TechCareers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Website Link (URL) *
              </label>
              <input
                type="text"
                required
                placeholder="https://remoteok.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="input text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Category & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as
                      | "general"
                      | "tech"
                      | "remote"
                      | "startups"
                      | "freelance"
                      | "design"
                      | "local"
                      | "other",
                  )
                }
                className="input text-xs sm:text-sm cursor-pointer"
              >
                <option value="general">General Marketplace</option>
                <option value="remote">Remote Only</option>
                <option value="tech">Tech & Engineering</option>
                <option value="startups">Startups & YC</option>
                <option value="freelance">Freelance & Contract</option>
                <option value="design">Design & Creative</option>
                <option value="local">Local & Regional</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Rating
              </label>
              <div className="flex items-center gap-1.5 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5 cursor-pointer transition-transform hover:scale-115"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">
                  {rating}/5
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Remote, Verified Pay, High Equity, Entry Level"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Description / Overview
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of why this platform is great, target companies, or hiring focus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input text-xs sm:text-sm resize-none"
            />
          </div>

          {/* Personal Strategy Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Personal Search Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Filter by 'Series A' or search every Monday morning"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>

          {/* Favorite checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="modalIsFavorite"
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="modalIsFavorite"
              className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-rose-500" />
              <span>Mark as favorite (pin to top)</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline py-2 px-4 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2 px-5 text-xs flex items-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {editingMarket ? "Save Changes" : "Create Marketplace"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
