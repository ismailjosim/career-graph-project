import { Loader2, Pencil, Save, X } from "lucide-react";
import type { ProfileFormData } from "./types";

interface EditProfileFormProps {
  formData: ProfileFormData;
  onChange: (field: keyof ProfileFormData, value: string) => void;
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
  return (
    <form
      onSubmit={onSubmit}
      className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-indigo-500/50 shadow-lg rounded-2xl space-y-5 animate-in fade-in"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Full Name
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

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Core Skills (Comma separated)
        </label>
        <input
          type="text"
          placeholder="React, TypeScript, Next.js, Node.js, MongoDB, Tailwind CSS"
          value={formData.skills}
          onChange={(e) => onChange("skills", e.target.value)}
          className="input text-xs sm:text-sm"
        />
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Years of Experience / Background
          </label>
          <input
            type="text"
            placeholder="e.g. 5+ years in product development"
            value={formData.experience}
            onChange={(e) => onChange("experience", e.target.value)}
            className="input text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Education / Degree
          </label>
          <input
            type="text"
            placeholder="e.g. B.S. in Computer Science"
            value={formData.education}
            onChange={(e) => onChange("education", e.target.value)}
            className="input text-xs sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
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
