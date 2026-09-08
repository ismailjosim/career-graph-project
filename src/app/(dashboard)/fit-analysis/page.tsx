"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  FileCheck,
  FileText,
  Link2,
  Loader2,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";

interface StoredResume {
  _id: string;
  name: string;
  fileName: string;
  fileUrl?: string;
  isDefault?: boolean;
  uploadedAt?: string;
}

const ANALYSIS_STEPS = [
  "Reading job description & extracting key requirements...",
  "Auditing candidate qualifications against position criteria...",
  "Evaluating ATS keyword alignment & seniority match...",
  "Formulating specific, high-impact resume modifications...",
];

export default function FitAnalysisPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  // Stored previous result indicator
  const [previousResult, setPreviousResult] = useState<{
    jobTitle?: string;
    company?: string;
    fitScore?: number;
  } | null>(null);

  // Resumes state
  const [resumes, setResumes] = useState<StoredResume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  // Job post input state
  const [jobMode, setJobMode] = useState<"paste" | "link">("paste");
  const [jobLink, setJobLink] = useState("");
  const [fetchingJobLink, setFetchingJobLink] = useState(false);
  const [jobLinkError, setJobLinkError] = useState<string | null>(null);
  const [jobInput, setJobInput] = useState({
    title: "",
    company: "",
    description: "",
  });

  // Resume input state
  const [resumeMode, setResumeMode] = useState<"saved" | "upload" | "text">(
    "saved",
  );
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [saveToAccount, setSaveToAccount] = useState(true);
  const [customResumeName, setCustomResumeName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis & Loading state
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Check if a previous analysis exists in sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("fit_analysis_result");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.result) {
          setPreviousResult({
            jobTitle:
              parsed.meta?.jobTitle || parsed.jobInput?.title || "Target Role",
            company:
              parsed.meta?.company || parsed.jobInput?.company || "Company",
            fitScore: parsed.result.fitScore,
          });
        }
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  // Fetch stored resumes
  const fetchResumes = useCallback(async () => {
    if (!userId) {
      if (!isPending) setLoadingResumes(false);
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
        if (data.length > 0) {
          const defaultResume = data.find((r: StoredResume) => r.isDefault);
          setSelectedResumeId(defaultResume ? defaultResume._id : data[0]._id);
        } else {
          setResumeMode("upload");
        }
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoadingResumes(false);
    }
  }, [userId, isPending]);

  useEffect(() => {
    if (userId) {
      fetchResumes();
    } else if (!isPending) {
      setLoadingResumes(false);
    }
  }, [fetchResumes, userId, isPending]);

  // Handle file drop / pick
  const handleFileChange = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadedFile({
        name: file.name,
        size: file.size,
        base64,
        mimeType: file.type || "application/pdf",
      });
      if (!customResumeName) {
        setCustomResumeName(file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsDataURL(file);
  };

  // Fetch job details from URL
  const handleFetchJobUrl = async () => {
    if (!jobLink.trim()) return;
    setFetchingJobLink(true);
    setJobLinkError(null);

    try {
      const res = await fetch("/api/ai/extract-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId || "",
        },
        body: JSON.stringify({ url: jobLink.trim() }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setJobInput({
          title: json.data.title || "",
          company: json.data.company || "",
          description: json.data.description || "",
        });
        setJobMode("paste");
      } else {
        setJobLinkError(
          json.error ||
            "Unable to scrape this job posting automatically. Please copy and paste the job description below.",
        );
      }
    } catch {
      setJobLinkError(
        "Network error while fetching job link. Please paste the job description directly.",
      );
    } finally {
      setFetchingJobLink(false);
    }
  };

  // Run AI Fit Analysis and Redirect to /fit-analysis/result
  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobInput.description.trim()) {
      alert("Please provide a job description or link.");
      return;
    }

    if (resumeMode === "saved" && !selectedResumeId) {
      alert("Please select a saved resume or upload one.");
      return;
    }

    if (resumeMode === "upload" && !uploadedFile) {
      alert("Please select or upload a resume file (PDF/Text).");
      return;
    }

    if (resumeMode === "text" && !resumeText.trim()) {
      alert("Please paste your resume text.");
      return;
    }

    setAnalyzing(true);
    setAnalysisError(null);

    const interval = setInterval(() => {
      setAnalysisStep((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 2200);

    try {
      const payload = {
        job: {
          mode: jobMode,
          title: jobInput.title || "Target Role",
          company: jobInput.company || "Target Company",
          description: jobInput.description,
          url: jobMode === "link" ? jobLink : undefined,
        },
        resume: {
          mode: resumeMode,
          resumeId: resumeMode === "saved" ? selectedResumeId : undefined,
          fileBase64:
            resumeMode === "upload" ? uploadedFile?.base64 : undefined,
          mimeType:
            resumeMode === "upload" ? uploadedFile?.mimeType : undefined,
          fileName: resumeMode === "upload" ? uploadedFile?.name : undefined,
          resumeName: resumeMode === "upload" ? customResumeName : undefined,
          saveToAccount: resumeMode === "upload" ? saveToAccount : false,
          text: resumeMode === "text" ? resumeText : undefined,
        },
      };

      const res = await fetch("/api/ai/fit-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Failed to analyze resume fit. Please try again.",
        );
      }

      // Store results in sessionStorage for the dedicated result page
      sessionStorage.setItem(
        "fit_analysis_result",
        JSON.stringify({
          result: data.data,
          meta: data.meta,
          jobInput: {
            ...jobInput,
            link: jobMode === "link" ? jobLink : undefined,
          },
          analyzedAt: new Date().toISOString(),
        }),
      );

      if (resumeMode === "upload" && saveToAccount) {
        fetchResumes();
      }

      // Navigate to dedicated result page!
      router.push("/fit-analysis/result");
    } catch (err: unknown) {
      setAnalysisError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during analysis.",
      );
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                AI Job Fit Analysis
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
                <Sparkles className="w-3 h-3" />
                Gemini 2.5
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Match your resume against any job description. Get tailored bullet
              adjustments and an application recommendation on the next page.
            </p>
          </div>
        </div>

        {previousResult && (
          <Link
            href="/fit-analysis/result"
            className="btn-outline text-xs py-2 px-3.5 flex items-center gap-2 border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              Last Result: <strong>{previousResult.fitScore}%</strong> (
              {previousResult.jobTitle})
            </span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Main Form: 2 Columns */}
      <form onSubmit={handleRunAnalysis} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Section 1: Job Post Input */}
          <div className="card p-6 sm:p-7 border border-slate-200 dark:border-slate-800/80 shadow-sm relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    1. Target Job Posting
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Paste description or fetch from link
                  </p>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setJobMode("paste")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    jobMode === "paste"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Paste Text
                </button>
                <button
                  type="button"
                  onClick={() => setJobMode("link")}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                    jobMode === "link"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Job Link
                </button>
              </div>
            </div>

            {/* Link Mode */}
            {jobMode === "link" && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Job URL (Lever, Greenhouse, Career Site)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      placeholder="https://company.com/careers/job/..."
                      value={jobLink}
                      onChange={(e) => setJobLink(e.target.value)}
                      className="input pl-10 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchJobUrl}
                    disabled={fetchingJobLink || !jobLink.trim()}
                    className="btn-primary px-4 text-sm shrink-0 disabled:opacity-50"
                  >
                    {fetchingJobLink ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Fetch Job"
                    )}
                  </button>
                </div>

                {jobLinkError && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p>{jobLinkError}</p>
                      <button
                        type="button"
                        onClick={() => setJobMode("paste")}
                        className="text-blue-600 dark:text-blue-400 font-semibold underline mt-1 block"
                      >
                        Switch to Paste Description &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Job Details Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={jobInput.title}
                    onChange={(e) =>
                      setJobInput({ ...jobInput, title: e.target.value })
                    }
                    className="input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, Airbnb"
                    value={jobInput.company}
                    onChange={(e) =>
                      setJobInput({ ...jobInput, company: e.target.value })
                    }
                    className="input text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Full Job Description *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {jobInput.description.length} chars
                  </span>
                </div>
                <textarea
                  required
                  rows={8}
                  placeholder="Paste the full job posting text (responsibilities, qualifications, tech stack)..."
                  value={jobInput.description}
                  onChange={(e) =>
                    setJobInput({ ...jobInput, description: e.target.value })
                  }
                  className="input text-sm resize-y leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Resume Input */}
          <div className="card p-6 sm:p-7 border border-slate-200 dark:border-slate-800/80 shadow-sm relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    2. Candidate Resume
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Saved resume, PDF upload, or paste
                  </p>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setResumeMode("saved")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    resumeMode === "saved"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Saved ({resumes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setResumeMode("upload")}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                    resumeMode === "upload"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload PDF
                </button>
                <button
                  type="button"
                  onClick={() => setResumeMode("text")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    resumeMode === "text"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Paste
                </button>
              </div>
            </div>

            {/* Mode 1: Saved Resumes */}
            {resumeMode === "saved" && (
              <div className="space-y-3">
                {loadingResumes ? (
                  <div className="py-12 flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading your saved resumes...
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No saved resumes found in your profile.
                    </p>
                    <button
                      type="button"
                      onClick={() => setResumeMode("upload")}
                      className="btn-primary text-xs mx-auto"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload a PDF Resume
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-75 overflow-y-auto pr-1">
                    {resumes.map((r) => {
                      const isSelected = selectedResumeId === r._id;
                      return (
                        <div
                          key={r._id}
                          onClick={() => setSelectedResumeId(r._id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`p-2 rounded-lg shrink-0 ${
                                isSelected
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {r.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {r.fileName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {r.isDefault && (
                              <span className="badge-primary text-[10px] py-0.5 px-2">
                                Default
                              </span>
                            )}
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-600 text-white"
                                  : "border-slate-300 dark:border-slate-600"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Upload File */}
            {resumeMode === "upload" && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileChange(f);
                  }}
                  className="hidden"
                />

                {!uploadedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (f) handleFileChange(f);
                    }}
                    className="p-10 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition cursor-pointer text-center group bg-slate-50/50 dark:bg-slate-900/50"
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Click to upload or drag & drop PDF
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      PDF, TXT, or DOCX (up to 10MB)
                    </p>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-3">
                      Gemini 2.5 will analyze document structure, dates &
                      bullets
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-indigo-600 text-white">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(uploadedFile.size / 1024).toFixed(1)} KB &bull;{" "}
                            {uploadedFile.mimeType}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-500 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/30 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          id="saveToAccountCheckbox"
                          type="checkbox"
                          checked={saveToAccount}
                          onChange={(e) => setSaveToAccount(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor="saveToAccountCheckbox"
                          className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          Save this resume to my profile for future applications
                        </label>
                      </div>
                      {saveToAccount && (
                        <input
                          type="text"
                          placeholder="Resume Label (e.g. Senior Full Stack 2026)"
                          value={customResumeName}
                          onChange={(e) => setCustomResumeName(e.target.value)}
                          className="input text-xs py-1.5"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode 3: Raw Text */}
            {resumeMode === "text" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Paste Resume Content
                </label>
                <textarea
                  rows={8}
                  placeholder="Paste your resume text (summary, skills, work experience, education)..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="input text-sm resize-y leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Button & Active Loader */}
        <div className="space-y-4">
          {analyzing ? (
            <div className="card p-8 text-center border-2 border-indigo-500/40 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md animate-spin">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Analyzing Fit & Auditing Resume...
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold min-h-5">
                  {ANALYSIS_STEPS[analysisStep]}
                </p>
              </div>

              <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${((analysisStep + 1) / ANALYSIS_STEPS.length) * 100}%`,
                  }}
                />
              </div>

              <p className="text-[11px] text-slate-400">
                You will be automatically redirected to your full Analysis
                Report page when complete.
              </p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={analyzing}
              className="w-full btn-primary py-4 text-base font-bold shadow-lg hover:shadow-xl group relative overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
                <span>Run AI Fit Analysis & View Report</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )}

          {analysisError && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-sm text-rose-800 dark:text-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-xs mt-0.5">{analysisError}</p>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
