import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { ResumeBuilderData, ResumeThemeConfig } from "../types";
import {
  TemplateCertificationItemView,
  TemplateEducationItemView,
  TemplateProjectItemView,
} from "./templateComponents";

interface TemplateProps {
  data: ResumeBuilderData;
  themeConfig: ResumeThemeConfig;
}

export function ModernCleanTemplate({ data, themeConfig }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experiences,
    educations,
    skillGroups,
    projects,
    certifications,
  } = data;
  const accent = themeConfig.accentColor || "#4f46e5";

  return (
    <div className="w-full text-slate-800 text-[9.5pt] leading-normal font-sans">
      {/* Header */}
      <header className="border-b-2 pb-4 mb-4" style={{ borderColor: accent }}>
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: accent }}
        >
          {personalInfo.fullName || "Your Full Name"}
        </h1>

        {personalInfo.headline && (
          <p className="text-sm font-semibold text-slate-600 mt-0.5 tracking-wide">
            {personalInfo.headline}
          </p>
        )}

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2.5">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{personalInfo.email}</span>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <span className="font-bold text-[10px] text-slate-500">in/</span>
              <span>
                {personalInfo.linkedin.replace(
                  /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                  "",
                )}
              </span>
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <span className="font-bold text-[10px] text-slate-500">gh/</span>
              <span>
                {personalInfo.github.replace(
                  /^https?:\/\/(www\.)?github\.com\//,
                  "",
                )}
              </span>
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-4">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b border-slate-200"
            style={{ color: accent }}
          >
            Professional Summary
          </h2>
          <p className="text-slate-700 text-justify leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5 border-b border-slate-200"
            style={{ color: accent }}
          >
            Experience
          </h2>

          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{exp.role}</span>
                    <span className="text-slate-600 font-medium">
                      {" "}
                      &bull; {exp.company}
                    </span>
                    {exp.location && (
                      <span className="text-slate-400 text-xs">
                        {" "}
                        ({exp.location})
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-slate-500 shrink-0 ml-2">
                    {exp.startDate} –{" "}
                    {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                  </div>
                </div>

                {exp.description && (
                  <p className="text-slate-600 text-xs mt-0.5 mb-1 italic">
                    {exp.description}
                  </p>
                )}

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700">
                    {exp.highlights.map((bullet, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: Resume highlight string
                      <li key={idx} className="leading-snug">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillGroups && skillGroups.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5 border-b border-slate-200"
            style={{ color: accent }}
          >
            Skills
          </h2>

          <div className="space-y-1.5">
            {skillGroups.map((group) => (
              <div key={group.category} className="flex gap-2 text-xs">
                <span className="font-bold text-slate-800 min-w-32">
                  {group.category}:
                </span>
                <span className="text-slate-700">
                  {group.skills.join(" • ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5 border-b border-slate-200"
            style={{ color: accent }}
          >
            Key Projects
          </h2>

          <div className="space-y-3">
            {projects.map((proj) => (
              <TemplateProjectItemView
                key={proj.id}
                proj={proj}
                accentColor={accent}
              />
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {educations && educations.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5 border-b border-slate-200"
            style={{ color: accent }}
          >
            Education
          </h2>

          <div className="space-y-2">
            {educations.map((edu) => (
              <TemplateEducationItemView
                key={edu.id}
                edu={edu}
                accentColor={accent}
              />
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b border-slate-200"
            style={{ color: accent }}
          >
            Certifications
          </h2>

          <div className="space-y-1">
            {certifications.map((cert) => (
              <TemplateCertificationItemView
                key={cert.id}
                cert={cert}
                accentColor={accent}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
