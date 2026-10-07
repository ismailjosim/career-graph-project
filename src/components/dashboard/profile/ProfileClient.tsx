"use client";

import {
  EditProfileForm,
  ProfileCoverLettersCard,
  ProfileError,
  ProfileHeader,
  ProfileLoading,
  ProfileOverviewCard,
  ProfileProgressCard,
  ProfileResumesCard,
  ProfileReviewCard,
  ProfileStatsGrid,
} from "@/components/dashboard/profile";
import { UsersFeedbackBanner } from "@/components/dashboard/users";
import { useProfile } from "@/hooks";
import type { ProfileData } from "./types";

interface ProfileClientProps {
  initialData?: ProfileData | null;
}

export function ProfileClient({ initialData }: ProfileClientProps) {
  const {
    data,
    loading,
    saving,
    error,
    isEditing,
    setIsEditing,
    toggleEditing,
    feedback,
    dismissFeedback,
    formData,
    handleFormFieldChange,
    handleSaveProfile,
    handleAdminStatusChange,
    handleAdminVerifyToggle,
    isViewingOtherUser,
    currentOperatorRole,
    refreshProfile,
  } = useProfile(initialData);

  if (loading && !data) {
    return <ProfileLoading />;
  }

  if (error || !data) {
    return <ProfileError error={error} />;
  }

  const { user, stats, resumes, coverLetters } = data;

  return (
    <div className="w-full space-y-7 animate-fade-in pb-20">
      {/* Top Header & Identity Card */}
      <ProfileHeader
        user={user}
        isViewingOtherUser={isViewingOtherUser}
        isEditing={isEditing}
        onToggleEdit={toggleEditing}
        currentOperatorRole={currentOperatorRole}
        onAdminStatusChange={handleAdminStatusChange}
        onAdminVerifyToggle={handleAdminVerifyToggle}
        onAvatarUpdated={refreshProfile}
      />

      {/* Action Feedback Banner */}
      <UsersFeedbackBanner feedback={feedback} onDismiss={dismissFeedback} />

      {/* Profile Completion & Readiness Progress (Issue #5) */}
      {!isViewingOtherUser && (
        <ProfileProgressCard
          data={data}
          onStartEditing={() => setIsEditing(true)}
          isEditing={isEditing}
        />
      )}

      {/* Metrics Summary Grid */}
      <ProfileStatsGrid stats={stats} />

      {/* Edit Profile Form */}
      {isEditing && (
        <EditProfileForm
          formData={formData}
          onChange={handleFormFieldChange}
          onSubmit={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
          saving={saving}
        />
      )}

      {/* Main Details & Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Left Column: Profile Pitch, Unified Skills & Background */}
        <div className="space-y-6">
          <ProfileOverviewCard user={user} />
          {!isViewingOtherUser && <ProfileReviewCard />}
        </div>

        {/* Right Column: Uploaded Resumes & Cover Letters */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileResumesCard
            resumes={resumes}
            isViewingOtherUser={isViewingOtherUser}
            onResumesUpdated={refreshProfile}
          />
          <ProfileCoverLettersCard
            coverLetters={coverLetters}
            isViewingOtherUser={isViewingOtherUser}
          />
        </div>
      </div>
    </div>
  );
}
