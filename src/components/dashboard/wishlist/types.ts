import type { Wishlist } from "@/lib/validation";

export type WishlistFilterStatus = "all" | "saved" | "reviewing" | "decided";

export interface WishlistStatusOption {
  value: WishlistFilterStatus;
  label: string;
}

export interface WishlistFormData {
  title: string;
  company: string;
  description: string;
  link: string;
  notes: string;
  status: Wishlist["status"];
}

export interface WishlistHeaderProps {
  totalCount: number;
  filteredCount: number;
  onAddJob: () => void;
}

export interface WishlistFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: WishlistFilterStatus;
  onFilterStatusChange: (status: WishlistFilterStatus) => void;
  statusOptions?: WishlistStatusOption[];
}

export interface WishlistCardProps {
  item: Wishlist;
  onStatusChange: (
    id: string,
    newStatus: Wishlist["status"],
  ) => Promise<Wishlist>;
  onDelete: (id: string) => Promise<void>;
}

export interface WishlistListProps {
  items: Wishlist[];
  onStatusChange: (
    id: string,
    newStatus: Wishlist["status"],
  ) => Promise<Wishlist>;
  onDelete: (id: string) => Promise<void>;
  onResetFilters?: () => void;
  onAddJob: () => void;
}

export interface AddWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    item: Omit<Wishlist, "_id" | "userId" | "savedAt">,
  ) => Promise<Wishlist>;
}

export interface WishlistEmptyStateProps {
  hasFilters: boolean;
  onResetFilters?: () => void;
  onAddJob: () => void;
}
