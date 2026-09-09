import type { UserRole, UserStatus } from "@/lib/validation";

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
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccountSecurityInfo {
  email: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  isSocialOnly?: boolean;
}
