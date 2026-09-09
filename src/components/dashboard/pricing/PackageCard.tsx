import { Check, Coins, Edit2, Sparkles, Trash2 } from "lucide-react";
import type { TokenPackageData } from "./types";

interface PackageCardProps {
  pkg: TokenPackageData;
  isAdmin: boolean;
  onSelect: (pkg: TokenPackageData) => void;
  onEdit?: (pkg: TokenPackageData) => void;
  onDelete?: (pkg: TokenPackageData) => void;
}

export function PackageCard({
  pkg,
  isAdmin,
  onSelect,
  onEdit,
  onDelete,
}: PackageCardProps) {
  const isPopular = Boolean(pkg.isPopular);

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 transition-all duration-300 p-6 sm:p-8 ${
        isPopular
          ? "border-2 border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02] z-10"
          : "border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      {/* Popular or Custom Badge */}
      {(isPopular || pkg.badge) && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase shadow-sm ${
              isPopular
                ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-indigo-500/30"
                : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
            }`}
          >
            {isPopular && <Sparkles className="w-3 h-3 text-amber-300" />}
            <span>{pkg.badge || "Most Popular"}</span>
          </span>
        </div>
      )}

      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {pkg.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
              {pkg.description || "High-value token pack for AI career tools."}
            </p>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex items-center gap-1 shrink-0 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              {onEdit && (
                <button
                  onClick={() => onEdit(pkg)}
                  title="Edit Package"
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(pkg)}
                  title="Delete Package"
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pricing Display */}
        <div className="flex items-baseline gap-1 my-5 pb-5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            ${pkg.price}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            USD / one-time
          </span>
        </div>

        {/* Token Count Highlight */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-900 dark:text-amber-200 mb-6">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-black font-mono tracking-tight block">
              {pkg.tokens.toLocaleString()} Tokens
            </span>
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
              ≈ ${(pkg.price / (pkg.tokens / 100)).toFixed(2)} per 100 tokens
            </span>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-8">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Included in this pack:
          </p>
          <ul className="space-y-2.5">
            {pkg.features?.map((feat, idx) => (
              <li
                key={`${pkg._id}-feat-${idx}`}
                className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Buy Button */}
      <button
        onClick={() => onSelect(pkg)}
        className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
          isPopular
            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01]"
            : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900"
        }`}
      >
        <Coins className="w-4 h-4" />
        <span>Buy {pkg.tokens.toLocaleString()} Tokens</span>
      </button>
    </div>
  );
}
