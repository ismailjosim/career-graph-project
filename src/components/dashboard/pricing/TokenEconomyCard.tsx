import {
  Briefcase,
  CheckCircle2,
  FileCheck,
  FileEdit,
  FileText,
  Gift,
  Link2,
  MailCheck,
  Zap,
} from "lucide-react";

export function TokenEconomyCard() {
  const items = [
    {
      title: "New Account Bonus",
      tokens: "+50 Tokens",
      badge: "Free on Registration",
      badgeColor:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      description:
        "Instantly credited upon registration to kickstart your journey.",
      icon: Gift,
      iconColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      title: "Email Verification",
      tokens: "+20 Tokens",
      badge: "One-Time Reward",
      badgeColor:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      description:
        "Verify your email with a 6-digit OTP code to unlock extra tokens.",
      icon: MailCheck,
      iconColor: "text-blue-500 bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "ATS Resume Checker",
      tokens: "10 Tokens ($0.10)",
      badge: "Per Full Audit",
      badgeColor:
        "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      description:
        "Deep AI inspection across keywords, formatting, impact & structure.",
      icon: FileCheck,
      iconColor: "text-purple-500 bg-purple-50 dark:bg-purple-950/50",
    },
    {
      title: "Job Fit Alignment",
      tokens: "10 Tokens ($0.10)",
      badge: "Per Analysis",
      badgeColor:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      description:
        "Semantic match score against job requirements with interview tips.",
      icon: Zap,
      iconColor: "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
    },
    {
      title: "AI Cover Letter Architect",
      tokens: "20 Tokens ($0.20)",
      badge: "Per Generation",
      badgeColor:
        "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      description:
        "Custom-tailored, persuasive cover letters based on your profile & role.",
      icon: FileText,
      iconColor: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
      title: "Tailored Resume Rewrite",
      tokens: "25 Tokens ($0.25)",
      badge: "Per Generation",
      badgeColor:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      description:
        "Keyword-tailored resume bullets and impact metrics aligned to a JD.",
      icon: FileEdit,
      iconColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      title: "Job Portal 1-Click Apply",
      tokens: "10 Tokens ($0.10)",
      badge: "Per Application",
      badgeColor:
        "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      description:
        "Direct verified platform submission with recruiter-matched criteria.",
      icon: Briefcase,
      iconColor: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50",
    },
    {
      title: "Job Link Extraction",
      tokens: "5 Tokens ($0.05)",
      badge: "Per URL Scrape",
      badgeColor:
        "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
      description:
        "Auto-extracts role details, salary & requirements from any job link.",
      icon: Link2,
      iconColor: "text-slate-500 bg-slate-50 dark:bg-slate-950/50",
    },
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Transparent Token Economy
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Know exactly how much each feature and reward costs or grants. 1
            Token = $0.01.
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>No hidden fees • Lifetime validity</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.iconColor}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/40">
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                  {item.tokens}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
