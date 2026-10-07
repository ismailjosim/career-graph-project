"use client";

import {
  Briefcase,
  CheckCircle2,
  Circle,
  FileText,
  Pencil,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import type { ProfileData } from "./types";

interface ProfileProgressCardProps {
  data: ProfileData;
  onStartEditing: () => void;
  isEditing: boolean;
}

interface StepMilestone {
  id: string;
  label: string;
  completed: boolean;
  weight: number;
  icon: typeof User;
  detail: string;
}

export function ProfileProgressCard({
  data,
  onStartEditing,
  isEditing,
}: ProfileProgressCardProps) {
  const { user, stats } = data;

  // Calculate milestones
  const hasBasicInfo = Boolean(
    user.name?.trim() && user.headline?.trim() && user.location?.trim(),
  );
  const hasBio = Boolean(user.bio?.trim() && user.bio.trim().length >= 30);

  const skillsCount = Array.isArray(user.skills)
    ? user.skills.length
    : typeof user.skills === "string" && user.skills.trim().length > 0
      ? user.skills.split(",").length
      : 0;
  const hasSkills = skillsCount >= 3;

  const hasExperienceOrEdu = Boolean(
    (user.experience && user.experience.trim().length > 0) ||
      (Array.isArray(user.education) && user.education.length > 0),
  );

  const hasResume = stats.totalResumes > 0;

  const milestones: StepMilestone[] = [
    {
      id: "basics",
      label: "Basic Details & Headline",
      completed: hasBasicInfo,
      weight: 20,
      icon: User,
      detail: hasBasicInfo
        ? "Name, headline & location added"
        : "Add headline & location",
    },
    {
      id: "summary",
      label: "Professional Pitch",
      completed: hasBio,
      weight: 20,
      icon: FileText,
      detail: hasBio
        ? "Cover letter summary ready"
        : "Write your elevator pitch",
    },
    {
      id: "skills",
      label: "Core & Technical Skills",
      completed: hasSkills,
      weight: 25,
      icon: Wrench,
      detail: hasSkills
        ? `${skillsCount} skills mapped`
        : "Add at least 3 skills",
    },
    {
      id: "experience",
      label: "Experience & Education",
      completed: hasExperienceOrEdu,
      weight: 20,
      icon: Briefcase,
      detail: hasExperienceOrEdu
        ? "Career timeline documented"
        : "Select experience bracket",
    },
    {
      id: "resume",
      label: "Target Resume Attached",
      completed: hasResume,
      weight: 15,
      icon: FileText,
      detail: hasResume
        ? `${stats.totalResumes} resume(s) uploaded`
        : "Upload a PDF resume",
    },
  ];

  const totalScore = milestones.reduce(
    (acc, m) => acc + (m.completed ? m.weight : 0),
    0,
  );

  const getTier = (score: number) => {
    if (score === 100)
      return {
        label: "All-Star Profile",
        color: "text-emerald-600 dark:text-emerald-400",
        badgeBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      };
    if (score >= 70)
      return {
        label: "Strong Matching Profile",
        color: "text-indigo-600 dark:text-indigo-400",
        badgeBg: "bg-indigo-500/15 border-indigo-500/30 text-indigo-400",
      };
    if (score >= 40)
      return {
        label: "Intermediate Profile",
        color: "text-blue-600 dark:text-blue-400",
        badgeBg: "bg-blue-500/15 border-blue-500/30 text-blue-400",
      };
    return {
      label: "Getting Started",
      color: "text-amber-600 dark:text-amber-400",
      badgeBg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
    };
  };

  const tier = getTier(totalScore);

  return (
    <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
      {/* Header and Progress Percentage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Profile Strength & Readiness
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${tier.badgeBg}`}
            >
              {tier.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Higher completion unlocks higher AI match accuracy and automated
            daily recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {totalScore}%
            </span>
            <span className="text-xs text-slate-400 block -mt-1 font-medium">
              Completed
            </span>
          </div>

          {!isEditing && totalScore < 100 && (
            <button
              type="button"
              onClick={onStartEditing}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Complete Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Modern Gradient Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${totalScore}%` }}
        />
      </div>

      {/* Step Breakdown Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
        {milestones.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                m.completed
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <Icon
                  className={`w-3.5 h-3.5 ${m.completed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}
                />
                {m.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
              </div>
              <p className="font-semibold truncate text-[11px]">{m.label}</p>
              <p className="text-[10px] opacity-80 truncate mt-0.5">
                {m.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
