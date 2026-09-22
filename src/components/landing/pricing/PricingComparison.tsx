"use client";

import { CheckCircle2, X } from "lucide-react";
import { comparisons } from "./pricing.data";

export function PricingComparison() {
  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-space-grotesk">
          Career Graph vs. Legacy Resume Subscriptions
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Why job seekers are ditching $50/month recurring fees for
          Pay-As-You-Go.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm min-w-140">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
              <th className="p-4 sm:p-5 font-bold text-slate-700 dark:text-slate-300">
                Feature / Consideration
              </th>
              <th className="p-4 sm:p-5 font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30">
                Career Graph
              </th>
              <th className="p-4 sm:p-5 font-semibold text-slate-500 dark:text-slate-400">
                Jobscan / Teal / Rezi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {comparisons.map((row) => (
              <tr
                key={row.feature}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
              >
                <td className="p-4 sm:p-5 font-medium text-slate-900 dark:text-white">
                  {row.feature}
                </td>
                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-indigo-50/20 dark:bg-indigo-950/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{row.careerGraph}</span>
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{row.legacy}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
