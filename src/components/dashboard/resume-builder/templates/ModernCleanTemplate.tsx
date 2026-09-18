import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { ResumeBuilderData, ResumeThemeConfig } from "../types";

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
                    {exp.highlights.map((bullet) => (
                      <li
                        key={`${exp.id}-${bullet.slice(0, 30)}`}
                        className="leading-snug"
                      >
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
            className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b border-slate-200"
            style={{ color: accent }}
          >
            Skills & Competencies
          </h2>

          <div className="space-y-1">
            {skillGroups.map((group) => (
              <div key={group.category} className="flex items-baseline gap-2">
                <span className="font-bold text-slate-800 text-xs min-w-36 shrink-0">
                  {group.category}:
                </span>
                <span className="text-slate-700 text-xs">
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

          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {proj.title}
                    </span>
                    {proj.role && (
                      <span className="text-xs text-slate-500">
                        ({proj.role})
                      </span>
                    )}
                  </div>
                  {proj.link && (
                    <span className="text-[10px] text-indigo-600 font-mono">
                      {proj.link.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>

                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                    Stack: {proj.techStack.join(", ")}
                  </div>
                )}

                {proj.description && (
                  <p className="text-xs text-slate-700 mt-0.5">
                    {proj.description}
                  </p>
                )}

                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700">
                    {proj.highlights.map((bullet) => (
                      <li
                        key={`${proj.id}-${bullet.slice(0, 30)}`}
                        className="leading-snug text-xs"
                      >
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

      {/* Education */}
      {educations && educations.length > 0 && (
        <section className="mb-3">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b border-slate-200"
            style={{ color: accent }}
          >
            Education
          </h2>

          <div className="space-y-2">
            {educations.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <div className="font-bold text-slate-900">
                    {edu.degree}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                  </div>
                  <div className="text-xs text-slate-600">
                    {edu.institution}
                    {edu.location ? `, ${edu.location}` : ""}
                    {edu.honors ? ` &bull; ${edu.honors}` : ""}
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-medium shrink-0 ml-2">
                  {edu.startDate ? `${edu.startDate} – ` : ""}
                  {edu.endDate || ""}
                </div>
              </div>
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
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <span className="font-semibold text-slate-900">
                  {cert.name}
                </span>
                <span className="text-slate-500">
                  {" "}
                  ({cert.issuer}
                  {cert.date ? `, ${cert.date}` : ""})
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
