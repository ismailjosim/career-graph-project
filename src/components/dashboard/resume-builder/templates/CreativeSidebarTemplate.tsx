import { Briefcase, Sparkles } from "lucide-react";
import type { ResumeBuilderData, ResumeThemeConfig } from "../types";
import {
  TemplateContactList,
  TemplateEducationItemView,
} from "./templateComponents";

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
            <TemplateContactList
              personalInfo={personalInfo}
              accentColor={accent}
            />
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
                          className="px-1.5 py-0.5 rounded bg-white text-slate-800 text-[10px] border border-slate-200 shadow-2xs"
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

              <div className="space-y-3">
                {educations.map((edu) => (
                  <TemplateEducationItemView
                    key={edu.id}
                    edu={edu}
                    accentColor={accent}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Certifications in Sidebar */}
          {certifications && certifications.length > 0 && (
            <div className="mb-4">
              <h3
                className="text-[10px] font-bold uppercase tracking-wider pb-1 border-b border-slate-200 mb-2"
                style={{ color: accent }}
              >
                Certifications
              </h3>
              <div className="space-y-1.5">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <span className="font-semibold text-slate-800 block leading-tight">
                      {cert.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {cert.issuer} {cert.date ? `(${cert.date})` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Right Content (65% width) */}
      <main className="w-full md:w-[65%] p-5 space-y-4">
        {/* Professional Summary */}
        {summary && (
          <section className="space-y-1.5">
            <h2
              className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}30` }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Professional Summary</span>
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience Section */}
        {experiences && experiences.length > 0 && (
          <section className="space-y-2.5">
            <h2
              className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}30` }}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Work Experience</span>
            </h2>

            <div className="space-y-3.5">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {exp.role}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {exp.startDate} –{" "}
                      {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span style={{ color: accent }}>{exp.company}</span>
                    {exp.location && (
                      <span className="text-slate-400 font-normal">
                        {exp.location}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-700 mt-1">
                      {exp.highlights.map((h, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: Resume highlight string
                        <li key={i} className="leading-relaxed">
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section className="space-y-2">
            <h2
              className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}30` }}
            >
              <span>Featured Projects</span>
            </h2>

            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-0.5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-slate-900 text-xs">
                      {proj.title} {proj.role ? `(${proj.role})` : ""}
                    </h3>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] hover:underline"
                        style={{ color: accent }}
                      >
                        Live Link ↗
                      </a>
                    )}
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 my-0.5">
                      {proj.techStack.map((tech) => (
                        <span
                          key={`${proj.id}-${tech}`}
                          className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-slate-100 text-slate-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-700">
                      {proj.highlights.map((h, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: Project highlight string
                        <li key={i} className="leading-relaxed">
                          {h}
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
