import type { CoverLetter } from "@/lib/validation";

export type { CoverLetter };

export interface GenerateCoverLetterInput {
  jobTitle: string;
  company: string;
  jobDescription?: string;
  resumeId?: string;
  tone?: "professional" | "enthusiastic" | "concise" | "creative";
}
