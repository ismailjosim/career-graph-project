"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { UserRole, UserStatus } from "@/lib/validation";
import type {
  AccountSecurityInfo,
  PasswordSettingsForm,
  ProfileSettingsForm,
} from "./types";

export function useSettings() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [profileForm, setProfileForm] = useState<ProfileSettingsForm>({
    name: "",
    headline: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    website: "",
    linkedin: "",
    experience: "",
    education: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordSettingsForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [securityInfo, setSecurityInfo] = useState<AccountSecurityInfo>({
    email: "",
    emailVerified: false,
    role: "job_seeker",
    status: "active",
    isSocialOnly: false,
  });

  const fetchProfileAndAccount = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        const u = data.user;

        setProfileForm({
          name: u.name || "",
          headline: u.headline || "",
          phone: u.phone || "",
          location: u.location || "",
          bio: u.bio || "",
          skills: Array.isArray(u.skills)
            ? u.skills.join(", ")
            : typeof u.skills === "string"
              ? u.skills
              : "",
          website: u.website || "",
          linkedin: u.linkedin || "",
          experience: u.experience || "",
          education: Array.isArray(u.education)
            ? u.education
              .map((e: { degree?: string; institution?: string }) =>
                [e.degree, e.institution].filter(Boolean).join(" - "),
              )
              .join("; ")
            : typeof u.education === "string"
              ? u.education
              : "",
        });

        setSecurityInfo({
          email: u.email || "",
          emailVerified: Boolean(u.emailVerified),
          role: (u.role as UserRole) || "job_seeker",
          status: (u.status as UserStatus) || "active",
        });
      }
    } catch (err) {
      console.warn("Failed to fetch profile settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileAndAccount();
  }, [fetchProfileAndAccount]);

  const handleProfileFieldChange = (
    field: keyof ProfileSettingsForm,
    value: string,
  ) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordFieldChange = (
    field: keyof PasswordSettingsForm,
    value: string,
  ) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setFeedback(null);

    try {
      const payload = {
        name: profileForm.name.trim(),
        headline: profileForm.headline.trim(),
        phone: profileForm.phone.trim(),
        location: profileForm.location.trim(),
        bio: profileForm.bio.trim(),
        skills: profileForm.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        website: profileForm.website.trim(),
        linkedin: profileForm.linkedin.trim(),
        experience: profileForm.experience.trim(),
        education: profileForm.education.trim(),
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      const successMsg = "Profile information updated successfully!";
      setFeedback({
        type: "success",
        message: successMsg,
      });
      toast.success(successMsg);
      setTimeout(() => setFeedback(null), 4000);
      fetchProfileAndAccount();
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to save profile.";
      setFeedback({
        type: "error",
        message: errMsg,
      });
      toast.error(errMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(null as unknown as boolean);
    setFeedback(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      const msg = "New password and confirmation do not match.";
      setFeedback({
        type: "error",
        message: msg,
      });
      toast.error(msg);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      const msg = "New password must be at least 6 characters long.";
      setFeedback({
        type: "error",
        message: msg,
      });
      toast.error(msg);
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      const successMsg = "Password changed successfully!";
      setFeedback({
        type: "success",
        message: successMsg,
      });
      toast.success(successMsg);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to update password. Please check your current password.";
      setFeedback({
        type: "error",
        message: errMsg,
      });
      toast.error(errMsg);
    } finally {
      setSavingPassword(false);
    }
  };

  return {
    loading,
    savingProfile,
    savingPassword,
    feedback,
    dismissFeedback: () => setFeedback(null),
    profileForm,
    handleProfileFieldChange,
    handleSaveProfile,
    passwordForm,
    handlePasswordFieldChange,
    handleChangePassword,
    securityInfo,
  };
}
