import { TrendingDown, TrendingUp } from "lucide-react";
import type { StatCardProps } from "./types";

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: StatCardProps) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <div className="stat-card group hover:scale-[1.02] transition-transform">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value mt-1">{value}</p>
          {trend !== undefined && (
            <p
              className={`text-xs font-semibold mt-2 flex items-center gap-1 ${
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend > 0 ? `+${trend}%` : `${trend}%`} this month</span>
            </p>
          )}
        </div>
        <div
          className={`${color} p-3 rounded-2xl text-white shadow-md group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
