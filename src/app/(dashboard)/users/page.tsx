"use client";

import {
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  EditUserModal,
  type ManagedUser,
  type UserRoleFilter,
  UsersHeader,
  UsersLoading,
  UsersTable,
  UsersTableFilters,
  ViewUserModal,
} from "@/components/dashboard/users";
import { useSession } from "@/lib/auth-client";
import type { UserRole } from "@/lib/validation";

export default function UsersPage() {
  const { data: session, isPending } = useSession();
  const sessionRole =
    ((session?.user as unknown as Record<string, unknown>)?.role as UserRole) ||
    "job_seeker";
  const [verifiedRole, setVerifiedRole] = useState<UserRole | null>(null);
  const currentUserRole = verifiedRole || sessionRole;
  const currentUserId = session?.user?.id || "";

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({
    all: 0,
    super_admin: 1,
    admin: 0,
    job_seeker: 0,
    recruiter: 0,
    employer: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDenied, setIsDenied] = useState(false);

  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRoleFilter>("all");

  // Modal States
  const [viewingUser, setViewingUser] = useState<ManagedUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Status feedback toast/banner
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedRole !== "all") params.set("role", selectedRole);
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      params.set("page", currentPage.toString());
      params.set("limit", "15");

      const res = await fetch(`/api/users?${params.toString()}`);

      if (res.status === 401 || res.status === 403) {
        const data = await res.json().catch(() => ({}));
        setIsDenied(true);
        setError(data.error || "Access Denied: Admin privileges required.");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load users list");
      }

      setIsDenied(false);
      const data = await res.json();
      setUsers(data.users || []);
      if (data.roleCounts) {
        setRoleCounts(data.roleCounts);
      }
      if (data.pagination) {
        setPagination(data.pagination);
      }
      if (data.currentUserRole) {
        setVerifiedRole(data.currentUserRole);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [selectedRole, searchTerm, currentPage]);

  useEffect(() => {
    if (session?.user) {
      const timer = setTimeout(() => {
        fetchUsers();
      }, 150);
      return () => clearTimeout(timer);
    }
    if (!isPending && !session?.user) {
      setLoading(false);
      setIsDenied(true);
    }
  }, [fetchUsers, session, isPending]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (role: UserRoleFilter) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  const handleViewUser = (user: ManagedUser) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: ManagedUser) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (
    userId: string,
    updates: { name: string; email: string; role: UserRole },
  ) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to update user");
    }

    setFeedback({
      type: "success",
      message: `User "${updates.name}" was updated successfully!`,
    });
    setTimeout(() => setFeedback(null), 4000);

    // Refresh list and if viewing this user, update viewing modal data
    if (viewingUser && viewingUser.id === userId) {
      setViewingUser((prev) => (prev ? { ...prev, ...updates } : null));
    }

    fetchUsers();
  };

  const handleDeleteUser = async (user: ManagedUser) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete user "${user.name}" (${user.email})?\n\nThis will remove their profile and associated credentials.`,
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete user");
        return;
      }

      setFeedback({
        type: "success",
        message: data.message || "User was deleted successfully.",
      });
      setTimeout(() => setFeedback(null), 4000);

      fetchUsers();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    }
  };

  // 1. Loading Session state
  if (isPending) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Checking credentials...</p>
      </div>
    );
  }

  // 2. Unauthorized Access Protection Screen
  if (
    isDenied ||
    (currentUserRole !== "admin" && currentUserRole !== "super_admin")
  ) {
    return (
      <div className="card p-8 sm:p-12 text-center max-w-lg mx-auto my-12 space-y-5 border-2 border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 shadow-lg animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Admin Access Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The User Management console is restricted to platform{" "}
            <strong>Administrators</strong> and the <strong>Super Admin</strong>
            . Your account is assigned the{" "}
            <span className="font-bold uppercase text-slate-800 dark:text-slate-200">
              {currentUserRole.replace("_", " ")}
            </span>{" "}
            role.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="btn-primary py-2 px-5 text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-7 animate-fade-in pb-16">
      {/* Header */}
      <UsersHeader
        totalCount={roleCounts.all || users.length}
        roleCounts={roleCounts}
        currentUserRole={currentUserRole}
      />

      {/* Feedback Banner */}
      {feedback && (
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
            onClick={() => setFeedback(null)}
            className="text-xs underline font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <UsersTableFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
        roleCounts={roleCounts}
      />

      {/* Table Content */}
      {loading ? (
        <UsersLoading />
      ) : error ? (
        <div className="card p-8 text-center text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 space-y-2">
          <AlertCircle className="w-6 h-6 mx-auto" />
          <p className="font-semibold text-sm">Failed to load users</p>
          <p className="text-xs">{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="card p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-800 space-y-3">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            No users match your criteria
          </p>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or switching role filter tabs.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <UsersTable
            users={users}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 text-xs text-slate-500">
              <div>
                Showing{" "}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {pagination.total}
                </span>{" "}
                users
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-2.5 py-1 text-xs font-semibold">
                  Page {currentPage} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(pagination.totalPages, p + 1),
                    )
                  }
                  disabled={currentPage >= pagination.totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View User Modal */}
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={viewingUser}
        currentUserRole={currentUserRole}
        onEditUser={(u) => {
          setIsViewModalOpen(false);
          handleEditUser(u);
        }}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={editingUser}
        currentUserRole={currentUserRole}
        onSave={handleSaveUser}
      />
    </div>
  );
}
