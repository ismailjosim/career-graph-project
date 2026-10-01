export function WishlistLoading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-rose-200 dark:border-rose-900 border-t-rose-500 rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
          Loading your wishlist...
        </p>
      </div>
    </div>
  );
}
