import { Briefcase, Loader2, Pencil, Save, X } from "lucide-react";
import { EXPERIENCE_RANGES } from "@/lib/validation";
import { CoreSkillsSelect } from "./CoreSkillsSelect";
import { EducationFormSection } from "./EducationFormSection";
import { TechnicalSkillsSection } from "./TechnicalSkillsSection";
import type { ProfileFormData } from "./types";

interface EditProfileFormProps {
  formData: ProfileFormData;
  onChange: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K],
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
}

export function EditProfileForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  saving,
}: EditProfileFormProps) {
  // Check if current experience matches one of the preset ranges
  const isCustomExperience =
    formData.experience &&
    !EXPERIENCE_RANGES.includes(
      formData.experience as (typeof EXPERIENCE_RANGES)[number],
    );

  return (
    <form
      onSubmit={onSubmit}
      className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-indigo-500/50 shadow-lg rounded-2xl space-y-6 animate-in fade-in"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Update Profile Information
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Identity & Target Headline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="input text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Target Headline / Job Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Senior Software Engineer"
            value={formData.headline}
            onChange={(e) => onChange("headline", e.target.value)}
            className="input text-xs sm:text-sm font-medium"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Used in cover letter salutations and subject header.
          </p>
        </div>
      </div>

      {/* Contact & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="input text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. San Francisco, CA or Remote"
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            className="input text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Professional Pitch / Summary */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Professional Summary & Cover Letter Pitch *
        </label>
        <textarea
          rows={3}
          required
          placeholder="Highlight your background, core strengths, and what sets you apart. This pitch is injected into customized cover letters."
          value={formData.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          className="input text-xs sm:text-sm resize-none"
        />
      </div>

      {/* Overall Years of Experience Range */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
          <span>Total Years of Experience (Industry Range)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <select
            value={
              isCustomExperience
                ? "custom"
                : formData.experience || "0 - 1 year"
            }
            onChange={(e) => {
              if (e.target.value !== "custom") {
                onChange("experience", e.target.value);
              }
            }}
            className="input text-xs sm:text-sm cursor-pointer"
          >
            {EXPERIENCE_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
            <option value="custom">Custom / Other format...</option>
          </select>

          {isCustomExperience && (
            <input
              type="text"
              placeholder="e.g. 12+ years in distributed systems"
              value={formData.experience}
              onChange={(e) => onChange("experience", e.target.value)}
              className="input text-xs sm:text-sm"
            />
          )}
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Standardized experience brackets match recruiter filtering criteria on
          top job boards.
        </p>
      </div>

      {/* Core Skills (Powered by react-select with maximum limit) */}
      <CoreSkillsSelect
        skills={formData.skills}
        onChange={(skills) => onChange("skills", skills)}
        maxSkills={15}
      />

      {/* Technical Skills with Years of Experience */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <TechnicalSkillsSection
          skills={formData.technicalSkills}
          onChange={(skills) => onChange("technicalSkills", skills)}
        />
      </div>

      {/* Expanded Education Section */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <EducationFormSection
          education={formData.education}
          onChange={(education) => onChange("education", education)}
        />
      </div>

      {/* Online Profiles & Links */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin}
              onChange={(e) => onChange("linkedin", e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Personal Portfolio / Website
            </label>
            <input
              type="url"
              placeholder="https://myportfolio.com"
              value={formData.website}
              onChange={(e) => onChange("website", e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline py-2 px-4 text-xs cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary py-2 px-5 text-xs flex items-center gap-2 cursor-pointer"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Profile Information</span>
        </button>
      </div>
    </form>
  );
}
