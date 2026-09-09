export function ResumeLoading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
          Loading resumes...
        </p>
      </div>
    </div>
  );
}
