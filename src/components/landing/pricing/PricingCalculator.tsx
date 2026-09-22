"use client";

import { Calculator } from "lucide-react";

interface PricingCalculatorProps {
  appTarget: number;
  onSelectTarget: (target: number, plan: "starter" | "pro" | "ultra") => void;
}

export function PricingCalculator({
  appTarget,
  onSelectTarget,
}: PricingCalculatorProps) {
  return (
    <div className="max-w-3xl mx-auto mb-14 p-5 sm:p-6 rounded-3xl bg-linear-to-br from-indigo-500/5 via-blue-500/5 to-cyan-500/5 border border-indigo-500/20 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Estimate Your Needs
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How many jobs do you plan to apply for?
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
          {[
            { label: "10 Jobs", value: 10, plan: "starter" as const },
            {
              label: "25 Jobs",
              value: 25,
              plan: "pro" as const,
              tag: "Sweet Spot",
            },
            { label: "50+ Jobs", value: 50, plan: "ultra" as const },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelectTarget(item.value, item.plan)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                appTarget === item.value
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              {item.label}
              {item.tag && (
                <span className="absolute -top-2.5 right-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-500 text-white shadow-xs">
                  ★
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
        <span>
          💡 <strong>1 Complete Application Suite</strong> = 1 ATS Audit (10) + 1
          Cover Letter (20) + 1 Fit Check (10) ={" "}
          <strong>40 Tokens (~$0.35–$0.40)</strong>
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          Selected plan covers ~
          {appTarget === 10 ? "12" : appTarget === 25 ? "28" : "65"} full
          applications
        </span>
      </div>
    </div>
  );
}
