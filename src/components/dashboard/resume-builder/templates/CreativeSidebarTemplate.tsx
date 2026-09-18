import {
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import type { ResumeBuilderData, ResumeThemeConfig } from "../types";

interface TemplateProps {
  data: ResumeBuilderData;
  themeConfig: ResumeThemeConfig;
}

export function CreativeSidebarTemplate({ data, themeConfig }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experiences,
    educations,
    skillGroups,
    projects,
    certifications,
  } = data;
  const accent = themeConfig.accentColor || "#2563eb";

  return (
    <div className="w-full text-slate-800 text-[9pt] leading-normal font-sans flex flex-col md:flex-row min-h-[265mm]">
      {/* Left Sidebar (35% width) */}
      <aside className="w-full md:w-[35%] bg-slate-50 p-4 border-r border-slate-200 flex flex-col justify-between">
        <div>
          {/* Header in sidebar */}
          <div className="mb-4">
            <h1
              className="text-xl font-extrabold tracking-tight"
              style={{ color: accent }}
            >
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            {personalInfo.headline && (
              <p className="text-xs font-semibold text-slate-700 mt-1">
                {personalInfo.headline}
              </p>
            )}
          </div>

          {/* Contact Details */}
          <div className="mb-5 space-y-1.5 text-xs text-slate-600">
            <h3
              className="text-[10px] font-bold uppercase tracking-wider pb-1 border-b border-slate-200 mb-2"
              style={{ color: accent }}
            >
              Contact Information
            </h3>

            {personalInfo.email && (
              <div className="flex items-start gap-1.5 break-all">
                <Mail className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-start gap-1.5 break-all text-slate-500">
                <span className="font-bold text-[10px] text-slate-400">
                  web:
                </span>
                <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-start gap-1.5 break-all text-slate-500">
                <span className="font-bold text-[10px] text-slate-400">
                  in/
                </span>
                <span>
                  {personalInfo.linkedin.replace(
                    /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                    "",
                  )}
                </span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-start gap-1.5 break-all text-slate-500">
                <span className="font-bold text-[10px] text-slate-400">
                  gh/
                </span>
                <span>
                  {personalInfo.github.replace(
                    /^https?:\/\/(www\.)?github\.com\//,
                    "",
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Skills in Sidebar */}
          {skillGroups && skillGroups.length > 0 && (
            <div className="mb-5">
              <h3
                className="text-[10px] font-bold uppercase tracking-wider pb-1 border-b border-slate-200 mb-2.5"
                style={{ color: accent }}
              >
                Core Skills
              </h3>

              <div className="space-y-2.5">
                {skillGroups.map((group) => (
                  <div key={group.category}>
                    <span className="text-[10px] font-bold text-slate-800 block mb-1">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {group.skills.map((skill) => (
                        <span
                          key={`${group.category}-${skill}`}
                          className="px-1.5 py-0.5 rounded bg-white text-slate-800 text-[10px] border border-slate-200 shadow-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {educations && educations.length > 0 && (
            <div className="mb-5">
              <h3
                className="text-[10px] font-bold uppercase tracking-wider pb-1 border-b border-slate-200 mb-2"
                style={{ color: accent }}
              >
                Education
              </h3>

              <div className="space-y-2">
                {educations.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    {edu.fieldOfStudy && (
                      <div className="text-slate-600 text-[10.5px]">
                        {edu.fieldOfStudy}
                      </div>
                    )}
                    <div className="text-slate-500 text-[10.5px]">
                      {edu.institution} ({edu.startDate || ""} -{" "}
                      {edu.endDate || ""})
                    </div>
                    {edu.honors && (
                      <div className="text-slate-500 text-[10px] italic mt-0.5">
                        {edu.honors}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications in bottom of sidebar */}
        {certifications && certifications.length > 0 && (
          <div>
            <h3
              className="text-[10px] font-bold uppercase tracking-wider pb-1 border-b border-slate-200 mb-2"
              style={{ color: accent }}
            >
              Certifications
            </h3>
            <div className="space-y-1.5 text-xs">
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="font-semibold text-slate-800 text-[11px]">
                    {c.name}
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    {c.issuer} {c.date ? `(${c.date})` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Column (65% width) */}
      <main className="w-full md:w-[65%] p-4 sm:p-5 flex-1">
        {/* Summary */}
        {summary && (
          <section className="mb-4">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
              style={{ color: accent }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Professional Profile</span>
            </h2>
            <p className="text-slate-700 text-justify leading-relaxed text-xs">
              {summary}
            </p>
          </section>
        )}

        {/* Experience Timeline */}
        {experiences && experiences.length > 0 && (
          <section className="mb-4">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
              style={{ color: accent }}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career History</span>
            </h2>

            <div
              className="space-y-3.5 border-l-2 pl-3 ml-1"
              style={{ borderColor: `${accent}33` }}
            >
              {experiences.map((exp) => (
                <div key={exp.id} className="relative">
                  {/* Timeline dot */}
                  <span
                    className="absolute -left-4.25 top-1 w-2 h-2 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: accent }}
                  />

                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-slate-900 text-xs">
                      {exp.role}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {exp.startDate} –{" "}
                      {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                    </div>
                  </div>

                  <div className="text-xs font-medium text-slate-600 mb-1">
                    {exp.company}
                    {exp.location ? `, ${exp.location}` : ""}
                  </div>

                  {exp.description && (
                    <p className="text-xs text-slate-600 mb-1 italic">
                      {exp.description}
                    </p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-slate-700 text-xs">
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

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-3">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: accent }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Key Initiatives & Projects</span>
            </h2>

            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-2 rounded-lg bg-slate-50/70 border border-slate-200/60"
                >
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">
                      {proj.title}
                    </span>
                    {proj.link && (
                      <span className="text-[10px] text-blue-600 font-mono">
                        {proj.link.replace(/^https?:\/\//, "")}
                      </span>
                    )}
                  </div>

                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                      Tech: {proj.techStack.join(", ")}
                    </div>
                  )}

                  {proj.description && (
                    <p className="text-xs text-slate-700 mt-0.5">
                      {proj.description}
                    </p>
                  )}

                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 mt-0.5 space-y-0.5 text-slate-700 text-xs">
                      {proj.highlights.map((bullet) => (
                        <li key={`${proj.id}-${bullet.slice(0, 30)}`}>
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
      </main>
    </div>
  );
}
