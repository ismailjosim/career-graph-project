import { ApplicationCard } from "./ApplicationCard";
import { ApplicationsEmptyState } from "./ApplicationsEmptyState";
import type { ApplicationsGridProps } from "./types";

export function ApplicationsGrid({
  applications,
  onResetFilters,
}: ApplicationsGridProps) {
  if (applications.length === 0) {
    return (
      <ApplicationsEmptyState
        hasFilters={Boolean(onResetFilters)}
        onResetFilters={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((app) => (
        <ApplicationCard key={app._id} application={app} />
      ))}
    </div>
  );
}
