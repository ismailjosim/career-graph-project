"use client";

import { Suspense } from "react";
import {
  AtsCategoryBreakdown,
  AtsExportActions,
  AtsHeader,
  AtsInputCard,
  AtsIssuesList,
  AtsKeywordsCard,
  AtsScoreHero,
  useAtsChecker,
} from "@/components/dashboard/ats";

function AtsCheckerContent() {
  const {
    inputMode,
    setInputMode,
    savedResumes,
    loadingResumes,
    selectedResumeId,
    setSelectedResumeId,
    uploadedFile,
    uploadError,
    handleFileChange,
    rawText,
    setRawText,
    showTargetJob,
    setShowTargetJob,
    targetJob,
    setTargetJob,
    analyzing,
    analysisProgress,
    error,
    result,
    auditedDocumentName,
    runAnalysis,
    handleReset,
    handleDownloadWord,
    handleDownloadPdf,
  } = useAtsChecker();

  return (
    <div className="w-full space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <AtsHeader />

      {/* If No Result: Show Input Form */}
      {!result ? (
        <AtsInputCard
          inputMode={inputMode}
          onInputModeChange={setInputMode}
          savedResumes={savedResumes}
          loadingResumes={loadingResumes}
          selectedResumeId={selectedResumeId}
          onSelectedResumeChange={setSelectedResumeId}
          uploadedFile={uploadedFile}
          onFileChange={handleFileChange}
          uploadError={uploadError}
          rawText={rawText}
          onRawTextChange={setRawText}
          showTargetJob={showTargetJob}
          onToggleTargetJob={() => setShowTargetJob((prev) => !prev)}
          targetJob={targetJob}
          onTargetJobChange={setTargetJob}
          analyzing={analyzing}
          analysisProgress={analysisProgress}
          error={error}
          onSubmit={runAnalysis}
        />
      ) : (
        /* If Result: Display Comprehensive ATS Audit & Export Options */
        <div className="space-y-6">
          {/* Top Export Actions Bar */}
          <AtsExportActions
            onDownloadWord={handleDownloadWord}
            onDownloadPdf={handleDownloadPdf}
            onReset={handleReset}
          />

          {/* Radial Score & Executive Summary */}
          <AtsScoreHero result={result} documentName={auditedDocumentName} />

          {/* 4 Core Pillars Category Breakdown */}
          <AtsCategoryBreakdown result={result} />

          {/* Actionable Issues & Fix Recommendations */}
          <AtsIssuesList issues={result.criticalIssues} />

          {/* Keywords Scanned vs Missing */}
          <AtsKeywordsCard
            detectedKeywords={result.detectedKeywords}
            missingKeywords={result.missingKeywords}
          />

          {/* Bottom Export Actions Bar */}
          <AtsExportActions
            onDownloadWord={handleDownloadWord}
            onDownloadPdf={handleDownloadPdf}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}

export default function AtsCheckerPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-3">
          <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">
            Loading ATS Resume Checker...
          </p>
        </div>
      }
    >
      <AtsCheckerContent />
    </Suspense>
  );
}
