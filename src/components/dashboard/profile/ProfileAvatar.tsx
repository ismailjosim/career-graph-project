"use client";

import { Camera, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadFileWithProgress } from "@/lib/upload-client";

interface ProfileAvatarProps {
  name: string;
  email: string;
  image?: string | null;
  isViewingOtherUser: boolean;
  onAvatarUpdated?: () => void;
}

export function ProfileAvatar({
  name,
  email,
  image,
  isViewingOtherUser,
  onAvatarUpdated,
}: ProfileAvatarProps) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (nameStr: string, emailStr: string) => {
    if (nameStr?.trim()) {
      const parts = nameStr.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return nameStr.slice(0, 2).toUpperCase();
    }
    return emailStr.slice(0, 2).toUpperCase();
  };

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar size exceeds 5MB limit");
      return;
    }

    setUploadingAvatar(true);
    setAvatarProgress(0);

    try {
      await uploadFileWithProgress(file, "avatar", (pct) => {
        setAvatarProgress(pct);
      });
      toast.success("Profile photo updated successfully!");
      onAvatarUpdated?.();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload photo",
      );
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) return;
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "" }),
      });
      if (!res.ok) throw new Error("Failed to remove avatar");
      toast.success("Profile photo removed.");
      onAvatarUpdated?.();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove photo",
      );
    }
  };

  return (
    <div className="relative group shrink-0">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleAvatarFileChange}
        className="hidden"
      />

      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr from-indigo-600 to-blue-600 text-white font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-md overflow-hidden relative border-2 border-white dark:border-slate-800">
        {image ? (
          // biome-ignore lint/performance/noImgElement: User avatar from Cloudinary / OAuth
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          getInitials(name, email)
        )}

        {/* Uploading Progress Overlay */}
        {uploadingAvatar && (
          <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center gap-1 z-20">
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-[10px] font-bold text-white">
              {avatarProgress}%
            </span>
          </div>
        )}

        {/* Change Photo Overlay for Owner */}
        {!isViewingOtherUser && !uploadingAvatar && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5 text-white cursor-pointer z-10"
            title="Upload profile photo"
          >
            <Camera className="w-4 h-4" />
            <span className="text-[9px] font-semibold">Change</span>
          </button>
        )}
      </div>

      {/* Remove Photo Action */}
      {!isViewingOtherUser && image && !uploadingAvatar && (
        <button
          type="button"
          onClick={handleRemoveAvatar}
          className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title="Remove photo"
        >
          <Trash2 className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}
