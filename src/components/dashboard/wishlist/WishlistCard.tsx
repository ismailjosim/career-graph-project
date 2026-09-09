import { ExternalLink, Trash2 } from "lucide-react";
import type { Wishlist } from "@/lib/validation";
import type { WishlistCardProps } from "./types";
import {
  formatWishlistStatusLabel,
  getWishlistStatusBadgeClass,
} from "./wishlist.utils";

export function WishlistCard({
  item,
  onStatusChange,
  onDelete,
}: WishlistCardProps) {
  const formattedSavedDate = item.savedAt
    ? new Date(item.savedAt).toLocaleDateString()
    : "Recently";

  return (
    <div className="card p-6 group hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                {item.company}
              </p>
            </div>
            <span
              className={`badge text-xs whitespace-nowrap ${getWishlistStatusBadgeClass(
                item.status,
              )}`}
            >
              {formatWishlistStatusLabel(item.status)}
            </span>
          </div>

          {item.description && (
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>
          )}

          {item.notes && (
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 mb-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                💡 {item.notes}
              </p>
            </div>
          )}

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Saved {formattedSavedDate}
          </p>
        </div>

        {/* Actions */}
        <div className="w-full md:w-auto flex flex-col gap-2.5 shrink-0">
          <select
            value={item.status}
            onChange={(e) =>
              item._id &&
              onStatusChange(item._id, e.target.value as Wishlist["status"])
            }
            className="input text-sm cursor-pointer"
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
              className="flex-1 btn-outline justify-center text-sm py-2 px-3"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Post</span>
            </a>
            <button
              type="button"
              onClick={() => item._id && onDelete(item._id)}
              className="p-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 transition-colors cursor-pointer"
              title="Delete from wishlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
