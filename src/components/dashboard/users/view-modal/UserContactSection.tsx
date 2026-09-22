"use client";

import { MapPin, Phone, Sparkles } from "lucide-react";
import type { DashboardUser } from "@/hooks/useApi";

interface UserContactSectionProps {
  user: DashboardUser;
}

export function UserContactSection({ user }: UserContactSectionProps) {
  const userSkills = Array.isArray(user.skills)
    ? user.skills
    : typeof user.skills === "string"
      ? user.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return (
    <>
      {/* Profile Bio / Summary if available */}
      {user.bio && (
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Professional Bio & Summary
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {user.bio}
          </p>
        </div>
      )}

      {/* Key Skills Tags if available */}
      {userSkills.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Key Skills (For Cover Letters)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {userSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 font-medium"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Location Details */}
      {(user.phone || user.location) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {user.phone && (
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Phone Number
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.phone}</span>
              </p>
            </div>
          )}
          {user.location && (
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Location
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.location}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
