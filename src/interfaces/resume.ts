import type {
  Resume,
  ResumeBuilderData,
  ResumeCertificationItem,
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumePersonalInfo,
  ResumeProjectItem,
  ResumeSkillGroup,
  ResumeTemplate,
  ResumeThemeConfig,
} from "@/lib/validation";

export type {
  Resume,
  ResumeBuilderData,
  ResumeCertificationItem,
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumePersonalInfo,
  ResumeProjectItem,
  ResumeSkillGroup,
  ResumeTemplate,
  ResumeThemeConfig,
};

export interface SavedResumeOption {
  _id: string;
  name: string;
  fileName: string;
  fileUrl?: string;
  isDefault?: boolean;
  uploadedAt?: string;
}
