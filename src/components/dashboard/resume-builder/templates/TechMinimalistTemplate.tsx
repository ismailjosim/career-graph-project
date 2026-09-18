import { ExternalLink, Globe, Mail, MapPin, Phone } from "lucide-react";
import type { ResumeBuilderData, ResumeThemeConfig } from "../types";

interface TemplateProps {
  data: ResumeBuilderData;
  themeConfig: ResumeThemeConfig;
}

export function TechMinimalistTemplate({ data, themeConfig }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experiences,
    educations,
    skillGroups,
    projects,
    certifications,
  } = data;
  const accent = themeConfig.accentColor || "#059669";

  return (
    <div className="w-full text-slate-800 text-[9.5pt] leading-normal font-sans">
      {/* Top Bar with Terminal/Tech aesthetic */}
      <header className="pb-3 mb-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono">
              <span style={{ color: accent }}>&gt; </span>
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            {personalInfo.headline && (
              <p className="text-xs font-semibold text-slate-600 mt-0.5 font-mono">
                {"// "}
                {personalInfo.headline}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-mono">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{personalInfo.location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Web & Github links */}
        {(personalInfo.github ||
          personalInfo.website ||
          personalInfo.linkedin) && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono mt-1.5 pt-1.5 border-t border-slate-100">
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <span className="font-bold text-[10px] text-slate-700">
                  gh/
                </span>
                <span>{personalInfo.github.replace(/^https?:\/\//, "")}</span>
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-700" />
                <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <span className="font-bold text-[10px] text-slate-700">
                  in/
                </span>
                <span>
                  {personalInfo.linkedin.replace(
                    /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                    "",
                  )}
                </span>
              </span>
            )}
          </div>
        )}
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-4">
          <div className="flex items-center gap-1.5 mb-1 text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
            <span style={{ color: accent }}>#</span>
            <span>About</span>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Tech Skills Categorized Chips */}
      {skillGroups && skillGroups.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
            <span style={{ color: accent }}>#</span>
            <span>Technical Skills</span>
          </div>

          <div className="space-y-1.5">
            {skillGroups.map((group) => (
              <div
                key={group.category}
                className="flex flex-wrap items-center gap-1.5"
              >
                <span className="text-[11px] font-bold text-slate-700 font-mono min-w-32">
                  {group.category}:
                </span>
                <div className="flex flex-wrap gap-1">
                  {group.skills.map((skill) => (
                    <span
                      key={`${group.category}-${skill}`}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-mono border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
            <span style={{ color: accent }}>#</span>
            <span>Work Experience</span>
          </div>

          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{exp.role}</span>
                    <span className="text-slate-600 font-medium">
                      {" "}
                      @ {exp.company}
                    </span>
                    {exp.location && (
                      <span className="text-slate-400 text-xs font-mono">
                        {" "}
                        [{exp.location}]
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-500 shrink-0 ml-2">
                    {exp.startDate} –{" "}
                    {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                  </div>
                </div>

                {exp.description && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    {exp.description}
                  </p>
                )}

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700 text-xs">
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
        <section className="mb-4">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
            <span style={{ color: accent }}>#</span>
            <span>Featured Open Source & Projects</span>
          </div>

          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-2 rounded bg-slate-50/70 border border-slate-200/80"
              >
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs font-mono">
                      {proj.title}
                    </span>
                    {proj.role && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({proj.role})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    {proj.github && (
                      <span className="text-slate-600 flex items-center gap-0.5">
                        <span className="font-bold text-[9px] text-slate-500">
                          gh/
                        </span>
                        <span>{proj.github.replace(/^https?:\/\//, "")}</span>
                      </span>
                    )}
                    {proj.link && (
                      <span
                        style={{ color: accent }}
                        className="flex items-center gap-0.5 font-bold"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>Live</span>
                      </span>
                    )}
                  </div>
                </div>

                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.techStack.map((tech) => (
                      <span
                        key={`${proj.id}-${tech}`}
                        className="text-[9.5px] px-1 py-0.2 bg-white text-slate-600 rounded border border-slate-200 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {proj.description && (
                  <p className="text-xs text-slate-700 mt-1">
                    {proj.description}
                  </p>
                )}

                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-slate-700 text-xs">
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

      {/* Education & Certs row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {educations && educations.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
              <span style={{ color: accent }}>#</span>
              <span>Education</span>
            </div>
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">
                  {edu.institution} ({edu.startDate || ""} - {edu.endDate || ""}
                  )
                </div>
                {edu.honors && (
                  <div className="text-slate-500 text-[10.5px]">
                    {edu.honors}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {certifications && certifications.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
              <span style={{ color: accent }}>#</span>
              <span>Certifications</span>
            </div>
            <div className="space-y-1 text-xs">
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-slate-500 font-mono text-[10.5px]">
                    {c.issuer} {c.date ? `(${c.date})` : ""}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
