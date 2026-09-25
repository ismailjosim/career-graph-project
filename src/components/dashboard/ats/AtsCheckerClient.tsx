"use client";

import {
  AtsAiReadinessCard,
  AtsCategoryBreakdown,
  AtsExportActions,
  AtsHeader,
  AtsInputCard,
  AtsIssuesList,
  AtsKeywordsCard,
  AtsScoreHero,
} from "@/components/dashboard/ats";
import { useAtsChecker } from "@/hooks";

export function AtsCheckerClient() {
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

          {/* Modern AI & Agentic Skills Readiness */}
          <AtsAiReadinessCard aiReadiness={result.aiReadiness} />

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
