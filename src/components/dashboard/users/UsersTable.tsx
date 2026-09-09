import {
  Briefcase,
  Building2,
  CheckCircle2,
  Crown,
  Pencil,
  ShieldCheck,
  Trash2,
  UserCheck,
} from "lucide-react";
import type { ManagedUser, UsersTableProps } from "./types";

export function UsersTable({
  users,
  currentUserId,
  currentUserRole,
  onEditUser,
  onDeleteUser,
}: UsersTableProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return {
          label: "Super Admin",
          icon: Crown,
          style:
            "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800/60",
        };
      case "admin":
        return {
          label: "Admin",
          icon: ShieldCheck,
          style:
            "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800/60",
        };
      case "recruiter":
        return {
          label: "Recruiter",
          icon: UserCheck,
          style:
            "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800/60",
        };
      case "employer":
        return {
          label: "Employer",
          icon: Building2,
          style:
            "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300 dark:border-teal-800/60",
        };
      default:
        return {
          label: "Job Seeker",
          icon: Briefcase,
          style:
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
        };
    }
  };

  const getInitials = (name: string, email: string) => {
    if (name?.trim()) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  const canEdit = (target: ManagedUser) => {
    // Super admin can edit anyone
    if (currentUserRole === "super_admin") return true;
    // Regular admin cannot edit super_admin or other admins
    if (target.role === "super_admin" || target.role === "admin") {
      return target.id === currentUserId; // Can edit own profile
    }
    return true;
  };

  const canDelete = (target: ManagedUser) => {
    // Cannot delete self
    if (target.id === currentUserId) return false;
    // Cannot delete super_admin
    if (target.role === "super_admin") return false;
    // Regular admin cannot delete other admins
    if (target.role === "admin" && currentUserRole !== "super_admin") {
      return false;
    }
    return true;
  };

  return (
    <div className="card overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            <tr>
              <th className="px-5 py-3.5">User</th>
              <th className="px-4 py-3.5">Assigned Role</th>
              <th className="px-4 py-3.5 hidden md:table-cell">Status</th>
              <th className="px-4 py-3.5 hidden lg:table-cell">Joined Date</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {users.map((user) => {
              const roleMeta = getRoleBadge(user.role);
              const RoleIcon = roleMeta.icon;
              const isSelf = user.id === currentUserId;
              const editable = canEdit(user);
              const deletable = canDelete(user);

              return (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* User Avatar + Name + Email */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {getInitials(user.name, user.email)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {user.name}
                          </p>
                          {isSelf && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${roleMeta.style}`}
                    >
                      <RoleIcon className="w-3.5 h-3.5" />
                      <span>{roleMeta.label}</span>
                    </span>
                  </td>

                  {/* Verification Status */}
                  <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        Unverified
                      </span>
                    )}
                  </td>

                  {/* Joined Date */}
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 hidden lg:table-cell">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditUser(user)}
                        disabled={!editable}
                        className={`p-2 rounded-lg transition cursor-pointer ${
                          editable
                            ? "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            : "text-slate-300 dark:text-slate-700 cursor-not-allowed"
                        }`}
                        title={
                          editable
                            ? "Edit User Role & Details"
                            : "Protected (Super Admin access required)"
                        }
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteUser(user)}
                        disabled={!deletable}
                        className={`p-2 rounded-lg transition cursor-pointer ${
                          deletable
                            ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            : "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40"
                        }`}
                        title={
                          isSelf
                            ? "Cannot delete your own account"
                            : user.role === "super_admin"
                              ? "Super Admin cannot be deleted"
                              : !deletable
                                ? "Only Super Admin can delete admin accounts"
                                : "Delete User"
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
