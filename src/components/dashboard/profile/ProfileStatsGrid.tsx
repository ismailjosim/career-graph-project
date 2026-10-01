import { BookOpen, Briefcase, FileText } from "lucide-react";
import type { ProfileStats } from "./types";

interface ProfileStatsGridProps {
  stats: ProfileStats;
}

export function ProfileStatsGrid({ stats }: ProfileStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 shadow-xs">
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Uploaded Resumes</p>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100">
            {stats.totalResumes}
          </p>
        </div>
      </div>

      <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 shadow-xs">
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">
            Total Cover Letters
          </p>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100">
            {stats.totalCoverLetters}
          </p>
        </div>
      </div>

      <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 shadow-xs">
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">
            Applications Tracked
          </p>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100">
            {stats.totalApplications}
          </p>
        </div>
      </div>
    </div>
  );
}
