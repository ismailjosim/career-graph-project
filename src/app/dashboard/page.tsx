"use client";

import { useState } from "react";
import { useJobApplications, useMonthlyStats } from "@/hooks/useApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Briefcase, CheckCircle, XCircle, Clock, X, Plus } from "lucide-react";
import Link from "next/link";

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
  }: {
    title: string;
    value: number;
    icon: React.ComponentType<{ className: string }>;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your job applications and progress</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Application
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Applications"
            value={stats?.totalApplications || 0}
            icon={Briefcase}
            color="bg-blue-500"
          />
          <StatCard
            title="Responses"
            value={stats?.responsesReceived || 0}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Rejections"
            value={stats?.rejections || 0}
            icon={XCircle}
            color="bg-red-500"
          />
          <StatCard
            title="Interviews"
            value={stats?.interviews || 0}
            icon={Clock}
            color="bg-purple-500"
          />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
          </div>
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No applications yet. Start by adding one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Fit Score
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.slice(0, 10).map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {app.jobTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{app.company}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {app.status?.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.fitScore ? `${app.fitScore}%` : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/applications/${app._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
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

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link
            href="/wishlist"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="font-bold text-gray-900 mb-2">Wishlist</h3>
            <p className="text-gray-600 text-sm">Review saved job posts</p>
          </Link>
          <Link
            href="/cover-letters"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="font-bold text-gray-900 mb-2">Cover Letters</h3>
            <p className="text-gray-600 text-sm">Manage your cover letters</p>
          </Link>
          <Link
            href="/resumes"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="font-bold text-gray-900 mb-2">Resumes</h3>
            <p className="text-gray-600 text-sm">Manage your resumes</p>
          </Link>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">Add Job Application</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Job Title & Company Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., Google"
                  />
                </div>
              </div>

              {/* Location & Employment Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., $100k - $150k"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fit Score (0-100)
                  </label>
                  <input
                    type="number"
                    name="fitScore"
                    value={formData.fitScore}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., 85"
                  />
                </div>
              </div>

              {/* Job Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Link
                </label>
                <input
                  type="url"
                  name="jobLink"
                  value={formData.jobLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="https://..."
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Paste the job description here..."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Add any notes about this application..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                >
                  {loading ? "Creating..." : "Create Application"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
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
