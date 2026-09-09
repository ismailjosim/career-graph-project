import Swal, { type SweetAlertOptions } from "sweetalert2";

// Helper to detect dark mode
const isDarkMode = (): boolean => {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
};

// Base config tailored to app theme
const getBaseSwalConfig = (): SweetAlertOptions => {
  const dark = isDarkMode();
  return {
    background: dark ? "#0f172a" : "#ffffff",
    color: dark ? "#f8fafc" : "#0f172a",
    confirmButtonColor: "#4f46e5",
    cancelButtonColor: dark ? "#334155" : "#94a3b8",
    customClass: {
      popup: "rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl font-sans",
      title: "text-lg font-bold text-slate-900 dark:text-white",
      htmlContainer: "text-sm text-slate-600 dark:text-slate-300",
      confirmButton:
        "rounded-xl px-5 py-2.5 font-semibold text-sm shadow-md transition-all",
      cancelButton:
        "rounded-xl px-5 py-2.5 font-semibold text-sm transition-all",
    },
  };
};

/**
 * Confirm using tokens before executing an AI feature
 * Returns true if confirmed, false if canceled or insufficient
 */
export async function confirmTokenUsage(params: {
  featureName: string;
  tokenCost: number;
  currentTokens: number;
  onNavigateToPricing?: () => void;
}): Promise<boolean> {
  const { featureName, tokenCost, currentTokens, onNavigateToPricing } = params;

  // Case 1: Insufficient tokens
  if (currentTokens < tokenCost) {
    const result = await Swal.fire({
      ...getBaseSwalConfig(),
      icon: "warning",
      iconColor: "#f59e0b",
      title: "Insufficient Tokens",
      html: `
        <div class="space-y-3 pt-2">
          <p class="text-sm">
            <strong>${featureName}</strong> requires 
            <span class="inline-flex items-center font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
              🪙 ${tokenCost} Tokens
            </span>
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Your current balance is <strong>${currentTokens}</strong>. Please purchase tokens to continue.
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "🪙 Get Tokens",
      cancelButtonText: "Not Now",
      confirmButtonColor: "#d97706",
    });

    if (result.isConfirmed) {
      if (onNavigateToPricing) {
        onNavigateToPricing();
      } else if (typeof window !== "undefined") {
        window.location.href = "/pricing";
      }
    }

    return false;
  }

  // Case 2: Sufficient tokens - ask for confirmation
  const remaining = currentTokens - tokenCost;
  const result = await Swal.fire({
    ...getBaseSwalConfig(),
    icon: "question",
    iconColor: "#6366f1",
    title: "Confirm Token Usage",
    html: `
      <div class="space-y-3 pt-2">
        <p class="text-sm">
          Generate with <strong>${featureName}</strong> for:
        </p>
        <div class="flex items-center justify-center gap-2 py-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-base font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            🪙 ${tokenCost} Tokens
          </span>
        </div>
        <div class="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2 flex justify-between">
          <span>Current Balance: <strong>${currentTokens}</strong></span>
          <span>Balance After: <strong class="text-indigo-600 dark:text-indigo-400">${remaining}</strong></span>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: `Yes, Use ${tokenCost} Tokens`,
    cancelButtonText: "Cancel",
    confirmButtonColor: "#4f46e5",
  });

  return result.isConfirmed;
}

/**
 * Standard confirmation dialog (e.g. for deletes or permanent actions)
 */
export async function confirmAction(params: {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDestructive?: boolean;
}): Promise<boolean> {
  const {
    title,
    text,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    isDestructive = false,
  } = params;

  const result = await Swal.fire({
    ...getBaseSwalConfig(),
    icon: isDestructive ? "warning" : "question",
    iconColor: isDestructive ? "#ef4444" : "#6366f1",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: isDestructive ? "#dc2626" : "#4f46e5",
  });

  return result.isConfirmed;
}

/**
 * Standard success alert modal
 */
export async function showSuccessAlert(title: string, text?: string) {
  return Swal.fire({
    ...getBaseSwalConfig(),
    icon: "success",
    iconColor: "#10b981",
    title,
    text,
    confirmButtonText: "Great",
  });
}

/**
 * Standard error alert modal
 */
export async function showErrorAlert(title: string, text?: string) {
  return Swal.fire({
    ...getBaseSwalConfig(),
    icon: "error",
    iconColor: "#ef4444",
    title,
    text,
    confirmButtonText: "Dismiss",
  });
}
