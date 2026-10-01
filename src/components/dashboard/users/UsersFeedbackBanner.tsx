"use client";

interface UsersFeedbackBannerProps {
  feedback: {
    type: "success" | "error";
    message: string;
  } | null;
  onDismiss: () => void;
}

export function UsersFeedbackBanner({
  feedback,
  onDismiss,
}: UsersFeedbackBannerProps) {
  if (!feedback) return null;

  return (
    <div
      className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${
        feedback.type === "success"
          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
          : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/60"
      }`}
    >
      <span>{feedback.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-xs underline font-semibold cursor-pointer"
      >
        Dismiss
      </button>
    </div>
  );
}
