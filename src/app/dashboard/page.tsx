"use client";

import { useJobApplications, useMonthlyStats } from "@/hooks/useApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Briefcase, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { applications, loading: appLoading } = useJobApplications();
  const { stats, loading: statsLoading } = useMonthlyStats();

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
          <Link
            href="/applications/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Application
          </Link>
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
    </div>
  );
}
