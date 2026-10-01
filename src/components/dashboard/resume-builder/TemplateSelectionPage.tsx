"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TemplateSelectionCard } from "./TemplateSelectionCard";
import { TemplateSelectionHeader } from "./TemplateSelectionHeader";
import { TemplateSelectionPreviewModal } from "./TemplateSelectionPreviewModal";
import {
  AVAILABLE_TEMPLATES,
  type TemplateId,
  type TemplateMetadata,
} from "./types";

export function TemplateSelectionPage() {
  const router = useRouter();
  const [templates, setTemplates] =
    useState<TemplateMetadata[]>(AVAILABLE_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("modern");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId | null>(
    null,
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalTemplates: 50,
    totalPages: 5,
    hasNextPage: true,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);

  // Per-template variant customization state (color and font family)
  const [customVariants, setCustomVariants] = useState<
    Record<string, { color: string; font: "sans" | "serif" | "mono" }>
  >({});

  // Fetch dynamic templates from backend with server-side pagination & category filter
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      category: categoryFilter,
    });

    fetch(`/api/resumes/templates?${query.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load templates");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.templates && data.templates.length > 0) {
            setTemplates(data.templates);
          }
          if (data.pagination) {
            setPagination(data.pagination);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Using fallback templates:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, categoryFilter]);

  const updateVariantColor = (tmplId: string, hex: string) => {
    setCustomVariants((prev) => ({
      ...prev,
      [tmplId]: {
        color: hex,
        font: prev[tmplId]?.font || "sans",
      },
    }));
  };

  const updateVariantFont = (
    tmplId: string,
    font: "sans" | "serif" | "mono",
  ) => {
    setCustomVariants((prev) => ({
      ...prev,
      [tmplId]: {
        color: prev[tmplId]?.color || "#4f46e5",
        font,
      },
    }));
  };

  const handleNext = () => {
    const variantConfig = customVariants[selectedTemplate];
    const params = new URLSearchParams({
      template: selectedTemplate,
    });
    if (variantConfig?.color) {
      params.set("accent", encodeURIComponent(variantConfig.color));
    }
    if (variantConfig?.font) {
      params.set("font", variantConfig.font);
    }
    router.push(`/resumes/builder?${params.toString()}`);
  };

  const handleApplyAndContinue = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    setPreviewTemplate(null);
    const variantConfig = customVariants[templateId];
    const params = new URLSearchParams({
      template: templateId,
    });
    if (variantConfig?.color) {
      params.set("accent", encodeURIComponent(variantConfig.color));
    }
    if (variantConfig?.font) {
      params.set("font", variantConfig.font);
    }
    router.push(`/resumes/builder?${params.toString()}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header and Filter Banner */}
      <TemplateSelectionHeader
        categoryFilter={categoryFilter}
        onCategoryFilterChange={(cat) => {
          setCategoryFilter(cat);
          setPage(1);
        }}
        onNext={handleNext}
        templatesCount={templates.length}
        totalTemplates={pagination.totalTemplates}
        page={pagination.page}
        totalPages={pagination.totalPages}
      />

      {/* Templates Grid (10 items per page) */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Loading templates...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {templates.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;
            const cardColor =
              customVariants[tmpl.id]?.color ||
              tmpl.defaultTheme?.accentColor ||
              "#4f46e5";
            const cardFont =
              customVariants[tmpl.id]?.font ||
              tmpl.defaultTheme?.fontFamily ||
              "sans";

            return (
              <TemplateSelectionCard
                key={tmpl.id}
                template={tmpl}
                isSelected={isSelected}
                cardColor={cardColor}
                cardFont={cardFont}
                onSelect={(id) => setSelectedTemplate(id)}
                onPreview={(id) => setPreviewTemplate(id)}
                onUpdateVariantColor={updateVariantColor}
                onUpdateVariantFont={updateVariantFont}
              />
            );
          })}
        </div>
      )}

      {/* Server Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Showing {(pagination.page - 1) * pagination.limit + 1}–
          {Math.min(
            pagination.page * pagination.limit,
            pagination.totalTemplates,
          )}{" "}
          of {pagination.totalTemplates} ATS-optimized templates
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pNum) => (
              <button
                key={pNum}
                type="button"
                onClick={() => setPage(pNum)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pagination.page === pNum
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {pNum}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={!pagination.hasNextPage}
            onClick={() =>
              setPage((prev) => Math.min(pagination.totalPages, prev + 1))
            }
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Sample Preview Modal with Candidate Dummy Data */}
      <TemplateSelectionPreviewModal
        previewTemplate={previewTemplate}
        templates={templates}
        customVariants={customVariants}
        onClose={() => setPreviewTemplate(null)}
        onApplyAndContinue={handleApplyAndContinue}
      />
    </div>
  );
}
