"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  AdjustTokensModal,
  EditUserModal,
  type ManagedUser,
  UsersAccessDenied,
  UsersFeedbackBanner,
  UsersHeader,
  UsersLoading,
  UsersPagination,
  UsersTable,
  UsersTableFilters,
  useUsersManager,
  ViewUserModal,
} from "@/components/dashboard/users";

export function UsersClient() {
  const {
    isPending,
    isDenied,
    currentUserRole,
    currentUserId,
    users,
    roleCounts,
    pagination,
    currentPage,
    loading,
    error,
    searchTerm,
    selectedRole,
    handleSearchChange,
    handleRoleChange,
    setCurrentPage,
    viewingUser,
    isViewModalOpen,
    editingUser,
    isEditModalOpen,
    handleViewUser,
    handleCloseViewModal,
    handleEditUser,
    handleCloseEditModal,
    handleChangeStatus,
    handleToggleVerify,
    handleSaveUser,
    handleDeleteUser,
    feedback,
    dismissFeedback,
    refreshUsers,
  } = useUsersManager();

  const [adjustingUser, setAdjustingUser] = useState<ManagedUser | null>(null);

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
    return <UsersAccessDenied currentUserRole={currentUserRole} />;
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
      <UsersFeedbackBanner feedback={feedback} onDismiss={dismissFeedback} />

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
            onChangeStatus={handleChangeStatus}
            onToggleVerify={handleToggleVerify}
            onAdjustTokens={(u) => setAdjustingUser(u)}
          />

          {/* Pagination Controls */}
          <UsersPagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* View User Modal */}
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        user={viewingUser}
        currentUserRole={currentUserRole}
        onEditUser={(u) => {
          handleCloseViewModal();
          handleEditUser(u);
        }}
        onChangeStatus={handleChangeStatus}
        onToggleVerify={handleToggleVerify}
        onAdjustTokens={(u) => {
          handleCloseViewModal();
          setAdjustingUser(u);
        }}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        user={editingUser}
        currentUserRole={currentUserRole}
        onSave={handleSaveUser}
      />

      {/* Adjust Tokens Modal */}
      <AdjustTokensModal
        isOpen={Boolean(adjustingUser)}
        user={adjustingUser}
        onClose={() => setAdjustingUser(null)}
        onSuccess={() => {
          refreshUsers();
        }}
      />
    </div>
  );
}
