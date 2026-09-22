"use client";

import { Bookmark, Globe, Plus } from "lucide-react";
import type { JobMarketHeaderProps } from "./types";

export function JobMarketHeader({
  totalCount,
  filteredCount,
  favoriteCount,
  onAddMarket,
}: JobMarketHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Globe className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Job Market Directory
          </h1>
          <div className="flex items-center gap-1.5 ml-1">
            <span className="badge-primary text-xs py-0.5 px-2.5 font-bold">
              {totalCount} {totalCount === 1 ? "Platform" : "Platforms"}
            </span>
            {filteredCount !== totalCount && (
              <span className="text-xs text-slate-500 font-medium">
                ({filteredCount} matching)
              </span>
            )}
            {favoriteCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 flex items-center gap-1">
                <Bookmark className="w-3 h-3 fill-rose-500 text-rose-500" />
                <span>{favoriteCount}</span>
              </span>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Curate, bookmark, and track online job marketplaces, startup boards,
          and niche hiring platforms discovered across the web.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onAddMarket}
          className="btn-primary py-2.5 px-4 text-xs sm:text-sm shadow-sm flex items-center gap-2 cursor-pointer group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>Add Marketplace</span>
        </button>
      </div>
    </div>
  );
}
