import { CheckCircle2, ShieldAlert, Sliders } from "lucide-react";

interface SettingsHeaderProps {
  email: string;
  emailVerified: boolean;
}

export function SettingsHeader({ email, emailVerified }: SettingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
            <Sliders className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Account Settings
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
          Manage your login password, update your professional profile details,
          and oversee account security preferences.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {email && (
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {email}
          </span>
        )}
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border ${
            emailVerified
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60"
          }`}
        >
          {emailVerified ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Email Verified</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Unverified Email</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
