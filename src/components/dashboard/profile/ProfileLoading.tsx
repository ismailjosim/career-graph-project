export function ProfileLoading() {
  return (
    <div className="py-24 text-center space-y-3 animate-fade-in">
      <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-xs text-slate-500 font-medium">
        Loading profile & documents...
      </p>
    </div>
  );
}
