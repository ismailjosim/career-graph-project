import type { ResumeBuilderData, ResumeThemeConfig } from "../types";

interface TemplateProps {
  data: ResumeBuilderData;
  themeConfig: ResumeThemeConfig;
}

export function ExecutiveClassicTemplate({ data, themeConfig }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experiences,
    educations,
    skillGroups,
    projects,
    certifications,
  } = data;
  const accent = themeConfig.accentColor || "#0f172a";

  const contactList = [
    personalInfo.phone,
    personalInfo.email,
    personalInfo.location,
    personalInfo.linkedin
      ? `linkedin.com/in/${personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}`
      : "",
    personalInfo.website
      ? personalInfo.website.replace(/^https?:\/\//, "")
      : "",
  ].filter(Boolean);

  return (
    <div className="w-full text-slate-900 text-[9pt] leading-normal font-serif">
      {/* Centered Traditional Header */}
      <header
        className="text-center pb-3 mb-3 border-b-2"
        style={{ borderColor: accent }}
      >
        <h1
          className="text-2xl sm:text-3xl font-bold uppercase tracking-wider font-serif"
          style={{ color: accent }}
        >
          {personalInfo.fullName || "Your Full Name"}
        </h1>

        {personalInfo.headline && (
          <p className="text-xs font-medium text-slate-700 mt-1 uppercase tracking-widest">
            {personalInfo.headline}
          </p>
        )}

        {contactList.length > 0 && (
          <p className="text-xs text-slate-600 mt-1.5 space-x-2">
            {contactList.map((contactItem, i) => (
              <span key={contactItem}>
                {contactItem}
                {i < contactList.length - 1 && (
                  <span className="text-slate-400 mx-1.5">&bull;</span>
                )}
              </span>
            ))}
          </p>
        )}
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-3">
          <h2
            className="text-[10pt] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b border-slate-300"
            style={{ color: accent }}
          >
            Executive Profile
          </h2>
          <p className="text-slate-800 text-justify leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <section className="mb-3">
          <h2
            className="text-[10pt] font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b border-slate-300"
            style={{ color: accent }}
          >
            Professional Experience
          </h2>

          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-slate-900">
                    <span>{exp.company}</span>
                    {exp.location && (
                      <span className="font-normal text-slate-600">
                        {" "}
                        — {exp.location}
                      </span>
                    )}
                  </div>
                  <div className="text-xs italic text-slate-600">
                    {exp.startDate} –{" "}
                    {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                  </div>
                </div>

                <div className="text-xs font-semibold italic text-slate-800 mb-0.5">
                  {exp.role}
                </div>

                {exp.description && (
                  <p className="text-xs text-slate-700 mb-1">
                    {exp.description}
                  </p>
                )}

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800">
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

      {/* Education */}
      {educations && educations.length > 0 && (
        <section className="mb-3">
          <h2
            className="text-[10pt] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b border-slate-300"
            style={{ color: accent }}
          >
            Education & Credentials
          </h2>

          <div className="space-y-1.5">
            {educations.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">
                    {edu.institution}
                  </span>
                  {edu.location && (
                    <span className="text-slate-600">, {edu.location}</span>
                  )}
                  <div className="text-xs text-slate-800 italic">
                    {edu.degree}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    {edu.honors ? ` (${edu.honors})` : ""}
                  </div>
                </div>
                <div className="text-xs text-slate-600 italic">
                  {edu.startDate ? `${edu.startDate} – ` : ""}
                  {edu.endDate || ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects (if any) */}
      {projects && projects.length > 0 && (
        <section className="mb-3">
          <h2
            className="text-[10pt] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b border-slate-300"
            style={{ color: accent }}
          >
            Key Initiatives & Projects
          </h2>

          <div className="space-y-1.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{proj.title}</span>
                  {proj.link && (
                    <span className="text-[9pt] italic text-slate-500">
                      {proj.link.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs text-slate-800">{proj.description}</p>
                )}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800">
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

      {/* Skills */}
      {skillGroups && skillGroups.length > 0 && (
        <section className="mb-3">
          <h2
            className="text-[10pt] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b border-slate-300"
            style={{ color: accent }}
          >
            Areas of Expertise
          </h2>

          <div className="space-y-1">
            {skillGroups.map((group) => (
              <div key={group.category} className="text-xs">
                <span className="font-bold text-slate-900">
                  {group.category}:{" "}
                </span>
                <span className="text-slate-800">
                  {group.skills.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2
            className="text-[10pt] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b border-slate-300"
            style={{ color: accent }}
          >
            Certifications & Affiliations
          </h2>
          <div className="text-xs text-slate-800">
            {certifications.map((c, i) => (
              <span key={c.id}>
                <strong>{c.name}</strong> ({c.issuer}
                {c.date ? `, ${c.date}` : ""})
                {i < certifications.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
