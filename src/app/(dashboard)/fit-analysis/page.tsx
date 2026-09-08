"use client";

import { AlertCircle, ArrowLeft, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

interface Resume {
  _id?: string;
  name: string;
  fileName: string;
}
interface JobAnalysis {
  fitScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: "strong" | "moderate" | "weak";
  details: string;
}

export default function FitAnalysisPage() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedResume, setSelectedResume] = useState("");
  const [jobInput, setJobInput] = useState({
    title: "",
    description: "",
    requirements: "",
  });
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);

  const fetchResumes = useCallback(async () => {
    if (!userId) {
      if (!isPending) setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/resumes", {
        headers: { "x-user-id": userId },
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
        if (data.length > 0) setSelectedResume(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, isPending]);

  useEffect(() => {
    if (userId) {
      fetchResumes();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchResumes, userId, isPending]);

  const analyzeJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    try {
      const jobText =
        `${jobInput.title} ${jobInput.description} ${jobInput.requirements}`.toLowerCase();
      const techKeywords = {
        frontend: [
          "react",
          "vue",
          "angular",
          "javascript",
          "typescript",
          "css",
          "html",
        ],
        backend: ["node", "python", "java", "c#", "go", "rust", "php"],
        database: ["mongodb", "postgresql", "mysql", "redis", "elasticsearch"],
        devops: ["docker", "kubernetes", "aws", "gcp", "azure", "ci/cd"],
        other: ["git", "agile", "rest api", "graphql", "testing", "sql"],
      };
      let matchedSkills: string[] = [];
      let missingSkills: string[] = [];
      Object.values(techKeywords).forEach((keywords) => {
        keywords.forEach((keyword) => {
          if (jobText.includes(keyword))
            matchedSkills.push(
              keyword.charAt(0).toUpperCase() + keyword.slice(1),
            );
          else
            missingSkills.push(
              keyword.charAt(0).toUpperCase() + keyword.slice(1),
            );
        });
      });
      matchedSkills = [...new Set(matchedSkills)];
      missingSkills = [...new Set(missingSkills)];
      const fitScore = Math.min(
        100,
        Math.round(
          (matchedSkills.length /
            (matchedSkills.length + missingSkills.length)) *
            100,
        ) || 0,
      );
      let recommendation: "strong" | "moderate" | "weak";
      if (fitScore >= 75) recommendation = "strong";
      else if (fitScore >= 50) recommendation = "moderate";
      else recommendation = "weak";
      setAnalysis({
        fitScore,
        matchedSkills: matchedSkills.slice(0, 8),
        missingSkills: missingSkills.slice(0, 8),
        recommendation,
        details:
          recommendation === "strong"
            ? "Your resume aligns well with this job. You have most of the required skills. Consider applying!"
            : recommendation === "moderate"
              ? "Your resume has some relevant skills, but you might be missing some key requirements. Review the job description carefully before applying."
              : "Your resume doesn't align well with this job. You may need to highlight related skills or continue learning the required technologies.",
      });
    } catch (error) {
      console.error("Error analyzing job:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyWithScore = async () => {
    if (!analysis || !selectedResume || !userId) return;
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({
          jobTitle: jobInput.title,
          description: jobInput.description,
          resumeUsed: selectedResume,
          fitScore: analysis.fitScore,
          status: "applied",
          company: "Unknown Company",
        }),
      });
      if (response.ok) {
        alert("Application created successfully!");
        setJobInput({ title: "", description: "", requirements: "" });
        setAnalysis(null);
      }
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "strong":
        return "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-900/30";
      case "moderate":
        return "text-yellow-700 bg-yellow-50 dark:text-yellow-300 dark:bg-yellow-900/30";
      case "weak":
        return "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/30";
      default:
        return "";
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Job Fit Analysis
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Analyze how well your resume matches a job posting
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Select Resume
            </h2>
            {loading ? (
              <p className="text-slate-600 dark:text-slate-400">
                Loading resumes...
              </p>
            ) : resumes.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                No resumes found. Please add a resume first.
              </p>
            ) : (
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                className="input mb-6"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            )}
            <form onSubmit={analyzeJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={jobInput.title}
                  onChange={(e) =>
                    setJobInput({ ...jobInput, title: e.target.value })
                  }
                  required
                  placeholder="e.g., Senior Frontend Developer"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={jobInput.description}
                  onChange={(e) =>
                    setJobInput({ ...jobInput, description: e.target.value })
                  }
                  required
                  placeholder="Paste job description..."
                  rows={4}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Key Requirements (Optional)
                </label>
                <textarea
                  value={jobInput.requirements}
                  onChange={(e) =>
                    setJobInput({ ...jobInput, requirements: e.target.value })
                  }
                  placeholder="Specific requirements..."
                  rows={3}
                  className="input"
                />
              </div>
              <button
                type="submit"
                disabled={analyzing || !selectedResume}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? "Analyzing..." : "Analyze Fit"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {analysis ? (
            <div className="space-y-6">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Fit Score
                  </h2>
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="mb-6">
                  <div className="flex items-end gap-4">
                    <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
                      {analysis.fitScore}%
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${analysis.fitScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl flex gap-3 ${getRecommendationColor(analysis.recommendation)}`}
                >
                  {analysis.recommendation === "strong" ? (
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium">{analysis.details}</p>
                </div>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Matched Skills ({analysis.matchedSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Missing Skills ({analysis.missingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-block bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      ✗ {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <button
                  onClick={handleApplyWithScore}
                  className="w-full btn-primary mb-3"
                >
                  Create Application with This Fit Score
                </button>
                <button
                  onClick={() => {
                    setAnalysis(null);
                    setJobInput({
                      title: "",
                      description: "",
                      requirements: "",
                    });
                  }}
                  className="w-full btn-secondary"
                >
                  Analyze Another Job
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Fill in the job details on the left to analyze fit
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
