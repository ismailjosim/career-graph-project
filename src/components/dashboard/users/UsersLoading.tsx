export function UsersLoading() {
  const SKELETON_ROWS = [1, 2, 3, 4, 5, 6];

  return (
    <div className="card overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-xs animate-pulse">
      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex justify-between">
        <div className="w-32 h-4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
        {SKELETON_ROWS.map((row) => (
          <div
            key={row}
            className="p-3.5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1.5">
                <div className="w-28 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="w-40 h-3 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>

            <div className="w-24 h-6 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800 hidden lg:block" />
            <div className="w-16 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
