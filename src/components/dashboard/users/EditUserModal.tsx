import { Crown, Loader2, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserRole } from "@/lib/validation";
import type { EditUserModalProps } from "./types";

export function EditUserModal({
  isOpen,
  onClose,
  user,
  currentUserRole,
  onSave,
}: EditUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("job_seeker");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !user) return;
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setError(null);
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const isTransferringSuperAdmin =
    role === "super_admin" && user.role !== "super_admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isTransferringSuperAdmin) {
      const confirmTransfer = window.confirm(
        `Are you sure you want to transfer the Super Admin role to ${name || email}?\n\nYou will automatically become an Admin, and this user will become the ONLY Super Admin.`,
      );
      if (!confirmTransfer) return;
    }

    setLoading(true);
    try {
      await onSave(user.id, {
        name: name.trim(),
        email: email.trim(),
        role,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user profile",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="card w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Edit User & Role
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-64">
                {user.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 text-xs sm:text-sm"
        >
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Assigned Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="input text-xs sm:text-sm cursor-pointer"
            >
              {/* Only super_admin can select Super Admin or Admin */}
              {currentUserRole === "super_admin" && (
                <>
                  <option value="super_admin">
                    👑 Super Admin (System Admin - Only 1)
                  </option>
                  <option value="admin">🛡️ Platform Admin</option>
                </>
              )}
              <option value="job_seeker">💼 Job Seeker (User)</option>
              <option value="recruiter">🤝 Recruiter</option>
              <option value="employer">🏢 Employer</option>
            </select>
          </div>

          {/* Super Admin Transfer Alert */}
          {isTransferringSuperAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Super Admin Role Transfer Warning</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Only <strong>one</strong> Super Admin can exist. Transferring
                this role will immediately reassign system ownership and adjust
                your account to a regular Admin.
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline py-2 px-4 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2 px-5 text-xs flex items-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
