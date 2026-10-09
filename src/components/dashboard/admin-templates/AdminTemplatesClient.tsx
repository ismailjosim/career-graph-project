"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminStatusConfirmModal } from "./AdminStatusConfirmModal";
import { AdminTemplateFilters } from "./AdminTemplateFilters";
import { AdminTemplateStats } from "./AdminTemplateStats";
import { AdminTemplatesPagination } from "./AdminTemplatesPagination";
import { AdminTemplatesTable } from "./AdminTemplatesTable";
import { type TemplateFormData, TemplateFormModal } from "./TemplateFormModal";
import { TemplatePreviewModal } from "./TemplatePreviewModal";
import type { AdminTemplateItem, PaginationState, StatsSummary } from "./types";

export function AdminTemplatesClient() {
  const [templates, setTemplates] = useState<AdminTemplateItem[]>([]);
  const [stats, setStats] = useState<StatsSummary>({
    total: 0,
    active: 0,
    pro: 0,
    free: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Server pagination state (10 per page)
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    totalTemplates: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateFormData | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] =
    useState<AdminTemplateItem | null>(null);

  // Status Change Confirmation Modal states
  const [statusConfirmTarget, setStatusConfirmTarget] = useState<{
    template: AdminTemplateItem;
    nextActive: boolean;
  } | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        category: categoryFilter,
        status: statusFilter,
        search: search.trim(),
      });

      const res = await fetch(
        `/api/admin/resume-templates?${query.toString()}`,
      );
      if (!res.ok) {
        throw new Error("Failed to load templates");
      }
      const data = await res.json();
      setTemplates(data.templates || []);
      if (data.stats) setStats(data.stats);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error loading templates",
      );
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter, statusFilter, search]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleConfirmStatusChange = async () => {
    if (!statusConfirmTarget) return;
    const { template, nextActive } = statusConfirmTarget;
    setStatusUpdating(true);

    try {
      const res = await fetch(`/api/admin/resume-templates/${template._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Failed to update status");
      }

      toast.success(
        `Template "${template.name}" is now ${
          nextActive ? "Published & Active" : "Draft / Hidden"
        }`,
      );
      setTemplates((prev) =>
        prev.map((t) =>
          t._id === template._id ? { ...t, isActive: nextActive } : t,
        ),
      );
      setStats((prev: StatsSummary) => ({
        ...prev,
        active: nextActive ? prev.active + 1 : prev.active - 1,
      }));
      setStatusConfirmTarget(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update template status",
      );
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async (template: AdminTemplateItem) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete or deactivate template "${template.name}"?`,
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/resume-templates/${template._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      toast.success(data.message || "Template deleted");
      fetchTemplates();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete template",
      );
    }
  };

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-space-grotesk tracking-tight">
            Resume Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage ATS formats, dynamic archetypes, default themes, and Pro
            token pricing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedTemplate(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Template</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <AdminTemplateStats stats={stats} />

      {/* Filter and Search Bar */}
      <AdminTemplateFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={(val) => {
          setCategoryFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        onRefresh={fetchTemplates}
        loading={loading}
      />

      {/* Templates Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <AdminTemplatesTable
          templates={templates}
          loading={loading}
          onPreview={(t) => {
            setPreviewTemplate(t);
            setPreviewModalOpen(true);
          }}
          onEdit={(t) => {
            setSelectedTemplate(t);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
          onRequestStatusChange={(t, nextActive) => {
            setStatusConfirmTarget({ template: t, nextActive });
          }}
          onCreateClick={() => {
            setSelectedTemplate(null);
            setModalOpen(true);
          }}
        />

        {/* Server Pagination Bar Below Table */}
        <AdminTemplatesPagination
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Create / Edit Modal */}
      <TemplateFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchTemplates}
        initialData={selectedTemplate}
      />

      {/* Live Sample Preview Modal filled with Sample Profile Data */}
      <TemplatePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        template={previewTemplate}
      />

      {/* Status Permission Confirmation Modal Popup */}
      <AdminStatusConfirmModal
        target={statusConfirmTarget}
        onClose={() => setStatusConfirmTarget(null)}
        onConfirm={handleConfirmStatusChange}
        loading={statusUpdating}
      />
    </div>
  );
}
