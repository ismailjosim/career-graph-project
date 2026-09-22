"use client";
import {
  Bookmark,
  ExternalLink,
  Eye,
  Globe,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { JobMarketCardProps } from "./types";

const CATEGORY_STYLES: Record<string, string> = {
  remote:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50",
  tech: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900/50",
  startups:
    "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-900/50",
  freelance:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900/50",
  design:
    "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300 border-pink-200 dark:border-pink-900/50",
  general:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  local:
    "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-900/50",
  other:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

export function JobMarketCard({
  market,
  onVisit,
  onToggleFavorite,
  onEdit,
  onDelete,
}: JobMarketCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getDomain = (url: string) => {
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return "external";
    }
  };

  const domain = getDomain(market.link);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  const categoryStyle =
    CATEGORY_STYLES[market.category] || CATEGORY_STYLES.general;

  const handleVisitClick = () => {
    if (market._id) {
      onVisit(market._id, market.link);
    }
    const targetUrl = market.link.startsWith("http")
      ? market.link
      : `https://${market.link}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="card p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-md flex flex-col justify-between group relative">
      <div>
        {/* Card Header: Favicon, Name, Domain, Actions */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-2 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
              {!imgError ? (
                <Image
                  src={faviconUrl}
                  alt={market.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain rounded-xs"
                  onError={() => setImgError(true)}
                  unoptimized
                />
              ) : (
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {market.name}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                {domain}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Bookmark button */}
            <button
              type="button"
              onClick={() =>
                market._id && onToggleFavorite(market._id, market.isFavorite)
              }
              className={`p-2 rounded-lg transition cursor-pointer ${
                market.isFavorite
                  ? "text-rose-500 bg-rose-50 dark:bg-rose-950/40"
                  : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title={
                market.isFavorite ? "Remove from Favorites" : "Add to Favorites"
              }
            >
              <Bookmark
                className={`w-4 h-4 ${
                  market.isFavorite ? "fill-rose-500" : ""
                }`}
              />
            </button>

            {/* Overflow Options Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-30 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(market);
                      }}
                      className="w-full px-3 py-1.5 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Market</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        if (market._id) onDelete(market._id);
                      }}
                      className="w-full px-3 py-1.5 text-xs text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Category & Rating Row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${categoryStyle}`}
          >
            {market.category}
          </span>

          {typeof market.rating === "number" && market.rating > 0 && (
            <div className="flex items-center gap-1 text-amber-500 bg-amber-50/60 dark:bg-amber-950/30 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800/30">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                {market.rating}.0
              </span>
            </div>
          )}
        </div>

        {/* Description / Overview */}
        {market.description ? (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {market.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-3">
            No description provided.
          </p>
        )}

        {/* Tags */}
        {market.tags && market.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {market.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Visit count + CTA Button */}
      <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Eye className="w-3.5 h-3.5" />
          <span>
            {market.visitCount || 0}{" "}
            {market.visitCount === 1 ? "visit" : "visits"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleVisitClick}
          className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs group/btn"
        >
          <span>Visit Site</span>
          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
