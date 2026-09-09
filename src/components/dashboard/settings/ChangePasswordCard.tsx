import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import type { PasswordSettingsForm } from "./types";

interface ChangePasswordCardProps {
  form: PasswordSettingsForm;
  onChange: (field: keyof PasswordSettingsForm, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  isSocialOnly?: boolean;
}

export function ChangePasswordCard({
  form,
  onChange,
  onSubmit,
  saving,
  isSocialOnly = false,
}: ChangePasswordCardProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (isSocialOnly) {
    return (
      <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Lock className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Password & Security
          </h2>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authenticated via Social Login</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your account is authenticated through Google or GitHub OAuth. You do
            not need to manage a separate password for Career Graph.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <Lock className="w-5 h-5 text-indigo-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Change Password
          </h2>
          <p className="text-xs text-slate-500">
            Ensure your account is protected with a strong, unique password.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
        <div>
          <label
            htmlFor="current-password-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="current-password-input"
              type={showCurrent ? "text" : "password"}
              required
              value={form.currentPassword}
              onChange={(e) => onChange("currentPassword", e.target.value)}
              className="input text-xs sm:text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showCurrent ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="new-password-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
          >
            New Password (minimum 6 characters)
          </label>
          <div className="relative">
            <input
              id="new-password-input"
              type={showNew ? "text" : "password"}
              required
              minLength={6}
              value={form.newPassword}
              onChange={(e) => onChange("newPassword", e.target.value)}
              className="input text-xs sm:text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showNew ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirm-password-input"
              type={showConfirm ? "text" : "password"}
              required
              minLength={6}
              value={form.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              className="input text-xs sm:text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            <span>Update Password</span>
          </button>
        </div>
      </form>
    </div>
  );
}
