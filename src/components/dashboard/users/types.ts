import type { UserRole } from "@/lib/validation";

export interface ManagedUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type UserRoleFilter = "all" | UserRole;

export interface UsersHeaderProps {
  totalCount: number;
  roleCounts: Record<string, number>;
  currentUserRole: UserRole;
}

export interface UsersTableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: UserRoleFilter;
  onRoleChange: (role: UserRoleFilter) => void;
  roleCounts: Record<string, number>;
}

export interface UsersTableProps {
  users: ManagedUser[];
  currentUserId: string;
  currentUserRole: UserRole;
  onEditUser: (user: ManagedUser) => void;
  onDeleteUser: (user: ManagedUser) => void;
}

export interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ManagedUser | null;
  currentUserRole: UserRole;
  onSave: (
    userId: string,
    updates: { name: string; email: string; role: UserRole },
  ) => Promise<void>;
}
