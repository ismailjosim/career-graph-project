"use client";

import {
  AccountSecurityCard,
  ChangePasswordCard,
  SettingsHeader,
  UpdateProfileCard,
} from "@/components/dashboard/settings";
import { UsersFeedbackBanner } from "@/components/dashboard/users";
import { useSettings } from "@/hooks";

export function SettingsClient() {
  const {
    loading,
    savingProfile,
    savingPassword,
    feedback,
    dismissFeedback,
    profileForm,
    handleProfileFieldChange,
    handleSaveProfile,
    passwordForm,
    handlePasswordFieldChange,
    handleChangePassword,
    securityInfo,
  } = useSettings();

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3 animate-fade-in">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">
          Loading account settings...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-7 animate-fade-in pb-20">
      {/* Header */}
      <SettingsHeader
        email={securityInfo.email}
        emailVerified={securityInfo.emailVerified}
      />

      {/* Feedback Banner */}
      <UsersFeedbackBanner feedback={feedback} onDismiss={dismissFeedback} />

      {/* Account Security Overview */}
      <AccountSecurityCard security={securityInfo} />

      {/* Two Column / Stack Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Left Column (2 spans): Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <UpdateProfileCard
            form={profileForm}
            onChange={handleProfileFieldChange}
            onSubmit={handleSaveProfile}
            saving={savingProfile}
          />
        </div>

        {/* Right Column (1 span): Password Change */}
        <div className="space-y-6">
          <ChangePasswordCard
            form={passwordForm}
            onChange={handlePasswordFieldChange}
            onSubmit={handleChangePassword}
            saving={savingPassword}
            isSocialOnly={securityInfo.isSocialOnly}
          />
        </div>
      </div>
    </div>
  );
}
