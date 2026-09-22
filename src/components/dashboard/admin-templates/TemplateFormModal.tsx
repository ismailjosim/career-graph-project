"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArchetypeSection,
  BasicInfoSection,
  PricingSection,
  ThemeSettingsSection,
} from "./TemplateFormSections";
import {
  DEFAULT_FORM_DATA,
  type TemplateFormData,
} from "./templateForm.constants";

export type { TemplateFormData };

interface TemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: TemplateFormData | null;
}

export function TemplateFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: TemplateFormModalProps) {
  const [formData, setFormData] = useState<TemplateFormData>(DEFAULT_FORM_DATA);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id,
        slug: initialData.slug || "",
        name: initialData.name || "",
        subtitle: initialData.subtitle || "",
        description: initialData.description || "",
        category: initialData.category || "general",
        layoutArchetype: initialData.layoutArchetype || "single_column",
        thumbnailUrl: initialData.thumbnailUrl || "",
        badge: initialData.badge || "",
        isPro: Boolean(initialData.isPro),
        tokenCost: initialData.tokenCost || 0,
        defaultTheme: {
          accentColor: initialData.defaultTheme?.accentColor || "#4f46e5",
          fontFamily: initialData.defaultTheme?.fontFamily || "sans",
          layoutDensity: initialData.defaultTheme?.layoutDensity || "normal",
        },
        isActive: initialData.isActive !== false,
        sortOrder: initialData.sortOrder || 0,
      });
      setSlugManuallyEdited(true);
    } else {
      setFormData(DEFAULT_FORM_DATA);
      setSlugManuallyEdited(false);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleNameChange = (name: string) => {
    setFormData((prev) => {
      const next = { ...prev, name };
      if (!slugManuallyEdited && !initialData?._id) {
        next.slug = name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Name and Slug are required.");
      return;
    }

    setSaving(true);
    try {
      const isEditing = Boolean(initialData?._id);
      const url = isEditing
        ? `/api/admin/resume-templates/${initialData?._id}`
        : "/api/admin/resume-templates";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save template");
      }

      toast.success(
        isEditing
          ? "Template updated successfully"
          : "Template created successfully",
      );
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space-grotesk">
              {initialData?._id
                ? "Edit Resume Template"
                : "Create New Resume Template"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure layout structure, ATS settings, pricing, and visual
              defaults.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Basic Info (Name, Slug, Subtitle, Badge, Description) */}
          <BasicInfoSection
            name={formData.name}
            slug={formData.slug}
            subtitle={formData.subtitle}
            badge={formData.badge || ""}
            description={formData.description}
            onChangeName={handleNameChange}
            onChangeSlug={(val) => {
              setSlugManuallyEdited(true);
              setFormData((prev) => ({
                ...prev,
                slug: val.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
              }));
            }}
            onChangeSubtitle={(val) =>
              setFormData((prev) => ({ ...prev, subtitle: val }))
            }
            onChangeBadge={(val) =>
              setFormData((prev) => ({ ...prev, badge: val }))
            }
            onChangeDescription={(val) =>
              setFormData((prev) => ({ ...prev, description: val }))
            }
          />

          {/* Category & Layout Archetype */}
          <ArchetypeSection
            category={formData.category}
            layoutArchetype={formData.layoutArchetype}
            onChangeCategory={(cat) =>
              setFormData((prev) => ({ ...prev, category: cat }))
            }
            onChangeArchetype={(arch) =>
              setFormData((prev) => ({ ...prev, layoutArchetype: arch }))
            }
          />

          {/* Pricing & Access Tier */}
          <PricingSection
            isPro={formData.isPro}
            tokenCost={formData.tokenCost}
            onTogglePro={(checked) =>
              setFormData((prev) => ({
                ...prev,
                isPro: checked,
                tokenCost:
                  checked && prev.tokenCost === 0 ? 10 : prev.tokenCost,
                badge: checked && !prev.badge ? "PRO" : prev.badge,
              }))
            }
            onChangeTokenCost={(cost) =>
              setFormData((prev) => ({ ...prev, tokenCost: cost }))
            }
          />

          {/* Default Theme Settings */}
          <ThemeSettingsSection
            accentColor={formData.defaultTheme.accentColor}
            fontFamily={formData.defaultTheme.fontFamily}
            onChangeAccentColor={(color) =>
              setFormData((prev) => ({
                ...prev,
                defaultTheme: { ...prev.defaultTheme, accentColor: color },
              }))
            }
            onChangeFontFamily={(font) =>
              setFormData((prev) => ({
                ...prev,
                defaultTheme: { ...prev.defaultTheme, fontFamily: font },
              }))
            }
          />

          {/* Visibility & Sort Order */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
              />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Published & Active (Visible to Candidates)
              </span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Sort Order:
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sortOrder: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="w-16 px-2 py-1 text-sm rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {saving
                ? "Saving..."
                : initialData?._id
                  ? "Save Changes"
                  : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
