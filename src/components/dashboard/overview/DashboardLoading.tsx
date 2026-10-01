export function DashboardLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50"
          />
        ))}
      </div>

      {/* Chart & Insights Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50" />
        <div className="h-72 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50" />
      </div>

      {/* Applications Table Skeleton */}
      <div className="h-64 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50" />
    </div>
  );
}
