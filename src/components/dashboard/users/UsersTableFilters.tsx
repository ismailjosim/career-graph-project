import {
  Briefcase,
  Building2,
  Crown,
  Search,
  Shield,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import type { UserRoleFilter, UsersTableFiltersProps } from "./types";

interface RoleTab {
  id: UserRoleFilter;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLE_TABS: RoleTab[] = [
  { id: "all", label: "All Users", icon: Users },
  { id: "super_admin", label: "Super Admin", icon: Crown },
  { id: "admin", label: "Admin", icon: Shield },
  { id: "job_seeker", label: "Job Seekers", icon: Briefcase },
  { id: "recruiter", label: "Recruiters", icon: UserCheck },
  { id: "employer", label: "Employers", icon: Building2 },
];

export function UsersTableFilters({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  roleCounts,
}: UsersTableFiltersProps) {
  return (
    <div className="space-y-3.5">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email address..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10 pr-9 text-xs sm:text-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Role Filter Tabs (scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
        {ROLE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedRole === tab.id;
          const count = roleCounts[tab.id] ?? 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onRoleChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
