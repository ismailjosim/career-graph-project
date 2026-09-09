import { Loader2, Save, User } from "lucide-react";
import type { ProfileSettingsForm } from "./types";

interface UpdateProfileCardProps {
  form: ProfileSettingsForm;
  onChange: (field: keyof ProfileSettingsForm, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}

export function UpdateProfileCard({
  form,
  onChange,
  onSubmit,
  saving,
}: UpdateProfileCardProps) {
  return (
    <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <User className="w-5 h-5 text-indigo-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Profile Information
          </h2>
          <p className="text-xs text-slate-500">
            Used to auto-generate personalized cover letters and match ATS
            criteria.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="settings-full-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              Full Name *
            </label>
            <input
              id="settings-full-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="settings-headline"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              Target Headline / Role *
            </label>
            <input
              id="settings-headline"
              type="text"
              required
              placeholder="e.g. Senior Software Engineer"
              value={form.headline}
              onChange={(e) => onChange("headline", e.target.value)}
              className="input text-xs sm:text-sm font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="settings-phone"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              Phone Number
            </label>
            <input
              id="settings-phone"
              type="text"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="settings-location"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              Location
            </label>
            <input
              id="settings-location"
              type="text"
              placeholder="e.g. San Francisco, CA or Remote"
              value={form.location}
              onChange={(e) => onChange("location", e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="settings-bio"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
          >
            Professional Summary & Cover Letter Pitch *
          </label>
          <textarea
            id="settings-bio"
            rows={3}
            required
            placeholder="Highlight your background, core strengths, and what sets you apart..."
            value={form.bio}
            onChange={(e) => onChange("bio", e.target.value)}
            className="input text-xs sm:text-sm resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="settings-skills"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
          >
            Core Skills (Comma separated)
          </label>
          <input
            id="settings-skills"
            type="text"
            placeholder="React, TypeScript, Next.js, Node.js, Python, MongoDB"
            value={form.skills}
            onChange={(e) => onChange("skills", e.target.value)}
            className="input text-xs sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="settings-linkedin"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              LinkedIn URL
            </label>
            <input
              id="settings-linkedin"
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={form.linkedin}
              onChange={(e) => onChange("linkedin", e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="settings-website"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              Personal Website / Portfolio
            </label>
            <input
              id="settings-website"
              type="url"
              placeholder="https://myportfolio.com"
              value={form.website}
              onChange={(e) => onChange("website", e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="settings-experience"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              Years of Experience / Background
            </label>
            <input
              id="settings-experience"
              type="text"
              placeholder="e.g. 6+ years in software engineering"
              value={form.experience}
              onChange={(e) => onChange("experience", e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="settings-education"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              Education / Degree
            </label>
            <input
              id="settings-education"
              type="text"
              placeholder="e.g. B.S. in Computer Science"
              value={form.education}
              onChange={(e) => onChange("education", e.target.value)}
              className="input text-xs sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
}
