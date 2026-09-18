"use client";

import {
  Award,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronUp,
  FolderGit2,
  GraduationCap,
  Plus,
  Sparkles,
  Trash2,
  User,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTokens } from "@/context/tokens-context";
import { generateId } from "./resumeBuilder.utils";
import type {
  ResumeBuilderData,
  ResumeCertificationItem,
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumePersonalInfo,
  ResumeProjectItem,
  ResumeSkillGroup,
} from "./types";

interface ResumeFormEditorProps {
  data: ResumeBuilderData;
  onChange: (data: ResumeBuilderData) => void;
}

export function ResumeFormEditor({ data, onChange }: ResumeFormEditorProps) {
  const { updateTokensLocally } = useTokens();

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

  // AI Polish state
  const [isPolishing, setIsPolishing] = useState(false);

  // Update helper
  const updatePersonalInfo = (fields: Partial<ResumePersonalInfo>) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, ...fields },
    });
  };

  const handleAiPolishSummary = async () => {
    if (!data.summary || !data.summary.trim()) {
      toast.error(
        "Please write a draft summary before asking AI to enhance it.",
      );
      return;
    }

    setIsPolishing(true);
    try {
      const res = await fetch("/api/ai/resume-polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "summary",
          text: data.summary,
          role: data.personalInfo.headline,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to enhance summary");
      }

      onChange({
        ...data,
        summary: resData.enhancedText,
      });

      if (typeof resData.newBalance === "number") {
        updateTokensLocally(resData.newBalance);
      }

      toast.success("Summary enhanced with AI! (15 Tokens used)");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI enhancement failed");
    } finally {
      setIsPolishing(false);
    }
  };

  const handleAiPolishBullets = async (expId: string) => {
    const exp = data.experiences.find((e) => e.id === expId);
    if (!exp) return;

    const rawText =
      exp.highlights.length > 0 ? exp.highlights.join("\n") : exp.description;
    if (!rawText || !rawText.trim()) {
      toast.error(
        "Please provide bullet points or a role description for AI to rewrite.",
      );
      return;
    }

    setIsPolishing(true);
    try {
      const res = await fetch("/api/ai/resume-polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bullet",
          text: rawText,
          role: exp.role,
          company: exp.company,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to rewrite bullets");
      }

      // Parse bullet points from response lines
      const parsedBullets = resData.enhancedText
        .split("\n")
        .map((line: string) => line.replace(/^[•\-*]\s*/, "").trim())
        .filter(Boolean);

      const updatedExp = data.experiences.map((e) =>
        e.id === expId ? { ...e, highlights: parsedBullets } : e,
      );

      onChange({
        ...data,
        experiences: updatedExp,
      });

      if (typeof resData.newBalance === "number") {
        updateTokensLocally(resData.newBalance);
      }

      toast.success(
        "Experience bullet points rewritten with AI! (10 Tokens used)",
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "AI bullet polish failed",
      );
    } finally {
      setIsPolishing(false);
    }
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: ResumeExperienceItem = {
      id: generateId(),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      highlights: [""],
    };
    onChange({
      ...data,
      experiences: [newExp, ...data.experiences],
    });
    setOpenSections((prev) => ({ ...prev, experience: true }));
  };

  const updateExperience = (
    id: string,
    fields: Partial<ResumeExperienceItem>,
  ) => {
    onChange({
      ...data,
      experiences: data.experiences.map((e) =>
        e.id === id ? { ...e, ...fields } : e,
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experiences: data.experiences.filter((e) => e.id !== id),
    });
  };

  const addHighlightToExperience = (expId: string) => {
    onChange({
      ...data,
      experiences: data.experiences.map((e) =>
        e.id === expId ? { ...e, highlights: [...e.highlights, ""] } : e,
      ),
    });
  };

  const updateHighlight = (expId: string, idx: number, val: string) => {
    onChange({
      ...data,
      experiences: data.experiences.map((e) => {
        if (e.id !== expId) return e;
        const newHighlights = [...e.highlights];
        newHighlights[idx] = val;
        return { ...e, highlights: newHighlights };
      }),
    });
  };

  const removeHighlight = (expId: string, idx: number) => {
    onChange({
      ...data,
      experiences: data.experiences.map((e) => {
        if (e.id !== expId) return e;
        return { ...e, highlights: e.highlights.filter((_, i) => i !== idx) };
      }),
    });
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: ResumeEducationItem = {
      id: generateId(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      startDate: "",
      endDate: "",
      honors: "",
    };
    onChange({
      ...data,
      educations: [...data.educations, newEdu],
    });
    setOpenSections((prev) => ({ ...prev, education: true }));
  };

  const updateEducation = (
    id: string,
    fields: Partial<ResumeEducationItem>,
  ) => {
    onChange({
      ...data,
      educations: data.educations.map((e) =>
        e.id === id ? { ...e, ...fields } : e,
      ),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      educations: data.educations.filter((e) => e.id !== id),
    });
  };

  // Skills handlers
  const addSkillGroup = () => {
    const newGroup: ResumeSkillGroup = {
      category: "Specialized Skills",
      skills: [],
    };
    onChange({
      ...data,
      skillGroups: [...data.skillGroups, newGroup],
    });
  };

  const updateSkillGroup = (idx: number, fields: Partial<ResumeSkillGroup>) => {
    const newGroups = [...data.skillGroups];
    newGroups[idx] = { ...newGroups[idx], ...fields };
    onChange({ ...data, skillGroups: newGroups });
  };

  const removeSkillGroup = (idx: number) => {
    onChange({
      ...data,
      skillGroups: data.skillGroups.filter((_, i) => i !== idx),
    });
  };

  // Projects handlers
  const addProject = () => {
    const newProj: ResumeProjectItem = {
      id: generateId(),
      title: "",
      role: "",
      link: "",
      github: "",
      techStack: [],
      description: "",
      highlights: [""],
    };
    onChange({
      ...data,
      projects: [...data.projects, newProj],
    });
    setOpenSections((prev) => ({ ...prev, projects: true }));
  };

  const updateProject = (id: string, fields: Partial<ResumeProjectItem>) => {
    onChange({
      ...data,
      projects: data.projects.map((p) =>
        p.id === id ? { ...p, ...fields } : p,
      ),
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  };

  // Certifications handlers
  const addCertification = () => {
    const newCert: ResumeCertificationItem = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
      url: "",
    };
    onChange({
      ...data,
      certifications: [...data.certifications, newCert],
    });
    setOpenSections((prev) => ({ ...prev, certifications: true }));
  };

  const updateCertification = (
    id: string,
    fields: Partial<ResumeCertificationItem>,
  ) => {
    onChange({
      ...data,
      certifications: data.certifications.map((c) =>
        c.id === id ? { ...c, ...fields } : c,
      ),
    });
  };

  const removeCertification = (id: string) => {
    onChange({
      ...data,
      certifications: data.certifications.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
      {/* SECTION 1: Personal Details */}
      <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
        <button
          type="button"
          onClick={() => toggleSection("personal")}
          className="w-full px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Personal Information</span>
          </div>
          {openSections.personal ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.personal && (
          <div className="p-5 space-y-3.5 bg-white dark:bg-slate-900">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={data.personalInfo.fullName}
                  onChange={(e) =>
                    updatePersonalInfo({ fullName: e.target.value })
                  }
                  placeholder="e.g. Alex Chen"
                  className="input-field text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Professional Title / Headline
                </label>
                <input
                  type="text"
                  value={data.personalInfo.headline}
                  onChange={(e) =>
                    updatePersonalInfo({ headline: e.target.value })
                  }
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="input-field text-sm w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) =>
                    updatePersonalInfo({ email: e.target.value })
                  }
                  placeholder="alex.chen@example.com"
                  className="input-field text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={data.personalInfo.phone}
                  onChange={(e) =>
                    updatePersonalInfo({ phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                  className="input-field text-sm w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location (City, State / Remote)
                </label>
                <input
                  type="text"
                  value={data.personalInfo.location}
                  onChange={(e) =>
                    updatePersonalInfo({ location: e.target.value })
                  }
                  placeholder="San Francisco, CA"
                  className="input-field text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Portfolio / Personal Website
                </label>
                <input
                  type="text"
                  value={data.personalInfo.website}
                  onChange={(e) =>
                    updatePersonalInfo({ website: e.target.value })
                  }
                  placeholder="https://alexchen.dev"
                  className="input-field text-sm w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  LinkedIn Profile URL or Handle
                </label>
                <input
                  type="text"
                  value={data.personalInfo.linkedin}
                  onChange={(e) =>
                    updatePersonalInfo({ linkedin: e.target.value })
                  }
                  placeholder="linkedin.com/in/alexchen"
                  className="input-field text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Profile URL or Handle
                </label>
                <input
                  type="text"
                  value={data.personalInfo.github}
                  onChange={(e) =>
                    updatePersonalInfo({ github: e.target.value })
                  }
                  placeholder="github.com/alexchen"
                  className="input-field text-sm w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Professional Summary */}
      <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
          <button
            type="button"
            onClick={() => toggleSection("summary")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Professional Summary</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAiPolishSummary}
              disabled={isPolishing}
              className="text-xs px-2.5 py-1 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
              title="Enhance summary with AI (15 Tokens)"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>AI Polish (15🪙)</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSection("summary")}
              className="p-1 cursor-pointer text-slate-400"
            >
              {openSections.summary ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {openSections.summary && (
          <div className="p-5 bg-white dark:bg-slate-900">
            <textarea
              rows={4}
              value={data.summary}
              onChange={(e) => onChange({ ...data, summary: e.target.value })}
              placeholder="Provide a concise 3-4 sentence summary highlighting your core expertise, quantified accomplishments, and career focus..."
              className="input-field text-sm w-full leading-relaxed"
            />
          </div>
        )}
      </div>

      {/* SECTION 3: Work Experience */}
      <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
          <button
            type="button"
            onClick={() => toggleSection("experience")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Work Experience ({data.experiences.length})</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addExperience}
              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSection("experience")}
              className="p-1 cursor-pointer text-slate-400"
            >
              {openSections.experience ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {openSections.experience && (
          <div className="p-5 space-y-5 bg-white dark:bg-slate-900">
            {data.experiences.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No work experience added yet. Click &quot;Add Role&quot; above
                to list your career history.
              </div>
            ) : (
              data.experiences.map((exp, expIdx) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3 relative group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Role #{data.experiences.length - expIdx}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAiPolishBullets(exp.id)}
                        disabled={isPolishing}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold flex items-center gap-1 cursor-pointer hover:opacity-90 disabled:opacity-50"
                        title="Rewrite bullet points using Google XYZ formula (10 Tokens)"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>AI Bullets (10🪙)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                        title="Remove role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Job Title / Role *
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) =>
                          updateExperience(exp.id, { role: e.target.value })
                        }
                        placeholder="Lead Full-Stack Engineer"
                        className="input-field text-sm w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, { company: e.target.value })
                        }
                        placeholder="Acme Corp"
                        className="input-field text-sm w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location || ""}
                        onChange={(e) =>
                          updateExperience(exp.id, { location: e.target.value })
                        }
                        placeholder="San Francisco, CA"
                        className="input-field text-sm w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            startDate: e.target.value,
                          })
                        }
                        placeholder="Jan 2022"
                        className="input-field text-sm w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        End Date
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={exp.isCurrent ? "Present" : exp.endDate || ""}
                          disabled={exp.isCurrent}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              endDate: e.target.value,
                            })
                          }
                          placeholder="Dec 2024"
                          className="input-field text-sm w-full disabled:opacity-60"
                        />
                        <label className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.isCurrent}
                            onChange={(e) =>
                              updateExperience(exp.id, {
                                isCurrent: e.target.checked,
                                endDate: e.target.checked ? "Present" : "",
                              })
                            }
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          Current
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Bullet Points Highlights */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Key Accomplishments & Bullet Points
                      </label>
                      <button
                        type="button"
                        onClick={() => addHighlightToExperience(exp.id)}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {exp.highlights.map((bullet, bIdx) => (
                      <div
                        key={`exp-highlight-${exp.id}-${bIdx}`}
                        className="flex items-start gap-2"
                      >
                        <span className="text-slate-400 text-xs mt-2">•</span>
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) =>
                            updateHighlight(exp.id, bIdx, e.target.value)
                          }
                          placeholder="Action verb + Context + Metric (e.g., Architected microservices pipeline reducing latency by 40%)..."
                          className="input-field text-xs w-full leading-relaxed"
                        />
                        <button
                          type="button"
                          onClick={() => removeHighlight(exp.id, bIdx)}
                          className="text-slate-400 hover:text-rose-500 p-1 mt-1 transition-colors cursor-pointer"
                          title="Remove bullet"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* SECTION 4: Skills & Competencies */}
      <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
          <button
            type="button"
            onClick={() => toggleSection("skills")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Skills & Tech Stack ({data.skillGroups.length} Groups)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addSkillGroup}
              className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1 cursor-pointer hover:bg-purple-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSection("skills")}
              className="p-1 cursor-pointer text-slate-400"
            >
              {openSections.skills ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {openSections.skills && (
          <div className="p-5 space-y-4 bg-white dark:bg-slate-900">
            {data.skillGroups.map((group, gIdx) => (
              <div
                key={`skillgroup-${group.category}-${gIdx}`}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-2"
              >
                <div className="flex justify-between items-center gap-2">
                  <input
                    type="text"
                    value={group.category}
                    onChange={(e) =>
                      updateSkillGroup(gIdx, { category: e.target.value })
                    }
                    placeholder="Category (e.g. Core Languages, Cloud Platforms)"
                    className="font-bold text-xs text-slate-800 dark:text-slate-200 bg-transparent border-b border-slate-300 dark:border-slate-700 px-1 py-0.5 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkillGroup(gIdx)}
                    className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    title="Remove group"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    value={group.skills.join(", ")}
                    onChange={(e) =>
                      updateSkillGroup(gIdx, {
                        skills: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Enter skills separated by commas (e.g., React, TypeScript, Node.js, AWS)"
                    className="input-field text-xs w-full"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Separate skills with commas. They will automatically format
                    as pills or badges.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 5: Education */}
      <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
          <button
            type="button"
            onClick={() => toggleSection("education")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Education ({data.educations.length})</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addEducation}
              className="text-xs px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer hover:bg-cyan-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSection("education")}
              className="p-1 cursor-pointer text-slate-400"
            >
              {openSections.education ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {openSections.education && (
          <div className="p-5 space-y-4 bg-white dark:bg-slate-900">
            {data.educations.map((edu) => (
              <div
                key={edu.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3 relative"
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    title="Remove education"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Degree *
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, { degree: e.target.value })
                      }
                      placeholder="Bachelor of Science"
                      className="input-field text-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy || ""}
                      onChange={(e) =>
                        updateEducation(edu.id, {
                          fieldOfStudy: e.target.value,
                        })
                      }
                      placeholder="Computer Science"
                      className="input-field text-sm w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Institution / University *
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(edu.id, { institution: e.target.value })
                      }
                      placeholder="Stanford University"
                      className="input-field text-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Dates / Graduation Year
                    </label>
                    <input
                      type="text"
                      value={edu.endDate || ""}
                      onChange={(e) =>
                        updateEducation(edu.id, { endDate: e.target.value })
                      }
                      placeholder="2018 – 2022"
                      className="input-field text-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Honors / GPA
                    </label>
                    <input
                      type="text"
                      value={edu.honors || ""}
                      onChange={(e) =>
                        updateEducation(edu.id, { honors: e.target.value })
                      }
                      placeholder="3.9 GPA / Summa Cum Laude"
                      className="input-field text-sm w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 6: Key Projects */}
      <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
          <button
            type="button"
            onClick={() => toggleSection("projects")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <FolderGit2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Projects & Open Source ({data.projects.length})</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addProject}
              className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1 cursor-pointer hover:bg-amber-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSection("projects")}
              className="p-1 cursor-pointer text-slate-400"
            >
              {openSections.projects ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {openSections.projects && (
          <div className="p-5 space-y-4 bg-white dark:bg-slate-900">
            {data.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3 relative"
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeProject(proj.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    title="Remove project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) =>
                        updateProject(proj.id, { title: e.target.value })
                      }
                      placeholder="Distributed Analytics Engine"
                      className="input-field text-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Role / Contribution
                    </label>
                    <input
                      type="text"
                      value={proj.role || ""}
                      onChange={(e) =>
                        updateProject(proj.id, { role: e.target.value })
                      }
                      placeholder="Sole Creator / Lead"
                      className="input-field text-sm w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Live URL / Demo Link
                    </label>
                    <input
                      type="text"
                      value={proj.link || ""}
                      onChange={(e) =>
                        updateProject(proj.id, { link: e.target.value })
                      }
                      placeholder="https://projectdemo.com"
                      className="input-field text-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      GitHub Repository Link
                    </label>
                    <input
                      type="text"
                      value={proj.github || ""}
                      onChange={(e) =>
                        updateProject(proj.id, { github: e.target.value })
                      }
                      placeholder="github.com/user/project"
                      className="input-field text-sm w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={proj.techStack.join(", ")}
                    onChange={(e) =>
                      updateProject(proj.id, {
                        techStack: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Next.js, TypeScript, ClickHouse, Docker"
                    className="input-field text-sm w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Description
                  </label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) =>
                      updateProject(proj.id, { description: e.target.value })
                    }
                    placeholder="Key impact, architecture highlights, or metrics..."
                    className="input-field text-xs w-full leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 7: Certifications */}
      <div className="card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
          <button
            type="button"
            onClick={() => toggleSection("certifications")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <Award className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>
              Certifications & Accreditations ({data.certifications.length})
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addCertification}
              className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certificate</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSection("certifications")}
              className="p-1 cursor-pointer text-slate-400"
            >
              {openSections.certifications ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {openSections.certifications && (
          <div className="p-5 space-y-3 bg-white dark:bg-slate-900">
            {data.certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-center justify-between gap-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) =>
                      updateCertification(cert.id, { name: e.target.value })
                    }
                    placeholder="Certificate Name (e.g. AWS Solutions Architect)"
                    className="input-field text-xs"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) =>
                      updateCertification(cert.id, { issuer: e.target.value })
                    }
                    placeholder="Issuing Organization"
                    className="input-field text-xs"
                  />
                  <input
                    type="text"
                    value={cert.date || ""}
                    onChange={(e) =>
                      updateCertification(cert.id, { date: e.target.value })
                    }
                    placeholder="Year / Valid Date"
                    className="input-field text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCertification(cert.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  title="Remove certificate"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
