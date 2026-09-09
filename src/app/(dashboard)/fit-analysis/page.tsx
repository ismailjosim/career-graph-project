"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ANALYSIS_STEPS,
  AnalysisProgressCard,
  AnalysisSubmitButton,
  CandidateResumeSection,
  FitAnalysisHeader,
  type JobInputMode,
  type JobPostInput,
  JobPostingSection,
  type PreviousAnalysisResult,
  type ResumeInputMode,
  type StoredResume,
  type UploadedResumeFile,
} from "@/components/dashboard/fit-analysis";
import { useTokens } from "@/context/tokens-context";
import { confirmTokenUsage } from "@/lib/alerts";
import { useSession } from "@/lib/auth-client";

export default function FitAnalysisPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const { tokens, refreshTokens, updateTokensLocally } = useTokens();

  // Stored previous result indicator
  const [previousResult, setPreviousResult] =
    useState<PreviousAnalysisResult | null>(null);

  // Resumes state
  const [resumes, setResumes] = useState<StoredResume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  // Job post input state
  const [jobMode, setJobMode] = useState<JobInputMode>("paste");
  const [jobLink, setJobLink] = useState("");
  const [fetchingJobLink, setFetchingJobLink] = useState(false);
  const [jobLinkError, setJobLinkError] = useState<string | null>(null);
  const [jobInput, setJobInput] = useState<JobPostInput>({
    title: "",
    company: "",
    description: "",
  });

  // Resume input state
  const [resumeMode, setResumeMode] = useState<ResumeInputMode>("saved");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedResumeFile | null>(
    null,
  );
  const [saveToAccount, setSaveToAccount] = useState(true);
  const [customResumeName, setCustomResumeName] = useState("");
  const [resumeText, setResumeText] = useState("");

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
  const handleFileSelect = (file: File) => {
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
      toast.warning("Please provide a job description or link.");
      return;
    }

    if (resumeMode === "saved" && !selectedResumeId) {
      toast.warning("Please select a saved resume or upload one.");
      return;
    }

    if (resumeMode === "upload" && !uploadedFile) {
      toast.warning("Please select or upload a resume file (PDF/Text).");
      return;
    }

    if (resumeMode === "text" && !resumeText.trim()) {
      toast.warning("Please paste your resume text.");
      return;
    }

    const confirmed = await confirmTokenUsage({
      featureName: "AI Job Fit Analysis",
      tokenCost: 10,
      currentTokens: tokens,
    });

    if (!confirmed) return;

    setAnalyzing(true);
    setAnalysisError(null);
    const toastId = toast.loading("Analyzing job fit alignment with Gemini...");

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

      if (typeof data.remainingTokens === "number") {
        updateTokensLocally(data.remainingTokens);
      }
      refreshTokens();

      if (resumeMode === "upload" && saveToAccount) {
        fetchResumes();
      }

      toast.success(
        `Fit analysis complete! Score: ${data.data?.fitScore ?? 0}%. 10 tokens deducted.`,
        { id: toastId },
      );

      // Navigate to dedicated result page
      router.push("/fit-analysis/result");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during analysis.";
      setAnalysisError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16 animate-fade-in">
      {/* Header */}
      <FitAnalysisHeader previousResult={previousResult} />

      {/* Main Form: 2 Columns */}
      <form onSubmit={handleRunAnalysis} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Section 1: Job Post Input */}
          <JobPostingSection
            jobMode={jobMode}
            onJobModeChange={setJobMode}
            jobLink={jobLink}
            onJobLinkChange={setJobLink}
            fetchingJobLink={fetchingJobLink}
            onFetchJobUrl={handleFetchJobUrl}
            jobLinkError={jobLinkError}
            jobInput={jobInput}
            onJobInputChange={setJobInput}
          />

          {/* Section 2: Resume Input */}
          <CandidateResumeSection
            resumeMode={resumeMode}
            onResumeModeChange={setResumeMode}
            resumes={resumes}
            loadingResumes={loadingResumes}
            selectedResumeId={selectedResumeId}
            onSelectResumeId={setSelectedResumeId}
            uploadedFile={uploadedFile}
            onFileSelect={handleFileSelect}
            onFileRemove={() => setUploadedFile(null)}
            saveToAccount={saveToAccount}
            onSaveToAccountChange={setSaveToAccount}
            customResumeName={customResumeName}
            onCustomResumeNameChange={setCustomResumeName}
            resumeText={resumeText}
            onResumeTextChange={setResumeText}
          />
        </div>

        {/* Action Button & Active Loader */}
        {analyzing ? (
          <AnalysisProgressCard
            currentStepIndex={analysisStep}
            steps={ANALYSIS_STEPS}
          />
        ) : (
          <AnalysisSubmitButton
            analyzing={analyzing}
            analysisError={analysisError}
          />
        )}
      </form>
    </div>
  );
}
