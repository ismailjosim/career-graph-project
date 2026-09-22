import { Mail, MapPin, Phone } from "lucide-react";
import type {
  ResumeCertificationItem,
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumePersonalInfo,
  ResumeProjectItem,
} from "../types";

export function TemplateContactList({
  personalInfo,
  accentColor: _accentColor,
}: {
  personalInfo: ResumePersonalInfo;
  accentColor?: string;
}) {
  return (
    <div className="space-y-1.5 text-xs text-slate-600">
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
          <span className="font-bold text-[10px] text-slate-400">web:</span>
          <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>
        </div>
      )}
      {personalInfo.linkedin && (
        <div className="flex items-start gap-1.5 break-all text-slate-500">
          <span className="font-bold text-[10px] text-slate-400">in/</span>
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
          <span className="font-bold text-[10px] text-slate-400">gh/</span>
          <span>
            {personalInfo.github.replace(
              /^https?:\/\/(www\.)?github\.com\//,
              "",
            )}
          </span>
        </div>
      )}
    </div>
  );
}

export function TemplateExperienceItemView({
  exp,
  accentColor,
}: {
  exp: ResumeExperienceItem;
  accentColor: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
        <span className="text-xs text-slate-500 font-medium">
          {exp.startDate} –{" "}
          {exp.isCurrent ? "Present" : exp.endDate || "Present"}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-700">
        <span className="font-semibold" style={{ color: accentColor }}>
          {exp.company}
        </span>
        {exp.location && <span className="text-slate-500">{exp.location}</span>}
      </div>
      {exp.description && (
        <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
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
  );
}

export function TemplateEducationItemView({
  edu,
  accentColor,
}: {
  edu: ResumeEducationItem;
  accentColor: string;
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex flex-wrap items-baseline justify-between">
        <h3 className="font-bold text-slate-900 text-xs">
          {edu.degree}
          {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
        </h3>
        <span className="text-[11px] text-slate-500">
          {edu.startDate} – {edu.endDate}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium" style={{ color: accentColor }}>
          {edu.institution}
        </span>
        {edu.location && (
          <span className="text-slate-500 text-[11px]">{edu.location}</span>
        )}
      </div>
      {edu.honors && (
        <p className="text-[11px] text-slate-600 italic">{edu.honors}</p>
      )}
    </div>
  );
}

export function TemplateProjectItemView({
  proj,
  accentColor,
}: {
  proj: ResumeProjectItem;
  accentColor: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <h3 className="font-bold text-slate-900 text-xs">
          {proj.title}
          {proj.role ? ` (${proj.role})` : ""}
        </h3>
        {proj.link && (
          <a
            href={proj.link}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] hover:underline"
            style={{ color: accentColor }}
          >
            Link ↗
          </a>
        )}
      </div>
      {proj.techStack && proj.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {proj.techStack.map((tech) => (
            <span
              key={tech}
              className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-100 text-slate-600"
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
  );
}

export function TemplateCertificationItemView({
  cert,
  accentColor: _accentColor,
}: {
  cert: ResumeCertificationItem;
  accentColor?: string;
}) {
  return (
    <div className="text-xs flex items-baseline justify-between">
      <div>
        <span className="font-semibold text-slate-800">{cert.name}</span>
        <span className="text-slate-500"> — {cert.issuer}</span>
      </div>
      {cert.date && (
        <span className="text-[11px] text-slate-400 font-mono shrink-0">
          {cert.date}
        </span>
      )}
    </div>
  );
}
