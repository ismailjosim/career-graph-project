"use client";

import { Award, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { generateId } from "../resumeBuilder.utils";
import type { ResumeCertificationItem } from "../types";

interface CertificationsSectionProps {
  certifications: ResumeCertificationItem[];
  onChange: (certifications: ResumeCertificationItem[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function CertificationsSection({
  certifications,
  onChange,
  isOpen,
  onToggle,
}: CertificationsSectionProps) {
  const addCertification = () => {
    const newCert: ResumeCertificationItem = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
      url: "",
    };
    onChange([...certifications, newCert]);
  };

  const updateCertification = (
    id: string,
    fields: Partial<ResumeCertificationItem>,
  ) => {
    onChange(
      certifications.map((c) => (c.id === id ? { ...c, ...fields } : c)),
    );
  };

  const removeCertification = (id: string) => {
    onChange(certifications.filter((c) => c.id !== id));
  };

  return (
    <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <Award className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Certifications & Accreditations ({certifications.length})</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addCertification}
            className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-100"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certificate</span>
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="p-1 cursor-pointer text-slate-400"
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 space-y-3 bg-white dark:bg-slate-900">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-center justify-between gap-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) =>
                    updateCertification(cert.id, { name: e.target.value })
                  }
                  placeholder="Certificate Name (e.g. AWS Solutions Architect)"
                  className="input-field text-xs"
                />
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) =>
                    updateCertification(cert.id, { issuer: e.target.value })
                  }
                  placeholder="Issuing Organization"
                  className="input-field text-xs"
                />
                <input
                  type="text"
                  value={cert.date || ""}
                  onChange={(e) =>
                    updateCertification(cert.id, { date: e.target.value })
                  }
                  placeholder="Year / Valid Date"
                  className="input-field text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => removeCertification(cert.id)}
                className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                title="Remove certificate"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
