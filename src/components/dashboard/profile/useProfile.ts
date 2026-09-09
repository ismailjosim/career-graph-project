import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import type { UserRole, UserStatus } from "@/lib/validation";
import type { ProfileData, ProfileFormData } from "./types";

export function useProfile() {
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId");
  const isPromptingSetup =
    searchParams.get("prompt") === "complete" ||
    searchParams.get("setup") === "true";

  const { data: session } = useSession();
  const currentOperatorRole =
    ((session?.user as unknown as Record<string, unknown>)?.role as UserRole) ||
    "job_seeker";
  const currentOperatorId = session?.user?.id || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProfileData | null>(null);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<ProfileFormData>({
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

  const isViewingOtherUser = Boolean(
    targetUserId && targetUserId !== currentOperatorId,
  );

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // If viewing another user and operator is admin/super_admin
      const endpoint = isViewingOtherUser
        ? `/api/users/${targetUserId}`
        : "/api/profile";

      const res = await fetch(endpoint);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to load profile");
      }

      const resData = await res.json();
      setData(resData);

      // Initialize form fields
      const u = resData.user;
      setFormData({
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
        education: u.education || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [targetUserId, isViewingOtherUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFormFieldChange = (
    field: keyof ProfileFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const endpoint = isViewingOtherUser
        ? `/api/users/${targetUserId}`
        : "/api/profile";

      const payload = {
        name: formData.name.trim(),
        headline: formData.headline.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        website: formData.website.trim(),
        linkedin: formData.linkedin.trim(),
        experience: formData.experience.trim(),
        education: formData.education.trim(),
      };

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to update profile");
      }

      setFeedback({
        type: "success",
        message: "Profile information updated successfully!",
      });
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  // Admin status toggle on target user
  const handleAdminStatusChange = async (newStatus: UserStatus) => {
    if (!targetUserId) return;
    try {
      const res = await fetch(`/api/users/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to update status");

      const msg = `Account status updated to ${newStatus.toUpperCase()}`;
      setFeedback({
        type: "success",
        message: msg,
      });
      toast.success(msg);
      fetchProfile();
    } catch (err) {
      const errText =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error(errText);
    }
  };

  // Admin verification toggle on target user
  const handleAdminVerifyToggle = async () => {
    if (!targetUserId || !data?.user) return;
    try {
      const newStatus = !data.user.emailVerified;
      const res = await fetch(`/api/users/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailVerified: newStatus }),
      });
      const resData = await res.json();
      if (!res.ok)
        throw new Error(resData.error || "Failed to update verification");

      const msg = `User is now marked as ${newStatus ? "VERIFIED" : "UNVERIFIED"}`;
      setFeedback({
        type: "success",
        message: msg,
      });
      toast.success(msg);
      fetchProfile();
    } catch (err) {
      const errText =
        err instanceof Error ? err.message : "Failed to toggle verification";
      toast.error(errText);
    }
  };

  return {
    data,
    loading,
    saving,
    error,
    isEditing,
    setIsEditing,
    toggleEditing: () => setIsEditing((prev) => !prev),
    feedback,
    dismissFeedback: () => setFeedback(null),
    formData,
    handleFormFieldChange,
    handleSaveProfile,
    handleAdminStatusChange,
    handleAdminVerifyToggle,
    isViewingOtherUser,
    isPromptingSetup,
    currentOperatorRole,
    refreshProfile: fetchProfile,
  };
}
