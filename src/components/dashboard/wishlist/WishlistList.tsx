import type { WishlistListProps } from "./types";
import { WishlistCard } from "./WishlistCard";
import { WishlistEmptyState } from "./WishlistEmptyState";

export function WishlistList({
  items,
  onStatusChange,
  onDelete,
  onResetFilters,
  onAddJob,
}: WishlistListProps) {
  if (items.length === 0) {
    return (
      <WishlistEmptyState
        hasFilters={Boolean(onResetFilters)}
        onResetFilters={onResetFilters}
        onAddJob={onAddJob}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {items.map((item) => (
        <WishlistCard
          key={item._id}
          item={item}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
