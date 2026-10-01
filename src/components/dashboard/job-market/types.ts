import type { JobMarket } from "@/lib/validation";

export type MarketCategory =
  | "all"
  | "tech"
  | "remote"
  | "startups"
  | "freelance"
  | "design"
  | "general"
  | "local"
  | "other";

export type MarketSortOption =
  | "popular"
  | "rating"
  | "recent"
  | "name_asc"
  | "name_desc";

export interface JobMarketHeaderProps {
  totalCount: number;
  filteredCount: number;
  favoriteCount: number;
  onAddMarket: () => void;
}

export interface JobMarketFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: MarketCategory;
  onCategoryChange: (category: MarketCategory) => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: (value: boolean) => void;
  sortBy: MarketSortOption;
  onSortChange: (sort: MarketSortOption) => void;
  categoryCounts: Record<string, number>;
}

export interface JobMarketCardProps {
  market: JobMarket;
  onVisit: (id: string, url: string) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
  onEdit: (market: JobMarket) => void;
  onDelete: (id: string) => void;
}

export interface JobMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<JobMarket, "_id" | "userId" | "savedAt" | "visitCount">,
  ) => Promise<void>;
  editingMarket?: JobMarket | null;
}
