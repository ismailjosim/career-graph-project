import { Search, X } from "lucide-react";
import type { CoverLetterFilterBarProps } from "./types";

export function CoverLetterFilterBar({
  searchTerm,
  onSearchChange,
}: CoverLetterFilterBarProps) {
  return (
    <div className="card p-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search cover letters by title or content keywords..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input pl-12 pr-10"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
