"use client";

import { Globe, Plus, SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  JobMarketCard,
  JobMarketFilters,
  JobMarketHeader,
  JobMarketLoading,
  JobMarketModal,
  type MarketCategory,
  type MarketSortOption,
} from "@/components/dashboard/job-market";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { useJobMarket } from "@/hooks/useApi";
import { confirmAction } from "@/lib/alerts";
import type { JobMarket } from "@/lib/validation";

export function JobMarketClient() {
  const {
    markets,
    loading,
    error,
    addMarket,
    updateMarket,
    deleteMarket,
    toggleFavorite,
    visitMarket,
  } = useJobMarket();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<MarketCategory>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<MarketSortOption>("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 9;

  // Reset page when filter changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, showFavoritesOnly, sortBy]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState<JobMarket | null>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: markets.length };
    for (const m of markets) {
      counts[m.category] = (counts[m.category] || 0) + 1;
    }
    return counts;
  }, [markets]);

  // Favorite count
  const favoriteCount = useMemo(() => {
    return markets.filter((m) => m.isFavorite).length;
  }, [markets]);

  // Filtered & Sorted markets
  const filteredMarkets = useMemo(() => {
    let result = [...markets];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((m) => m.category === selectedCategory);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter((m) => m.isFavorite);
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((m) => {
        const nameMatch = m.name.toLowerCase().includes(q);
        const descMatch = m.description?.toLowerCase().includes(q);
        const linkMatch = m.link.toLowerCase().includes(q);
        const tagMatch = m.tags?.some((t) => t.toLowerCase().includes(q));
        const notesMatch = m.notes?.toLowerCase().includes(q);
        return nameMatch || descMatch || linkMatch || tagMatch || notesMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "popular") {
        if (a.isFavorite !== b.isFavorite) {
          return a.isFavorite ? -1 : 1;
        }
        return (b.visitCount || 0) - (a.visitCount || 0);
      }
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "recent") {
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      }
      if (sortBy === "name_asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name_desc") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return result;
  }, [markets, selectedCategory, showFavoritesOnly, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredMarkets.length / PAGE_SIZE) || 1;
  const paginatedMarkets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredMarkets.slice(start, start + PAGE_SIZE);
  }, [filteredMarkets, currentPage]);

  const handleOpenAddModal = () => {
    setEditingMarket(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (market: JobMarket) => {
    setEditingMarket(market);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (
    data: Omit<JobMarket, "_id" | "userId" | "savedAt" | "visitCount">,
  ) => {
    try {
      if (editingMarket?._id) {
        await updateMarket(editingMarket._id, data);
        toast.success(`Marketplace "${data.name}" updated successfully!`);
      } else {
        await addMarket(data);
        toast.success(`Marketplace "${data.name}" added successfully!`);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save marketplace",
      );
    }
  };

  const handleDeleteMarket = async (id: string) => {
    const confirmed = await confirmAction({
      title: "Remove Marketplace?",
      text: "Are you sure you want to remove this marketplace from your list?",
      isDestructive: true,
      confirmButtonText: "Remove",
    });

    if (!confirmed) return;

    try {
      await deleteMarket(id);
      toast.success("Marketplace removed successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove marketplace",
      );
    }
  };

  return (
    <div className="w-full space-y-7 animate-fade-in pb-16">
      {/* Header */}
      <JobMarketHeader
        totalCount={markets.length}
        filteredCount={filteredMarkets.length}
        favoriteCount={favoriteCount}
        onAddMarket={handleOpenAddModal}
      />

      {/* Filter and Search Bar */}
      <JobMarketFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showFavoritesOnly={showFavoritesOnly}
        onFavoritesToggle={setShowFavoritesOnly}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categoryCounts={categoryCounts}
      />

      {/* Content Area */}
      {loading ? (
        <JobMarketLoading />
      ) : error ? (
        <div className="card p-8 text-center text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 space-y-2">
          <p className="font-semibold text-sm">Error loading job markets</p>
          <p className="text-xs">{error}</p>
        </div>
      ) : filteredMarkets.length === 0 ? (
        <div className="card p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-800 space-y-4 max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            {searchTerm || selectedCategory !== "all" || showFavoritesOnly ? (
              <SearchX className="w-6 h-6" />
            ) : (
              <Globe className="w-6 h-6" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {searchTerm || selectedCategory !== "all" || showFavoritesOnly
                ? "No matching marketplaces found"
                : "No marketplaces saved yet"}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {searchTerm || selectedCategory !== "all" || showFavoritesOnly
                ? "Try adjusting your search terms or removing category filters."
                : "Add job boards, niche portals, and freelance marketplaces you find online."}
            </p>
          </div>
          {searchTerm || selectedCategory !== "all" || showFavoritesOnly ? (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setShowFavoritesOnly(false);
              }}
              className="btn-outline text-xs py-2 px-4 cursor-pointer"
            >
              Reset Filters
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Marketplace</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedMarkets.map((market) => (
              <JobMarketCard
                key={market._id || market.name}
                market={market}
                onVisit={visitMarket}
                onToggleFavorite={toggleFavorite}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteMarket}
              />
            ))}
          </div>

          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredMarkets.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemName="marketplaces"
          />
        </div>
      )}

      {/* Add / Edit Modal */}
      <JobMarketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingMarket={editingMarket}
      />
    </div>
  );
}
