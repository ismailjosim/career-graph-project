"use client";

import {
  ChevronDown,
  Coins,
  Edit2,
  Eye,
  FileText,
  LayoutTemplate,
  Trash2,
} from "lucide-react";
import type { AdminTemplateItem } from "./types";

interface AdminTemplatesTableProps {
  templates: AdminTemplateItem[];
  loading: boolean;
  onPreview: (template: AdminTemplateItem) => void;
  onEdit: (template: AdminTemplateItem) => void;
  onDelete: (template: AdminTemplateItem) => void;
  onRequestStatusChange: (
    template: AdminTemplateItem,
    nextActive: boolean,
  ) => void;
  onCreateClick: () => void;
}

export function AdminTemplatesTable({
  templates,
  loading,
  onPreview,
  onEdit,
  onDelete,
  onRequestStatusChange,
  onCreateClick,
}: AdminTemplatesTableProps) {
  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Loading templates catalog...
        </p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="p-16 text-center">
        <LayoutTemplate className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          No templates found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Try broadening your search or filter criteria, or add your first
          template.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="mt-4 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Create Template
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="px-5 py-3.5">Template</th>
            <th className="px-5 py-3.5">Category & Archetype</th>
            <th className="px-5 py-3.5">Tier & Price</th>
            <th className="px-5 py-3.5">
              <div className="flex items-center gap-1.5">
                <span>Times Used</span>
                <span className="text-[10px] lowercase font-normal text-slate-400">
                  (by users)
                </span>
              </div>
            </th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {templates.map((t) => (
            <tr
              key={t._id}
              className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors"
            >
              {/* Name & Theme Accent */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onPreview(t)}
                    className="w-4 h-4 rounded-full shrink-0 border border-black/10 shadow-xs cursor-pointer hover:scale-125 transition-transform"
                    style={{
                      backgroundColor: t.defaultTheme?.accentColor || "#4f46e5",
                    }}
                    title={`Click to preview with sample data (${
                      t.defaultTheme?.accentColor || "#4f46e5"
                    })`}
                  />
                  <button
                    type="button"
                    onClick={() => onPreview(t)}
                    className="text-left group cursor-pointer"
                  >
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <span>{t.name}</span>
                      {t.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {t.slug}
                    </span>
                  </button>
                </div>
              </td>

              {/* Category & Archetype */}
              <td className="px-5 py-4">
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                    {t.category}
                  </span>
                  <div className="text-[11px] text-slate-400">
                    {t.layoutArchetype.replace("_", " ")}
                  </div>
                </div>
              </td>

              {/* Tier & Price */}
              <td className="px-5 py-4">
                {t.isPro ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{t.tokenCost || 10} Tokens</span>
                  </div>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    Free (0 🪙)
                  </span>
                )}
              </td>

              {/* Times Used (By users to make resume) */}
              <td className="px-5 py-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="font-bold text-slate-900 dark:text-white">
                    {t.usageCount ?? 0}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {(t.usageCount ?? 0) === 1 ? "time" : "times"}
                  </span>
                </div>
              </td>

              {/* Status Select with Permission Confirmation Modal */}
              <td className="px-5 py-4">
                <div className="relative inline-block">
                  <select
                    value={t.isActive ? "published" : "draft"}
                    onChange={(e) => {
                      const nextActive = e.target.value === "published";
                      if (nextActive !== t.isActive) {
                        onRequestStatusChange(t, nextActive);
                      }
                    }}
                    className={`appearance-none cursor-pointer text-xs font-bold pl-6 pr-8 py-1.5 rounded-full border transition-all shadow-2xs focus:outline-hidden focus:ring-2 ${
                      t.isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:border-emerald-400 focus:ring-emerald-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-slate-400 focus:ring-slate-500/30"
                    }`}
                    title="Select option to change status"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft / Hidden</option>
                  </select>
                  <span
                    className={`pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                      t.isActive
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-slate-400"
                    }`}
                  />
                  <ChevronDown
                    className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                      t.isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  />
                </div>
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onPreview(t)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 transition-all cursor-pointer shadow-2xs"
                    title="Preview template filled with sample data"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(t)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Edit Template"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(t)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                    title="Delete Template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
