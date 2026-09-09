import { Briefcase, Globe, GraduationCap, Link2, User } from "lucide-react";
import type { ProfileUser } from "./types";

interface ProfileOverviewCardProps {
  user: ProfileUser;
}

export function ProfileOverviewCard({ user }: ProfileOverviewCardProps) {
  const parsedSkills = Array.isArray(user.skills)
    ? user.skills
    : typeof user.skills === "string"
      ? user.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return (
    <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Professional Pitch</span>
        </h3>
      </div>

      <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        {user.bio ? (
          <p className="whitespace-pre-line">{user.bio}</p>
        ) : (
          <p className="text-slate-400 italic">
            No professional summary provided yet. Click &quot;Edit Profile
            Information&quot; to add your cover letter pitch!
          </p>
        )}
      </div>

      {parsedSkills.length > 0 && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Core Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {parsedSkills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/40"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links & Details */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
        {user.experience && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{user.experience}</span>
          </div>
        )}

        {user.education && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{user.education}</span>
          </div>
        )}

        {user.linkedin && (
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-600 shrink-0" />
            <a
              href={user.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline truncate"
            >
              {user.linkedin}
            </a>
          </div>
        )}

        {user.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
            <a
              href={user.website}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline truncate"
            >
              {user.website}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
