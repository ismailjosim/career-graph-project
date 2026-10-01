"use client";

import { useMemo, useState } from "react";
import {
  AddWishlistModal,
  filterWishlist,
  WishlistFilterBar,
  type WishlistFilterStatus,
  WishlistHeader,
  WishlistList,
  WishlistLoading,
} from "@/components/dashboard/wishlist";
import { useWishlist } from "@/hooks/useApi";

export function WishlistClient() {
  const { wishlist, loading, addItem, deleteItem, updateStatus } =
    useWishlist();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<WishlistFilterStatus>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredWishlist = useMemo(
    () => filterWishlist(wishlist, searchTerm, filterStatus),
    [wishlist, searchTerm, filterStatus],
  );

  const hasActiveFilters = searchTerm.trim() !== "" || filterStatus !== "all";

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

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
        <WishlistList
          items={filteredWishlist}
          onStatusChange={updateStatus}
          onDelete={deleteItem}
          onResetFilters={hasActiveFilters ? handleResetFilters : undefined}
          onAddJob={() => setShowAddModal(true)}
        />
      )}

      <AddWishlistModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addItem}
      />
    </div>
  );
}
