"use client";

import { AlertCircle, ArrowLeft, ShieldAlert } from "lucide-react";
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
} from "@/components/dashboard/users";
import { useSession } from "@/lib/auth-client";
import type { UserRole } from "@/lib/validation";

export default function UsersPage() {
  const { data: session, isPending } = useSession();
  const currentUserRole =
    ((session?.user as unknown as Record<string, unknown>)?.role as UserRole) ||
    "job_seeker";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRoleFilter>("all");

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      const res = await fetch(`/api/users?${params.toString()}`);

      if (res.status === 401 || res.status === 403) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Access Denied: Admin privileges required.");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load users list");
      }

      const data = await res.json();
      setUsers(data.users || []);
      if (data.roleCounts) {
        setRoleCounts(data.roleCounts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [selectedRole, searchTerm]);

  useEffect(() => {
    if (
      session?.user &&
      (currentUserRole === "admin" || currentUserRole === "super_admin")
    ) {
      const timer = setTimeout(() => {
        fetchUsers();
      }, 200);
      return () => clearTimeout(timer);
    }
    if (!isPending) {
      setLoading(false);
    }
  }, [fetchUsers, session, isPending, currentUserRole]);

  const handleEditUser = (user: ManagedUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
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
      message: `User ${updates.name} updated successfully!`,
    });
    setTimeout(() => setFeedback(null), 4000);

    // Refresh list
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
  if (currentUserRole !== "admin" && currentUserRole !== "super_admin") {
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
        onSearchChange={setSearchTerm}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
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
        <UsersTable
          users={users}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        currentUserRole={currentUserRole}
        onSave={handleSaveUser}
      />
    </div>
  );
}
