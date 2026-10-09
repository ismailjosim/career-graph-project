"use client";

import {
  ANALYSIS_STEPS,
  AnalysisProgressCard,
  AnalysisSubmitButton,
  CandidateResumeSection,
  FitAnalysisHeader,
  JobPostingSection,
  useFitAnalysis,
} from "@/components/dashboard/fit-analysis";

export function FitAnalysisClient() {
  const {
    previousResult,
    resumes,
    loadingResumes,
    jobMode,
    setJobMode,
    jobLink,
    setJobLink,
    fetchingJobLink,
    handleFetchJobUrl,
    jobLinkError,
    jobInput,
    setJobInput,
    resumeMode,
    setResumeMode,
    selectedResumeId,
    setSelectedResumeId,
    uploadedFile,
    setUploadedFile,
    handleFileSelect,
    saveToAccount,
    setSaveToAccount,
    customResumeName,
    setCustomResumeName,
    resumeText,
    setResumeText,
    analyzing,
    analysisStep,
    analysisError,
    handleRunAnalysis,
  } = useFitAnalysis();

  return (
    <div className="w-full space-y-8 pb-16 animate-fade-in">
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
