import {
  Award,
  Briefcase,
  Globe,
  GraduationCap,
  Link2,
  User,
  Wrench,
} from "lucide-react";
import type { EducationEntry, ProfileUser, TechnicalSkill } from "./types";

interface ProfileOverviewCardProps {
  user: ProfileUser;
}

export function ProfileOverviewCard({ user }: ProfileOverviewCardProps) {
  const parsedSkills: string[] = Array.isArray(user.skills)
    ? user.skills
    : typeof user.skills === "string"
      ? user.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const parsedTechSkills: TechnicalSkill[] = Array.isArray(user.technicalSkills)
    ? user.technicalSkills
    : typeof user.technicalSkills === "string" &&
        user.technicalSkills.trim().startsWith("[")
      ? (() => {
          try {
            return JSON.parse(user.technicalSkills);
          } catch {
            return [];
          }
        })()
      : [];

  // Combine into unified skills display
  const unifiedSkillsMap = new Map<
    string,
    { name: string; yearsOfExperience?: string; proficiency?: string }
  >();

  for (const t of parsedTechSkills) {
    if (t.name?.trim()) {
      unifiedSkillsMap.set(t.name.trim().toLowerCase(), {
        name: t.name.trim(),
        yearsOfExperience: t.yearsOfExperience
          ? String(t.yearsOfExperience)
          : undefined,
        proficiency: t.proficiency,
      });
    }
  }

  for (const s of parsedSkills) {
    if (typeof s === "string" && s.trim()) {
      const lower = s.trim().toLowerCase();
      if (!unifiedSkillsMap.has(lower)) {
        unifiedSkillsMap.set(lower, { name: s.trim() });
      }
    }
  }

  const allSkills = Array.from(unifiedSkillsMap.values());

  const parsedEducation: EducationEntry[] = Array.isArray(user.education)
    ? user.education
    : typeof user.education === "string" &&
        user.education.trim().startsWith("[")
      ? (() => {
          try {
            return JSON.parse(user.education);
          } catch {
            return [];
          }
        })()
      : typeof user.education === "string" && user.education.trim().length > 0
        ? [
            {
              institution: "",
              degree: user.education,
              fieldOfStudy: "",
              startYear: "",
              endYear: "",
              credits: "",
              grade: "",
              activities: "",
            },
          ]
        : [];

  return (
    <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Professional Pitch</span>
        </h3>
        {user.experience && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
            <Briefcase className="w-3 h-3 text-indigo-500" />
            <span>{user.experience}</span>
          </span>
        )}
      </div>

      {/* Bio / Summary */}
      <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        {user.bio ? (
          <p className="whitespace-pre-line">{user.bio}</p>
        ) : (
          <p className="text-slate-400 italic">
            No professional summary provided yet. Click &quot;Edit Profile
            Information&quot; to add your pitch!
          </p>
        )}
      </div>

      {/* Unified Skills & Capabilities Section */}
      {allSkills.length > 0 && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-indigo-500" />
              <span>Skills & Capabilities ({allSkills.length})</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allSkills.map((s) => (
              <div
                key={s.name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs shadow-2xs"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {s.name}
                </span>
                {s.yearsOfExperience && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100/70 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {s.yearsOfExperience}
                  </span>
                )}
                {s.proficiency && (
                  <span className="text-[10px] text-slate-400 capitalize hidden sm:inline">
                    • {s.proficiency}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Credentials */}
      {parsedEducation.length > 0 && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Education & Degrees
            </span>
          </div>
          <div className="space-y-2">
            {parsedEducation.map((edu, idx) => {
              const timeline =
                edu.startYear || edu.endYear
                  ? `${edu.startYear || ""}${
                      edu.startYear && edu.endYear ? " - " : ""
                    }${edu.endYear || ""}`
                  : null;

              return (
                <div
                  key={edu.id || `edu-${idx}`}
                  className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </p>
                    {timeline && (
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {timeline}
                      </span>
                    )}
                  </div>

                  {edu.institution && (
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {edu.institution}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-0.5 flex-wrap text-[10px] text-slate-500 dark:text-slate-400">
                    {edu.grade && (
                      <span className="inline-flex items-center gap-1 font-medium bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>Grade: {edu.grade}</span>
                      </span>
                    )}
                    {edu.credits && (
                      <span className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-medium">
                        Credits: {edu.credits}
                      </span>
                    )}
                  </div>

                  {edu.activities && (
                    <p className="text-[10px] text-slate-400 italic pt-0.5">
                      {edu.activities}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Online Profiles & Links */}
      {(user.linkedin || user.website) && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
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
      )}
    </div>
  );
}
