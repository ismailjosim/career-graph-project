export function JobMarketLoading() {
  const SKELETON_ITEMS = [1, 2, 3, 4, 5, 6];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {SKELETON_ITEMS.map((item) => (
        <div
          key={item}
          className="card p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-4 animate-pulse"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-1.5">
                <div className="w-28 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="w-16 h-3 rounded-md bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="flex gap-2">
            <div className="w-16 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="w-12 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="w-3/4 h-3 rounded-md bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="flex gap-1.5">
            <div className="w-14 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="w-12 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="w-16 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="w-16 h-3 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="w-20 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
