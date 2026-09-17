"use client";

import { ArrowUpRight, Briefcase, ExternalLink, Eye, MousePointerClick } from "lucide-react";
import Link from "next/link";
import type { AdminTopJob } from "./types";

interface AdminTopJobsTableProps {
  jobs: AdminTopJob[];
}

export function AdminTopJobsTable({ jobs = [] }: AdminTopJobsTableProps) {
  const getSourceBadge = (source: string) => {
    switch (source) {
      case "linkedin":
        return "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40";
      case "indeed":
        return "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40";
      case "glassdoor":
        return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="card bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-purple-600" />
            <span>Top Performing Jobs by External Clicks</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Post-level engagement metrics tracking outbound candidate traffic to hiring boards
          </p>
        </div>
        <Link
          href="/jobs"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>View All Jobs</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-5">Job Title & Company</th>
              <th className="py-3 px-4">Source Board</th>
              <th className="py-3 px-4">Workplace</th>
              <th className="py-3 px-4 text-center">Views</th>
              <th className="py-3 px-4 text-center font-bold text-purple-600 dark:text-purple-400">
                Outbound Clicks
              </th>
              <th className="py-3 px-4 text-center">Applicants</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {job.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {job.company} • {job.location}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize ${getSourceBadge(
                        job.sourcePlatform,
                      )}`}
                    >
                      {job.sourcePlatform}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 capitalize text-slate-600 dark:text-slate-300">
                    {job.workplaceType}
                  </td>

                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {job.viewsCount}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 font-black text-xs shadow-2xs">
                      <MousePointerClick className="w-3 h-3" />
                      <span>{job.externalClicksCount} clicks</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {job.applicantsCount}
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {job.originalJobUrl && (
                        <a
                          href={job.originalJobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Open external board URL"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Link
                        href={`/jobs/${job.id}`}
                        className="btn-outline py-1 px-2.5 text-[11px] font-medium"
                      >
                        Inspect
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                  No job postings with tracked clicks yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
