"use client";

import { ArrowLeft, Briefcase, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  calculateJobTokenCost,
  EXPERIENCE_LEVELS,
  WORKPLACE_TYPES,
} from "@/lib/validation";
import { PostJobBenefitsSection } from "./PostJobBenefitsSection";
import { PostJobRequirementsSection } from "./PostJobRequirementsSection";
import { PostJobSourceSection } from "./PostJobSourceSection";

export function PostJobForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [location, setLocation] = useState("Remote");
  const [workplaceType, setWorkplaceType] = useState<
    "remote" | "hybrid" | "onsite"
  >("remote");
  const [employmentType, setEmploymentType] = useState<
    "full-time" | "part-time" | "contract" | "internship"
  >("full-time");
  const [experienceLevel, setExperienceLevel] = useState<
    "entry" | "mid" | "senior" | "lead" | "executive"
  >("mid");
  const [salary, setSalary] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState<
    "direct" | "linkedin" | "indeed" | "glassdoor" | "other"
  >("linkedin");
  const [originalJobUrl, setOriginalJobUrl] = useState("");
  const [description, setDescription] = useState("");

  // Requirements Builder
  const [requirements, setRequirements] = useState<string[]>([
    "3+ years experience with modern web frameworks",
    "Strong proficiency with TypeScript and React",
    "Experience integrating REST or GraphQL APIs",
  ]);

  // Benefits Builder
  const [benefits, setBenefits] = useState<string[]>([
    "Competitive salary + equity",
    "Full health, dental & vision coverage",
    "Flexible remote work environment",
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live Token Cost Calculation
  const computedTokenCost = calculateJobTokenCost(requirements);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (requirements.length === 0) {
      setError("Please add at least 1 job requirement.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          company,
          companyLogo: companyLogo.trim() || undefined,
          location,
          workplaceType,
          employmentType,
          experienceLevel,
          salary: salary.trim() || undefined,
          sourcePlatform,
          originalJobUrl: originalJobUrl.trim() || undefined,
          description,
          requirements,
          benefits,
          tokenCost: computedTokenCost,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to post job");
      }

      toast.success("Job posted successfully to Career Graph Job Portal!");
      router.push(`/jobs/${data._id}`);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to post job";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-7 animate-fade-in pb-24">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Portal</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="card p-6 sm:p-8 bg-linear-to-br from-white to-blue-50/40 dark:from-slate-900 dark:to-blue-950/20 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Recruiter & Admin Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Post a Job to Career Graph
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Post roles sourced directly from LinkedIn, Indeed, Glassdoor, or your
          own company. Candidates apply using tokens calculated fairly from your
          requirements list.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Source Platform & External Link */}
        <PostJobSourceSection
          sourcePlatform={sourcePlatform}
          setSourcePlatform={setSourcePlatform}
          originalJobUrl={originalJobUrl}
          setOriginalJobUrl={setOriginalJobUrl}
        />

        {/* Basic Role Information */}
        <div className="card p-6 sm:p-7 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span>Role & Company Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="input text-sm h-10 w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, Acme Corp, OpenAI"
                className="input text-sm h-10 w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Company Logo Image URL (Optional)
              </label>
              <input
                type="url"
                value={companyLogo}
                onChange={(e) => setCompanyLogo(e.target.value)}
                placeholder="https://logo.clearbit.com/stripe.com"
                className="input text-sm h-10 w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote, San Francisco, CA"
                className="input text-sm h-10 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Workplace Type
              </label>
              <select
                value={workplaceType}
                onChange={(e) =>
                  setWorkplaceType(e.target.value as typeof workplaceType)
                }
                className="input text-sm h-10 w-full capitalize cursor-pointer"
              >
                {WORKPLACE_TYPES.map((type) => (
                  <option key={type} value={type} className="capitalize">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) =>
                  setEmploymentType(e.target.value as typeof employmentType)
                }
                className="input text-sm h-10 w-full capitalize cursor-pointer"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) =>
                  setExperienceLevel(e.target.value as typeof experienceLevel)
                }
                className="input text-sm h-10 w-full capitalize cursor-pointer"
              >
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl} className="capitalize">
                    {lvl} Level
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Salary Range (Optional)
            </label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. $130,000 - $160,000 / yr"
              className="input text-sm h-10 w-full"
            />
          </div>
        </div>

        {/* Dynamic Requirements Builder with Token Cost Calculator */}
        <PostJobRequirementsSection
          requirements={requirements}
          setRequirements={setRequirements}
          computedTokenCost={computedTokenCost}
        />

        {/* Full Job Description */}
        <div className="card p-6 sm:p-7 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Job Description <span className="text-rose-500">*</span>
          </h2>
          <textarea
            required
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide full description of the role, responsibilities, team overview, and day-to-day impact..."
            className="input p-3.5 text-sm w-full font-sans"
          />
        </div>

        {/* Benefits Builder (Optional) */}
        <PostJobBenefitsSection benefits={benefits} setBenefits={setBenefits} />

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Link
            href="/jobs"
            className="btn-secondary text-xs sm:text-sm py-2.5 px-5 cursor-pointer"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting || requirements.length === 0}
            className="btn-primary text-xs sm:text-sm py-2.5 px-7 cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Job...</span>
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4" />
                <span>Publish Job ({computedTokenCost} Tokens Fee)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
