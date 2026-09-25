"use client";

import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  formatStatusLabel,
  getStatusBadgeClass,
  getStatusDotClass,
} from "./applications.utils";

const STATUS_CHOICES = [
  { value: "applied", label: "Applied" },
  { value: "interview_scheduled", label: "Interview Scheduled" },
  { value: "interviewed", label: "Interviewed" },
  { value: "offer_received", label: "Offer Received" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

interface ApplicationStatusDropdownProps {
  applicationId: string;
  currentStatus: string;
  onUpdateStatus?: (id: string, newStatus: string) => Promise<void>;
  disabled?: boolean;
}

export function ApplicationStatusDropdown({
  applicationId,
  currentStatus,
  onUpdateStatus,
  disabled = false,
}: ApplicationStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelect = async (newStatus: string) => {
    if (newStatus === localStatus || updating || !onUpdateStatus) {
      setIsOpen(false);
      return;
    }

    const previousStatus = localStatus;
    setLocalStatus(newStatus);
    setUpdating(true);
    setIsOpen(false);

    try {
      await onUpdateStatus(applicationId, newStatus);
    } catch {
      // Revert on error
      setLocalStatus(previousStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled && !updating) setIsOpen((prev) => !prev);
        }}
        disabled={disabled || updating}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none hover:shadow-xs focus:outline-hidden ${getStatusBadgeClass(
          localStatus,
        )} ${disabled ? "opacity-60 cursor-not-allowed" : "hover:brightness-95"}`}
        title="Click to update application status"
      >
        {updating ? (
          <Loader2 className="w-3 h-3 animate-spin shrink-0 text-current" />
        ) : (
          <span
            className={`w-1.5 h-1.5 rounded-full ring-2 shrink-0 ${getStatusDotClass(
              localStatus,
            )}`}
          />
        )}
        <span className="truncate max-w-32.5">
          {formatStatusLabel(localStatus)}
        </span>
        <ChevronDown
          className={`w-3 h-3 opacity-60 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1.5 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/60 mb-1">
            Update Status
          </div>
          {STATUS_CHOICES.map((choice) => {
            const isSelected = choice.value === localStatus;
            return (
              <button
                key={choice.value}
                type="button"
                onClick={() => handleSelect(choice.value)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ring-2 ${getStatusDotClass(
                      choice.value,
                    )}`}
                  />
                  <span>{choice.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
