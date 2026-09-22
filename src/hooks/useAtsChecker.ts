"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  exportToPdf,
  exportToWord,
} from "@/components/dashboard/ats/atsExport.utils";
import { useTokens } from "@/context/tokens-context";
import type {
  AtsAnalysisResult,
  AtsInputMode,
  AtsTargetJob,
  SavedResumeOption,
} from "@/interfaces";
import { confirmTokenUsage } from "@/lib/alerts";

export function useAtsChecker() {
  const { tokens, refreshTokens, updateTokensLocally } = useTokens();
  const [inputMode, setInputMode] = useState<AtsInputMode>("saved");

  // Saved resumes from user's account
  const [savedResumes, setSavedResumes] = useState<SavedResumeOption[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");

  // Uploaded file
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Raw text input
  const [rawText, setRawText] = useState("");

  // Target Job matching
  const [showTargetJob, setShowTargetJob] = useState(false);
  const [targetJob, setTargetJob] = useState<AtsTargetJob>({
    title: "",
    description: "",
  });

  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AtsAnalysisResult | null>(null);
  const [auditedDocumentName, setAuditedDocumentName] = useState("My Resume");

  // Fetch saved resumes
  const fetchSavedResumes = useCallback(async () => {
    try {
      setLoadingResumes(true);
      const res = await fetch("/api/resumes");
      if (res.ok) {
        const data = await res.json();
        const resumes: SavedResumeOption[] = Array.isArray(data)
          ? data
          : data.resumes || [];
        setSavedResumes(resumes);

        // Pick default or first resume
        const def = resumes.find((r) => r.isDefault) || resumes[0];
        if (def) {
          setSelectedResumeId(def._id);
        } else {
          // If user has no saved resumes, fallback to upload tab
          setInputMode("upload");
        }
      }
    } catch (err) {
      console.warn("Failed to load saved resumes:", err);
    } finally {
      setLoadingResumes(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedResumes();
  }, [fetchSavedResumes]);

  // Handle file selection
  const handleFileChange = (file: File) => {
    setUploadError(null);

    // Limit to PDF and text/doc under 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit.");
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setFileBase64(b64);
    };
    reader.onerror = () => {
      setUploadError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  // Run ATS audit
  const runAnalysis = async () => {
    setError(null);

    let resumePayload: Record<string, unknown>;
    let docName = "Resume";

    if (inputMode === "saved") {
      if (!selectedResumeId) {
        setError("Please select a saved resume to analyze.");
        return;
      }
      const savedDoc = savedResumes.find((r) => r._id === selectedResumeId);
      docName = savedDoc?.name || savedDoc?.fileName || "Saved Resume";
      resumePayload = {
        mode: "saved",
        resumeId: selectedResumeId,
      };
    } else if (inputMode === "upload") {
      if (!fileBase64 || !uploadedFile) {
        setError("Please upload a PDF or document file to audit.");
        return;
      }
      docName = uploadedFile.name;
      resumePayload = {
        mode: "upload",
        fileBase64,
        fileName: uploadedFile.name,
        mimeType: uploadedFile.type || "application/pdf",
      };
    } else {
      if (!rawText.trim() || rawText.trim().length < 50) {
        setError("Please enter your resume text (minimum 50 characters).");
        return;
      }
      docName = "Pasted Resume Content";
      resumePayload = {
        mode: "text",
        text: rawText.trim(),
        title: "Pasted Resume Text",
      };
    }

    const confirmed = await confirmTokenUsage({
      featureName: "AI ATS Resume Audit",
      tokenCost: 10,
      currentTokens: tokens,
    });

    if (!confirmed) return;

    const toastId = toast.loading("Analyzing resume against ATS benchmarks...");

    try {
      setAnalyzing(true);
      setAnalysisProgress(15);
      setAuditedDocumentName(docName);

      // Simulated realistic progress ticker
      const progressTimer = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressTimer);
            return 90;
          }
          return prev + 15;
        });
      }, 400);

      const res = await fetch("/api/ai/ats-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: resumePayload,
          targetJob: showTargetJob ? targetJob : undefined,
        }),
      });

      clearInterval(progressTimer);
      setAnalysisProgress(100);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setResult(data.result);
      if (data.resumeTitle) {
        setAuditedDocumentName(data.resumeTitle);
      }

      if (typeof data.remainingTokens === "number") {
        updateTokensLocally(data.remainingTokens);
      }
      refreshTokens();

      toast.success(
        `ATS Audit Complete! Score: ${data.result?.overallScore ?? 0}/100. 10 tokens deducted.`,
        { id: toastId },
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during ATS audit.";
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setAnalysisProgress(0);
  };

  const handleDownloadWord = () => {
    if (!result) return;
    exportToWord(result, auditedDocumentName);
    toast.success("Word report downloaded!");
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    exportToPdf(result, auditedDocumentName);
    toast.success("PDF print dialog opened!");
  };

  return {
    // Inputs & Selection
    inputMode,
    setInputMode,
    savedResumes,
    loadingResumes,
    selectedResumeId,
    setSelectedResumeId,
    uploadedFile,
    uploadError,
    handleFileChange,
    setUploadedFile,
    rawText,
    setRawText,
    showTargetJob,
    setShowTargetJob,
    targetJob,
    setTargetJob,

    // Execution & Progress
    analyzing,
    analysisProgress,
    error,
    result,
    auditedDocumentName,
    runAnalysis,
    handleReset,

    // Exports
    handleDownloadWord,
    handleDownloadPdf,
  };
}
