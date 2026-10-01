import type { Wishlist } from "@/lib/validation";
import type { WishlistFilterStatus, WishlistStatusOption } from "./types";

export const DEFAULT_WISHLIST_STATUS_OPTIONS: WishlistStatusOption[] = [
  { value: "all", label: "All" },
  { value: "saved", label: "Saved" },
  { value: "reviewing", label: "Reviewing" },
  { value: "decided", label: "Decided" },
];

/**
 * Filters wishlist items by search term (title or company) and status.
 */
export function filterWishlist(
  items: Wishlist[],
  searchTerm: string,
  filterStatus: WishlistFilterStatus,
): Wishlist[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return items.filter((item) => {
    const matchesSearch =
      !normalizedSearch ||
      item.title.toLowerCase().includes(normalizedSearch) ||
      item.company.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });
}

/**
 * Returns badge styling for a wishlist status.
 */
export function getWishlistStatusBadgeClass(status: string): string {
  switch (status) {
    case "saved":
      return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50";
    case "reviewing":
      return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50";
    case "decided":
      return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50";
    default:
      return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
  }
}

/**
 * Formats a status string into a capitalized label.
 */
export function formatWishlistStatusLabel(status: string): string {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1);
}
