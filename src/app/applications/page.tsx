"use client";

import { useState } from "react";
import Link from "next/link";
import { useJobApplications } from "@/hooks/useApi";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeft, Search, Filter, MoreVertical } from "lucide-react";

export default function ApplicationsPage() {
  const { applications, loading } = useJobApplications();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const statuses = [
    { value: "all", label: "All" },
    { value: "applied", label: "Applied" },
    { value: "interview_scheduled", label: "Interview" },
    { value: "offer_received", label: "Offers" },
    { value: "rejected", label: "Rejected" },
  ];

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "badge-primary";
      case "interview_scheduled":
      case "interviewed":
        return "badge-warning";
      case "offer_received":
        return "badge-success";
      case "rejected":
        return "badge-danger";
      default:
        return "badge-neutral";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-premium dark:bg-gradient-premium-dark">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </Link>
              <div>
                <h1 className="section-title">All Applications</h1>
                <p className="section-subtitle">
                  {filteredApplications.length} application
                  {filteredApplications.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-12"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {statuses.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setFilterStatus(status.value)}
                    className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                      filterStatus === status.value
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">
                  Loading applications...
                </p>
              </div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                No applications found. Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((app) => (
                <Link
                  key={app._id}
                  href={`/applications/${app._id}`}
                  className="card-hover p-6 group cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {app.jobTitle}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {app.company}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`badge text-xs ${getStatusColor(app.status)}`}>
                      {app.status?.replace("_", " ").toUpperCase()}
                    </span>
                    {app.fitScore && (
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {app.fitScore}% fit
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm mb-4">
                    {app.location && (
                      <p className="text-slate-600 dark:text-slate-400">
                        📍 {app.location}
                      </p>
                    )}
                    {app.salary && (
                      <p className="text-slate-600 dark:text-slate-400">
                        💰 {app.salary}
                      </p>
                    )}
                    {app.employmentType && (
                      <p className="text-slate-600 dark:text-slate-400">
                        🏢 {app.employmentType}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                      View →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
