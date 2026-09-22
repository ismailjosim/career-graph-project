"use client";

import { Check, ShieldCheck, Zap } from "lucide-react";
import { featureCosts } from "./pricing.data";

export function PricingFeatureCosts() {
  return (
    <div className="mt-16 max-w-5xl mx-auto rounded-3xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Transparent Token Unit Costs
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Exact token consumption per feature. 1 Token = $0.01 (1 cent). No
          surprises.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureCosts.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.name}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-start gap-3.5"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${feat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {feat.name}
                  </h4>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      🪙 {feat.cost}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {feat.dollar}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {feat.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guarantee Badges */}
      <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Tokens never expire (Lifetime validity)
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="w-4 h-4 text-blue-500" />
          Zero automatic renewals or hidden fees
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          Instant credit delivery to your balance
        </span>
      </div>
    </div>
  );
}
