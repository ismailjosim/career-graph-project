import { Briefcase, CheckCircle, Clock, XCircle } from "lucide-react";
import { StatCard } from "./StatCard";
import type { DashboardStatsGridProps } from "./types";

export function DashboardStatsGrid({ metrics }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Total Applications"
        value={metrics.total}
        icon={Briefcase}
        color="bg-linear-to-br from-blue-600 to-indigo-600"
        trend={metrics.trends.total}
      />
      <StatCard
        title="Positive Responses"
        value={metrics.positiveResponses}
        icon={CheckCircle}
        color="bg-linear-to-br from-emerald-500 to-teal-600"
        trend={metrics.trends.responses}
      />
      <StatCard
        title="Rejections"
        value={metrics.rejections}
        icon={XCircle}
        color="bg-linear-to-br from-rose-500 to-red-600"
        trend={metrics.trends.rejections}
      />
      <StatCard
        title="Interviews"
        value={metrics.interviews}
        icon={Clock}
        color="bg-linear-to-br from-amber-500 to-orange-600"
        trend={metrics.trends.interviews}
      />
    </div>
  );
}
