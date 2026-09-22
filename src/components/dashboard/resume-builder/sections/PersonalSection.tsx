"use client";

import { ChevronDown, ChevronUp, User } from "lucide-react";
import type { ResumePersonalInfo } from "../types";

interface PersonalSectionProps {
  personalInfo: ResumePersonalInfo;
  onChange: (fields: Partial<ResumePersonalInfo>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function PersonalSection({
  personalInfo,
  onChange,
  isOpen,
  onToggle,
}: PersonalSectionProps) {
  return (
    <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Personal Information</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-5 space-y-3.5 bg-white dark:bg-slate-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={personalInfo.fullName}
                onChange={(e) => onChange({ fullName: e.target.value })}
                placeholder="e.g. Alex Chen"
                className="input-field text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Professional Title / Headline
              </label>
              <input
                type="text"
                value={personalInfo.headline}
                onChange={(e) => onChange({ headline: e.target.value })}
                placeholder="e.g. Senior Full-Stack Engineer"
                className="input-field text-sm w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={personalInfo.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="alex.chen@example.com"
                className="input-field text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={personalInfo.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="input-field text-sm w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location (City, State / Remote)
              </label>
              <input
                type="text"
                value={personalInfo.location}
                onChange={(e) => onChange({ location: e.target.value })}
                placeholder="San Francisco, CA"
                className="input-field text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Portfolio / Personal Website
              </label>
              <input
                type="text"
                value={personalInfo.website}
                onChange={(e) => onChange({ website: e.target.value })}
                placeholder="https://alexchen.dev"
                className="input-field text-sm w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                LinkedIn Profile URL or Handle
              </label>
              <input
                type="text"
                value={personalInfo.linkedin}
                onChange={(e) => onChange({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/alexchen"
                className="input-field text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GitHub Profile URL or Handle
              </label>
              <input
                type="text"
                value={personalInfo.github}
                onChange={(e) => onChange({ github: e.target.value })}
                placeholder="github.com/alexchen"
                className="input-field text-sm w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
