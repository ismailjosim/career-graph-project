import type {
  EducationEntry,
  ProfileCoverLetter,
  ProfileData,
  ProfileFormData,
  ProfileResume,
  ProfileStats,
  ProfileUser,
  TechnicalSkill,
} from "@/interfaces";

export type {
  EducationEntry,
  ProfileCoverLetter,
  ProfileData,
  ProfileFormData,
  ProfileResume,
  ProfileStats,
  ProfileUser,
  TechnicalSkill,
};

export const POPULAR_SKILL_SUGGESTIONS = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Tailwind CSS",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "AWS",
  "GraphQL",
  "Git",
  "REST APIs",
  "Redux",
  "Linux",
  "CI/CD",
];

export const EXPERIENCE_YEAR_OPTIONS = [
  "< 1 year",
  "1 year",
  "2 years",
  "3 years",
  "4 years",
  "5 years",
  "6-7 years",
  "8-10 years",
  "10+ years",
];

export const PROFICIENCY_OPTIONS: Array<
  "beginner" | "intermediate" | "advanced" | "expert"
> = ["beginner", "intermediate", "advanced", "expert"];
