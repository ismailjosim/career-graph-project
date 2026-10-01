"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface CoverLetterLimitBannerProps {
  planName?: string;
  count?: number;
  max?: number;
  onClose: () => void;
}

export function CoverLetterLimitBanner({
  planName = "Free Plan",
  count = 3,
  max = 3,
  onClose,
}: CoverLetterLimitBannerProps) {
  return (
    <div className="p-6 pb-0">
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-amber-900 dark:text-amber-200">
              Storage Limit Reached ({count}/{max} Cover Letters)
            </h4>
            <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              On the <strong>{planName}</strong>, you can store up to {max}{" "}
              cover letters. Please delete an older cover letter to make room,
              or upgrade to Pro.
            </p>
          </div>
        </div>
        <Link
          href="/pricing"
          onClick={onClose}
          className="btn-primary py-1.5 px-3 text-xs shrink-0 whitespace-nowrap self-start sm:self-auto"
        >
          Upgrade Plan
        </Link>
      </div>
    </div>
  );
}
