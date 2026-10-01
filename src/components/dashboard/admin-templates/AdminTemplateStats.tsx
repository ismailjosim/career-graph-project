"use client";

import { Check, Coins, FileText, Sparkles } from "lucide-react";

export interface StatsSummary {
  total: number;
  active: number;
  pro: number;
  free: number;
}

interface AdminTemplateStatsProps {
  stats: StatsSummary;
}

export function AdminTemplateStats({ stats }: AdminTemplateStatsProps) {
  const statCards = [
    {
      title: "Total Templates",
      value: stats.total,
      icon: FileText,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/50",
      border: "border-indigo-100 dark:border-indigo-900/50",
    },
    {
      title: "Active / Published",
      value: stats.active,
      icon: Check,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      border: "border-emerald-100 dark:border-emerald-900/50",
    },
    {
      title: "Pro (Token Gated)",
      value: stats.pro,
      icon: Coins,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/50",
      border: "border-amber-100 dark:border-amber-900/50",
    },
    {
      title: "Free Tier",
      value: stats.free,
      icon: Sparkles,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-950/50",
      border: "border-sky-100 dark:border-sky-900/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border ${card.border} shadow-xs flex items-center gap-4`}
          >
            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 font-space-grotesk">
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
