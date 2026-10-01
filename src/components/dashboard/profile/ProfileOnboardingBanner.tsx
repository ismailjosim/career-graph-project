"use client";

import { Pencil, Sparkles } from "lucide-react";

interface ProfileOnboardingBannerProps {
  isVisible: boolean;
  onStartEditing?: () => void;
}

export function ProfileOnboardingBanner({
  isVisible,
  onStartEditing,
}: ProfileOnboardingBannerProps) {
  if (!isVisible) return null;

  return (
    <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800/60 shadow-xs flex items-start justify-between gap-3.5">
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 shadow-sm mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <h3 className="font-bold text-indigo-950 dark:text-indigo-200">
            Complete Your Profile For Personalized Cover Letters
          </h3>
          <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed text-xs">
            Adding your target job title, contact details, and professional
            pitch enables Career Graph to automatically generate customized,
            job-specific cover letters aligned with your background.
          </p>
        </div>
      </div>

      {onStartEditing && (
        <button
          type="button"
          onClick={onStartEditing}
          className="btn-primary py-1.5 px-3 text-xs shrink-0 inline-flex items-center gap-1.5 cursor-pointer mt-0.5"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit Details</span>
        </button>
      )}
    </div>
  );
}
