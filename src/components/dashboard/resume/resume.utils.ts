import type { Resume } from "@/lib/validation";

/**
 * Filters resumes by search term matching in resume name or file name.
 */
export function filterResumes(resumes: Resume[], searchTerm: string): Resume[] {
  const normalized = searchTerm.trim().toLowerCase();
  if (!normalized) return resumes;

  return resumes.filter(
    (resume) =>
      resume.name.toLowerCase().includes(normalized) ||
      resume.fileName.toLowerCase().includes(normalized),
  );
}

/**
 * Formats uploadedAt date into a readable string.
 */
export function formatResumeDate(date?: Date | string): string {
  if (!date) return "Recently";
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? "Recently" : d.toLocaleDateString();
}
