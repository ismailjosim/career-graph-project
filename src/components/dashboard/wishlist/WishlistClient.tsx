"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AddWishlistModal,
  filterWishlist,
  WishlistFilterBar,
  type WishlistFilterStatus,
  WishlistHeader,
  WishlistList,
  WishlistLoading,
} from "@/components/dashboard/wishlist";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { useWishlist } from "@/hooks/useApi";

const PAGE_SIZE = 9;

export function WishlistClient() {
  const { wishlist, loading, addItem, deleteItem, updateStatus } =
    useWishlist();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<WishlistFilterStatus>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredWishlist = useMemo(
    () => filterWishlist(wishlist, searchTerm, filterStatus),
    [wishlist, searchTerm, filterStatus],
  );

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const hasActiveFilters = searchTerm.trim() !== "" || filterStatus !== "all";

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredWishlist.length / PAGE_SIZE) || 1;
  const paginatedWishlist = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredWishlist.slice(start, start + PAGE_SIZE);
  }, [filteredWishlist, currentPage]);

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <WishlistHeader
        totalCount={wishlist.length}
        filteredCount={filteredWishlist.length}
        onAddJob={() => setShowAddModal(true)}
      />

      <WishlistFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
      />

      {loading ? (
        <WishlistLoading />
      ) : (
        <div className="space-y-6">
          <WishlistList
            items={paginatedWishlist}
            onStatusChange={updateStatus}
            onDelete={deleteItem}
            onResetFilters={hasActiveFilters ? handleResetFilters : undefined}
            onAddJob={() => setShowAddModal(true)}
          />

          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredWishlist.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemName="wishlist jobs"
          />
        </div>
      )}

      <AddWishlistModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addItem}
      />
    </div>
  );
}
