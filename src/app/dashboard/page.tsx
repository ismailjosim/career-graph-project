"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useJobApplications, useMonthlyStats } from "@/hooks/useApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Briefcase, CheckCircle, XCircle, Clock, X, Plus, Sun, Moon, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";

const USER_ID = "demo-user";

interface AddApplicationForm {
  jobTitle: string;
  company: string;
  description: string;
  jobLink: string;
  fitScore: string;
  notes: string;
  status: string;
  salary: string;
  location: string;
  employmentType: string;
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const { applications, loading: appLoading, createApplication, fetchApplications } = useJobApplications();
  const { stats, loading: statsLoading } = useMonthlyStats();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddApplicationForm>({
    jobTitle: "",
    company: "",
    description: "",
    jobLink: "",
    fitScore: "",
    notes: "",
    status: "applied",
    salary: "",
    location: "",
    employmentType: "",
  });

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
  }: {
    title: string;
    value: number;
    icon: React.ComponentType<{ className: string }>;
    color: string;
    trend?: number;
  }) => (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value">{value}</p>
          {trend !== undefined && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-2">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {trend > 0 ? "+" : ""}{trend}% this month
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const chartData = [
    {
      name: "Total",
      applications: stats?.totalApplications || 0,
    },
    {
      name: "Responses",
      applications: stats?.responsesReceived || 0,
    },
    {
      name: "Rejections",
      applications: stats?.rejections || 0,
    },
    {
      name: "Interviews",
      applications: stats?.interviews || 0,
    },
    {
      name: "Offers",
      applications: stats?.offers || 0,
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submissionData = {
        ...formData,
        fitScore: formData.fitScore ? parseInt(formData.fitScore) : undefined,
        resumeUsed: "default-resume",
      };

      await createApplication(submissionData);
      setFormData({
        jobTitle: "",
        company: "",
        description: "",
        jobLink: "",
        fitScore: "",
        notes: "",
        status: "applied",
        salary: "",
        location: "",
        employmentType: "",
      });
      setShowModal(false);
      await fetchApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create application");
    } finally {
      setLoading(false);
    }
  };

  if (statsLoading || appLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-premium dark:bg-gradient-premium-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-premium dark:bg-gradient-premium-dark">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="animate-fade-in">
              <h1 className="section-title">Welcome back! 👋</h1>
              <p className="section-subtitle">Track your job search progress and manage applications</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary shadow-lg hover:shadow-xl animate-slide-in"
            >
              <Plus className="w-5 h-5" />
              Add Application
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total Applications"
              value={stats?.totalApplications || 0}
              icon={Briefcase}
              color="bg-gradient-to-br from-blue-600 to-blue-700"
              trend={12}
            />
            <StatCard
              title="Positive Responses"
              value={stats?.responsesReceived || 0}
              icon={CheckCircle}
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
              trend={8}
            />
            <StatCard
              title="Rejections"
              value={stats?.rejections || 0}
              icon={XCircle}
              color="bg-gradient-to-br from-red-500 to-red-600"
              trend={-2}
            />
            <StatCard
              title="Interviews"
              value={stats?.interviews || 0}
              icon={Clock}
              color="bg-gradient-to-br from-amber-500 to-amber-600"
              trend={15}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Bar Chart */}
            <div className="lg:col-span-2 card p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Monthly Performance
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Your application metrics at a glance
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="name" stroke="currentColor" opacity={0.5} />
                  <YAxis stroke="currentColor" opacity={0.5} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1e293b" : "#f8fafc",
                      border: "1px solid",
                      borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Bar
                    dataKey="applications"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="card p-6 flex flex-col gap-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                Quick Insights
              </h3>
              <div className="space-y-4 flex-1">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Response Rate
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {stats?.totalApplications
                      ? Math.round(
                        ((stats.responsesReceived || 0) / stats.totalApplications) *
                        100
                      )
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {stats?.totalApplications
                      ? Math.round(
                        ((stats.interviews || 0) / stats.totalApplications) * 100
                      )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-slate-100">
                Recent Applications
              </h2>
            </div>
            {applications.length === 0 ? (
              <div className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No applications yet. Start by adding your first one!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-slate-100">
                        Job Title
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-slate-100">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-slate-100">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-slate-100">
                        Fit Score
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-slate-100">
                        Applied
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-slate-100">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {applications.slice(0, 10).map((app) => (
                      <tr
                        key={app._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                          {app.jobTitle}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {app.company}
                        </td>
                        <td className="px-6 py-4">
                          <span className="badge-primary text-xs">
                            {app.status?.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {app.fitScore ? (
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {app.fitScore}%
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/applications/${app._id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
              <div>
                <h2 className="section-title">Add Job Application</h2>
                <p className="section-subtitle">Fill in the job details below</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                </div>
              )}

              {/* Job Title & Company Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="e.g., Google"
                  />
                </div>
              </div>

              {/* Location & Employment Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Salary & Fit Score Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., $100k - $150k"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Fit Score (0-100)
                  </label>
                  <input
                    type="number"
                    name="fitScore"
                    value={formData.fitScore}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="input"
                    placeholder="e.g., 85"
                  />
                </div>
              </div>

              {/* Job Link */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Job Link
                </label>
                <input
                  type="url"
                  name="jobLink"
                  value={formData.jobLink}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://..."
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="input"
                  placeholder="Paste the job description here..."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="input"
                  placeholder="Add any notes about this application..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="applied">Applied</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="offer_received">Offer Received</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Application"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
