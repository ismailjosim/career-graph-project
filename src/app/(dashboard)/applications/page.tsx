"use client";

import { useMemo, useState } from "react";
import {
  type ApplicationFilterStatus,
  ApplicationsFilterBar,
  ApplicationsGrid,
  ApplicationsHeader,
  ApplicationsLoading,
  filterApplications,
} from "@/components/dashboard/applications";
import { useJobApplications } from "@/hooks/useApi";

export default function ApplicationsPage() {
  const { applications, loading } = useJobApplications();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<ApplicationFilterStatus>("all");

  const filteredApplications = useMemo(
    () => filterApplications(applications, searchTerm, filterStatus),
    [applications, searchTerm, filterStatus],
  );

  const hasActiveFilters = searchTerm.trim() !== "" || filterStatus !== "all";

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <ApplicationsHeader
        totalCount={applications.length}
        filteredCount={filteredApplications.length}
      />

      <ApplicationsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
      />

      {loading ? (
        <ApplicationsLoading />
      ) : (
        <ApplicationsGrid
          applications={filteredApplications}
          onResetFilters={hasActiveFilters ? handleResetFilters : undefined}
        />
      )}
    </div>
  );
}
