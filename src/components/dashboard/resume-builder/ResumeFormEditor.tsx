"use client";

import { useState } from "react";
import {
  CertificationsSection,
  EducationSection,
  ExperienceSection,
  PersonalSection,
  ProjectsSection,
  SkillsSection,
  SummarySection,
} from "./sections";
import type {
  ResumeBuilderData,
  ResumePersonalInfo,
} from "./types";

interface ResumeFormEditorProps {
  data: ResumeBuilderData;
  onChange: (data: ResumeBuilderData) => void;
}

export function ResumeFormEditor({ data, onChange }: ResumeFormEditorProps) {
  // Accordion active state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: true,
    education: false,
    skills: false,
    projects: false,
    certifications: false,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const updatePersonalInfo = (fields: Partial<ResumePersonalInfo>) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, ...fields },
    });
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
      {/* SECTION 1: Personal Details */}
      <PersonalSection
        personalInfo={data.personalInfo}
        onChange={updatePersonalInfo}
        isOpen={openSections.personal}
        onToggle={() => toggleSection("personal")}
      />

      {/* SECTION 2: Professional Summary */}
      <SummarySection
        summary={data.summary}
        headline={data.personalInfo.headline}
        onChange={(summary) => onChange({ ...data, summary })}
        isOpen={openSections.summary}
        onToggle={() => toggleSection("summary")}
      />

      {/* SECTION 3: Work Experience */}
      <ExperienceSection
        experiences={data.experiences}
        onChange={(experiences) => onChange({ ...data, experiences })}
        isOpen={openSections.experience}
        onToggle={() => toggleSection("experience")}
      />

      {/* SECTION 4: Skills & Tech Stack */}
      <SkillsSection
        skillGroups={data.skillGroups}
        onChange={(skillGroups) => onChange({ ...data, skillGroups })}
        isOpen={openSections.skills}
        onToggle={() => toggleSection("skills")}
      />

      {/* SECTION 5: Education */}
      <EducationSection
        educations={data.educations}
        onChange={(educations) => onChange({ ...data, educations })}
        isOpen={openSections.education}
        onToggle={() => toggleSection("education")}
      />

      {/* SECTION 6: Projects */}
      <ProjectsSection
        projects={data.projects}
        onChange={(projects) => onChange({ ...data, projects })}
        isOpen={openSections.projects}
        onToggle={() => toggleSection("projects")}
      />

      {/* SECTION 7: Certifications */}
      <CertificationsSection
        certifications={data.certifications}
        onChange={(certifications) => onChange({ ...data, certifications })}
        isOpen={openSections.certifications}
        onToggle={() => toggleSection("certifications")}
      />
    </div>
  );
}
