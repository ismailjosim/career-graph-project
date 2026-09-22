import type {
  EducationEntry,
  TechnicalSkill,
  UserRole,
  UserStatus,
} from "@/lib/validation";

export type { EducationEntry, TechnicalSkill, UserRole, UserStatus };

export interface ManagedUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  status: UserStatus;
  headline?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[] | string;
  website?: string;
  linkedin?: string;
  experience?: string;
  education?: string;
  tokens?: number;
  isProfileComplete?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type UserRoleFilter = "all" | UserRole;
export type UserStatusFilter = "all" | UserStatus;

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  location?: string;
  headline?: string;
  bio?: string;
  skills?: string[] | string;
  technicalSkills?: TechnicalSkill[] | string;
  website?: string;
  linkedin?: string;
  experience?: string;
  education?: EducationEntry[] | string;
  isProfileComplete?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ProfileStats {
  totalResumes: number;
  totalCoverLetters: number;
  totalApplications: number;
}

export interface ProfileResume {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  isDefault: boolean;
  uploadedAt: string | Date;
}

export interface ProfileCoverLetter {
  id: string;
  title: string;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProfileData {
  user: ProfileUser;
  stats: ProfileStats;
  resumes: ProfileResume[];
  coverLetters: ProfileCoverLetter[];
}

export interface ProfileFormData {
  name: string;
  headline: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  technicalSkills: TechnicalSkill[];
  website: string;
  linkedin: string;
  experience: string;
  education: EducationEntry[];
}

export interface AccountSecurityInfo {
  email: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  isSocialOnly: boolean;
}

export interface ProfileSettingsForm {
  name: string;
  headline: string;
  phone: string;
  location: string;
  bio: string;
  skills: string;
  website: string;
  linkedin: string;
  experience: string;
  education: string;
}

export interface PasswordSettingsForm {
  currentPassword: "";
  newPassword: "";
  confirmPassword: "";
}
