import { Briefcase, Building2, Coins, Globe } from "lucide-react";

interface JobMarketStatsProps {
  stats: {
    totalActive: number;
    remoteCount: number;
  };
}

export function JobMarketStats({ stats }: JobMarketStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {stats.totalActive}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Active Roles
          </div>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {stats.remoteCount}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Remote Positions
          </div>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Coins className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
            5 - 15
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Tokens per Apply
          </div>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Direct
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Verified Hiring
          </div>
        </div>
      </div>
    </div>
  );
}
