"use client";

import { GraduationCap, Plus } from "lucide-react";
import { useState } from "react";
import { EducationEntryEditor } from "./EducationEntryEditor";
import { EducationItemCard } from "./EducationItemCard";
import type { EducationEntry } from "./types";

interface EducationFormSectionProps {
  education: EducationEntry[];
  onChange: (education: EducationEntry[]) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 50 }, (_, i) =>
  String(CURRENT_YEAR + 6 - i),
);

export function EducationFormSection({
  education = [],
  onChange,
}: EducationFormSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startAdd = () => {
    setEditingIndex(null);
    setIsAdding(true);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setIsAdding(true);
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleSaveEntry = (entryData: Omit<EducationEntry, "id">) => {
    const entry: EducationEntry = {
      ...entryData,
      id:
        editingIndex !== null && education[editingIndex]?.id
          ? education[editingIndex].id
          : `edu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    if (editingIndex !== null) {
      const updated = [...education];
      updated[editingIndex] = entry;
      onChange(updated);
    } else {
      onChange([...education, entry]);
    }

    closeForm();
  };

  const handleRemoveEntry = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
    if (editingIndex === index) {
      closeForm();
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-indigo-500" />
          <span>Education & Academic Credentials</span>
        </label>
        {!isAdding && (
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Degree / School</span>
          </button>
        )}
      </div>

      {isAdding && (
        <EducationEntryEditor
          initialData={editingIndex !== null ? education[editingIndex] : null}
          onSave={handleSaveEntry}
          onCancel={closeForm}
          yearOptions={YEAR_OPTIONS}
        />
      )}

      {education.length > 0 ? (
        <div className="space-y-2 pt-1">
          {education.map((entry, index) => (
            <EducationItemCard
              key={entry.id || `${entry.institution}-${index}`}
              entry={entry}
              index={index}
              onEdit={startEdit}
              onRemove={handleRemoveEntry}
            />
          ))}
        </div>
      ) : (
        !isAdding && (
          <p className="text-xs text-slate-400 italic">
            No education entries recorded yet. Click &quot;Add Degree /
            School&quot; to document your qualifications.
          </p>
        )
      )}
    </div>
  );
}
