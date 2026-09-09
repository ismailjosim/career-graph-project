import {
  ArrowUpDown,
  Bookmark,
  Briefcase,
  Code2,
  Globe2,
  Palette,
  Rocket,
  Search,
  Users,
  X,
} from "lucide-react";
import type {
  JobMarketFiltersProps,
  MarketCategory,
  MarketSortOption,
} from "./types";

interface CategoryTab {
  id: MarketCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryTab[] = [
  { id: "all", label: "All Markets", icon: Globe2 },
  { id: "remote", label: "Remote", icon: Globe2 },
  { id: "tech", label: "Tech & Dev", icon: Code2 },
  { id: "startups", label: "Startups", icon: Rocket },
  { id: "freelance", label: "Freelance", icon: Users },
  { id: "design", label: "Design", icon: Palette },
  { id: "general", label: "General", icon: Briefcase },
];

export function JobMarketFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showFavoritesOnly,
  onFavoritesToggle,
  sortBy,
  onSortChange,
  categoryCounts,
}: JobMarketFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by platform name, keywords, or tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10 pr-9 text-xs sm:text-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Tools: Favorites Toggle & Sort */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
          {/* Favorites Only Toggle */}
          <button
            type="button"
            onClick={() => onFavoritesToggle(!showFavoritesOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
              showFavoritesOnly
                ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                showFavoritesOnly
                  ? "fill-rose-500 text-rose-500"
                  : "text-slate-400"
              }`}
            />
            <span>Favorites</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as MarketSortOption)}
              className="bg-transparent border-0 text-slate-700 dark:text-slate-300 font-medium focus:ring-0 cursor-pointer pr-1"
            >
              <option value="popular">Most Visited</option>
              <option value="rating">Highest Rated</option>
              <option value="recent">Recently Added</option>
              <option value="name_asc">Name (A &rarr; Z)</option>
              <option value="name_desc">Name (Z &rarr; A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
