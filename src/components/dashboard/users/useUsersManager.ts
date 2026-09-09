import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { confirmAction } from "@/lib/alerts";
import { useSession } from "@/lib/auth-client";
import type { UserRole, UserStatus } from "@/lib/validation";
import type { ManagedUser, UserRoleFilter } from "./types";

export function useUsersManager() {
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

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleEditUser = (user: ManagedUser) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleChangeStatus = async (
    user: ManagedUser,
    newStatus: UserStatus,
  ) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update account status");
      }

      const msg = `Account status for "${user.name}" set to ${newStatus.toUpperCase()}`;
      setFeedback({
        type: "success",
        message: msg,
      });
      toast.success(msg);
      setTimeout(() => setFeedback(null), 4000);

      if (viewingUser && viewingUser.id === user.id) {
        setViewingUser((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }

      fetchUsers();
    } catch (err) {
      const errText =
        err instanceof Error ? err.message : "Failed to change status";
      toast.error(errText);
    }
  };

  const handleToggleVerify = async (user: ManagedUser) => {
    try {
      const newStatus = !user.emailVerified;
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailVerified: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update verification status");
      }

      const msg = `User "${user.name}" is now marked as ${newStatus ? "VERIFIED" : "UNVERIFIED"}`;
      setFeedback({
        type: "success",
        message: msg,
      });
      toast.success(msg);
      setTimeout(() => setFeedback(null), 4000);

      if (viewingUser && viewingUser.id === user.id) {
        setViewingUser((prev) =>
          prev ? { ...prev, emailVerified: newStatus } : null,
        );
      }

      fetchUsers();
    } catch (err) {
      const errText =
        err instanceof Error ? err.message : "Failed to toggle verification";
      toast.error(errText);
    }
  };

  const handleSaveUser = async (
    userId: string,
    updates: {
      name: string;
      email: string;
      role: UserRole;
      status?: UserStatus;
      emailVerified?: boolean;
      phone?: string;
      location?: string;
      headline?: string;
      bio?: string;
    },
  ) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      const msg = `User "${updates.name}" was updated successfully!`;
      setFeedback({
        type: "success",
        message: msg,
      });
      toast.success(msg);
      setTimeout(() => setFeedback(null), 4000);

      if (viewingUser && viewingUser.id === userId) {
        setViewingUser((prev) => (prev ? { ...prev, ...updates } : null));
      }

      fetchUsers();
    } catch (err) {
      const errText =
        err instanceof Error ? err.message : "Failed to update user";
      toast.error(errText);
      throw err;
    }
  };

  const handleDeleteUser = async (user: ManagedUser) => {
    const confirmDelete = await confirmAction({
      title: `Delete User "${user.name}"?`,
      text: `Are you sure you want to permanently delete user "${user.name}" (${user.email})? This will remove their profile and credentials.`,
      isDestructive: true,
      confirmButtonText: "Delete User",
    });

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to delete user");
        return;
      }

      const msg = data.message || "User was deleted successfully.";
      setFeedback({
        type: "success",
        message: msg,
      });
      toast.success(msg);
      setTimeout(() => setFeedback(null), 4000);

      fetchUsers();
    } catch (err) {
      const errText =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(errText);
    }
  };

  return {
    // Auth & Identity
    isPending,
    isDenied,
    currentUserRole,
    currentUserId,
    // Data
    users,
    roleCounts,
    pagination,
    currentPage,
    loading,
    error,
    // Filters
    searchTerm,
    selectedRole,
    handleSearchChange,
    handleRoleChange,
    setCurrentPage,
    // Modals
    viewingUser,
    isViewModalOpen,
    editingUser,
    isEditModalOpen,
    handleViewUser,
    handleCloseViewModal,
    handleEditUser,
    handleCloseEditModal,
    // Actions
    handleChangeStatus,
    handleToggleVerify,
    handleSaveUser,
    handleDeleteUser,
    // Feedback
    feedback,
    dismissFeedback: () => setFeedback(null),
    refreshUsers: fetchUsers,
  };
}
