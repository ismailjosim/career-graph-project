import { Globe, Link2 } from "lucide-react";

interface PostJobSourceSectionProps {
  sourcePlatform: "direct" | "linkedin" | "indeed" | "glassdoor" | "other";
  setSourcePlatform: (
    platform: "direct" | "linkedin" | "indeed" | "glassdoor" | "other",
  ) => void;
  originalJobUrl: string;
  setOriginalJobUrl: (url: string) => void;
}

export function PostJobSourceSection({
  sourcePlatform,
  setSourcePlatform,
  originalJobUrl,
  setOriginalJobUrl,
}: PostJobSourceSectionProps) {
  return (
    <div className="card p-6 sm:p-7 space-y-5">
      <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Link2 className="w-4 h-4 text-blue-500" />
        <span>Job Source & Platform</span>
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Source Platform <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { id: "linkedin", label: "LinkedIn" },
              { id: "indeed", label: "Indeed" },
              { id: "glassdoor", label: "Glassdoor" },
              { id: "direct", label: "Direct (Platform)" },
              { id: "other", label: "Other Platform" },
            ].map((plat) => {
              const isSelected = sourcePlatform === plat.id;
              return (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => {
                    setSourcePlatform(plat.id as typeof sourcePlatform);
                    if (
                      plat.id === "linkedin" &&
                      (!originalJobUrl || originalJobUrl.includes("indeed"))
                    ) {
                      setOriginalJobUrl("https://www.linkedin.com/jobs/view/");
                    } else if (
                      plat.id === "indeed" &&
                      (!originalJobUrl || originalJobUrl.includes("linkedin"))
                    ) {
                      setOriginalJobUrl("https://www.indeed.com/viewjob?jk=");
                    }
                  }}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/30 font-bold shadow-xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 opacity-70" />
                  <span>{plat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Original Job URL (From{" "}
            {sourcePlatform === "direct"
              ? "External Careers Site"
              : sourcePlatform}
            )
          </label>
          <div className="relative">
            <input
              type="url"
              value={originalJobUrl}
              onChange={(e) => setOriginalJobUrl(e.target.value)}
              placeholder={
                sourcePlatform === "linkedin"
                  ? "https://www.linkedin.com/jobs/view/..."
                  : sourcePlatform === "indeed"
                    ? "https://www.indeed.com/viewjob?jk=..."
                    : sourcePlatform === "glassdoor"
                      ? "https://www.glassdoor.com/job-listing/..."
                      : "https://company.com/careers/job-id"
              }
              className="input text-sm h-10 w-full pl-9"
            />
            <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Applicants can click through to view the source posting directly on{" "}
            <span className="capitalize font-semibold">{sourcePlatform}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
