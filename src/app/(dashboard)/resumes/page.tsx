"use client";

import { useMemo, useState } from "react";
import {
  AddResumeModal,
  filterResumes,
  ResumeFilterBar,
  ResumeHeader,
  ResumeList,
  ResumeLoading,
} from "@/components/dashboard/resume";
import { useResumes } from "@/hooks/useApi";

export default function ResumesPage() {
  const { resumes, loading, addResume, deleteResume, setDefaultResume } =
    useResumes();

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredResumes = useMemo(
    () => filterResumes(resumes, searchTerm),
    [resumes, searchTerm],
  );

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <ResumeHeader
        totalCount={resumes.length}
        filteredCount={filteredResumes.length}
        onAddResume={() => setShowAddModal(true)}
      />

      <ResumeFilterBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {loading ? (
        <ResumeLoading />
      ) : (
        <ResumeList
          resumes={filteredResumes}
          onSetDefault={setDefaultResume}
          onDelete={deleteResume}
          onResetSearch={searchTerm ? () => setSearchTerm("") : undefined}
          onAddResume={() => setShowAddModal(true)}
        />
      )}

      <AddResumeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addResume}
      />
    </div>
  );
}
