"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  type ApplicationsPaginationMeta,
  deleteApplicationAction,
  getPaginatedApplicationsAction,
} from "@/app/actions/applications";
import {
  type ApplicationEmploymentType,
  type ApplicationFilterStatus,
  type ApplicationSortBy,
  type ApplicationSortOrder,
  ApplicationsHeader,
  ApplicationsPagination,
  ApplicationsTable,
  ApplicationsTableFilters,
} from "@/components/dashboard/applications";
import type { JobApplication } from "@/lib/validation";

const PAGE_SIZE = 10;

export default function ApplicationsPage() {
  const [isPending, startTransition] = useTransition();
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<ApplicationFilterStatus>("all");
  const [employmentType, setEmploymentType] =
    useState<ApplicationEmploymentType>("all");
  const [sortBy, setSortBy] = useState<ApplicationSortBy>("appliedAt");
  const [sortOrder, setSortOrder] = useState<ApplicationSortOrder>("desc");

  // Pagination state
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [pagination, setPagination] = useState<ApplicationsPaginationMeta>({
    total: 0,
    totalAll: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce ref for search input
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch paginated data via Server Action
  const loadApplications = useCallback(
    async (
      targetPage: number,
      search: string,
      status: ApplicationFilterStatus,
      type: ApplicationEmploymentType,
      sort: ApplicationSortBy,
      order: ApplicationSortOrder,
    ) => {
      setLoading(true);
      setError(null);

      startTransition(async () => {
        try {
          const res = await getPaginatedApplicationsAction({
            page: targetPage,
            limit: PAGE_SIZE,
            search,
            status,
            employmentType: type,
            sortBy: sort,
            sortOrder: order,
          });

          if (res.success) {
            setApplications(res.applications);
            setPagination(res.pagination);
          } else {
            setError(res.error || "Failed to load applications");
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unexpected error occurred",
          );
        } finally {
          setLoading(false);
          setInitialLoaded(true);
        }
      });
    },
    [],
  );

  // Trigger load on filter/sort changes with debounce on search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search text input by 300ms, but immediate for other filters
    searchTimeoutRef.current = setTimeout(() => {
      loadApplications(
        page,
        searchTerm,
        filterStatus,
        employmentType,
        sortBy,
        sortOrder,
      );
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [
    page,
    searchTerm,
    filterStatus,
    employmentType,
    sortBy,
    sortOrder,
    loadApplications,
  ]);

  // When filters change, reset to page 1
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleFilterStatusChange = (status: ApplicationFilterStatus) => {
    setFilterStatus(status);
    setPage(1);
  };

  const handleEmploymentTypeChange = (type: ApplicationEmploymentType) => {
    setEmploymentType(type);
    setPage(1);
  };

  const handleSortChange = (
    newSortBy: ApplicationSortBy,
    newSortOrder: ApplicationSortOrder,
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setEmploymentType("all");
    setSortBy("appliedAt");
    setSortOrder("desc");
    setPage(1);
  };

  // Pagination change handler with scroll to table top
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Delete application handler
  const handleDeleteApplication = async (id: string) => {
    const res = await deleteApplicationAction(id);
    if (res.success) {
      // Reload current page or step back if last item on page deleted
      const targetPage =
        applications.length === 1 && page > 1 ? page - 1 : page;
      setPage(targetPage);
      loadApplications(
        targetPage,
        searchTerm,
        filterStatus,
        employmentType,
        sortBy,
        sortOrder,
      );
    } else {
      alert(res.error || "Failed to delete application");
    }
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    filterStatus !== "all" ||
    employmentType !== "all" ||
    sortBy !== "appliedAt" ||
    sortOrder !== "desc";

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Header with Title and New Application Button */}
      <ApplicationsHeader
        totalCount={pagination.totalAll}
        filteredCount={pagination.total}
      />

      {/* Multiple Search and Filter Controls */}
      <ApplicationsTableFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filterStatus={filterStatus}
        onFilterStatusChange={handleFilterStatusChange}
        employmentType={employmentType}
        onEmploymentTypeChange={handleEmploymentTypeChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        totalFiltered={pagination.total}
      />

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() =>
              loadApplications(
                page,
                searchTerm,
                filterStatus,
                employmentType,
                sortBy,
                sortOrder,
              )
            }
            className="text-xs font-semibold underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Applications Table (10 items per page with skeletons during loading) */}
      <ApplicationsTable
        applications={applications}
        loading={loading || !initialLoaded}
        onDelete={handleDeleteApplication}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Server Pagination Controls Below Table */}
      <ApplicationsPagination
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading || isPending}
      />
    </div>
  );
}
