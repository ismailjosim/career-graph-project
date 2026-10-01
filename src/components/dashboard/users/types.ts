import type {
  ManagedUser,
  UserRoleFilter,
  UserStatusFilter,
} from "@/interfaces";
import type { UserRole, UserStatus } from "@/lib/validation";

export type { ManagedUser, UserRoleFilter, UserStatusFilter };

export interface UsersHeaderProps {
  totalCount: number;
  roleCounts: Record<string, number>;
  statusCounts?: Record<string, number>;
  currentUserRole: UserRole;
}

export interface UsersTableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: UserRoleFilter;
  onRoleChange: (role: UserRoleFilter) => void;
  roleCounts: Record<string, number>;
  selectedStatus?: UserStatusFilter;
  onStatusChange?: (status: UserStatusFilter) => void;
  statusCounts?: Record<string, number>;
}

export interface UsersTableProps {
  users: ManagedUser[];
  currentUserId: string;
  currentUserRole: UserRole;
  onViewUser: (user: ManagedUser) => void;
  onEditUser: (user: ManagedUser) => void;
  onDeleteUser: (user: ManagedUser) => void;
  onChangeStatus?: (user: ManagedUser, newStatus: UserStatus) => Promise<void>;
  onToggleVerify?: (user: ManagedUser) => Promise<void>;
  onAdjustTokens?: (user: ManagedUser) => void;
}

export interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ManagedUser | null;
  currentUserRole: UserRole;
  onEditUser?: (user: ManagedUser) => void;
  onChangeStatus?: (user: ManagedUser, newStatus: UserStatus) => Promise<void>;
  onToggleVerify?: (user: ManagedUser) => Promise<void>;
  onAdjustTokens?: (user: ManagedUser) => void;
}

export interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ManagedUser | null;
  currentUserRole: UserRole;
  onSave: (
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
  ) => Promise<void>;
}
