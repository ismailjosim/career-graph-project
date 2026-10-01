"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CoverLetterFilterBar,
  CoverLetterHeader,
  CoverLetterList,
  CoverLetterLoading,
  CoverLetterModal,
  filterCoverLetters,
} from "@/components/dashboard/coverLetter";
import { useCoverLetters } from "@/hooks/useApi";
import type { CoverLetter } from "@/lib/validation";

export function CoverLettersClient() {
  const searchParams = useSearchParams();
  const urlTitle = searchParams.get("title");
  const urlCompany = searchParams.get("company");
  const urlRequirements = searchParams.get("requirements");
  const urlDesc = searchParams.get("description");

  const {
    coverLetters,
    loading,
    createCoverLetter,
    updateCoverLetter,
    deleteCoverLetter,
  } = useCoverLetters();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLetter, setEditingLetter] = useState<CoverLetter | null>(null);
  const [initialAiData, setInitialAiData] = useState<{
    jobTitle?: string;
    company?: string;
    jobDescription?: string;
    autoOpenAi?: boolean;
  } | null>(null);

  // Auto-launch modal if redirected from a job posting
  useEffect(() => {
    if (urlTitle || urlCompany || urlRequirements || urlDesc) {
      const compiledDesc = [
        urlRequirements ? `Key Requirements:\n${urlRequirements}` : "",
        urlDesc ? `Job Details:\n${urlDesc}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      setInitialAiData({
        jobTitle: urlTitle || "",
        company: urlCompany || "",
        jobDescription: compiledDesc,
        autoOpenAi: true,
      });
      setEditingLetter(null);
      setShowModal(true);
      toast.info(
        `Loaded details for ${urlTitle || "target role"}. Ready to craft cover letter!`,
      );
    }
  }, [urlTitle, urlCompany, urlRequirements, urlDesc]);

  const filteredLetters = useMemo(
    () => filterCoverLetters(coverLetters, searchTerm),
    [coverLetters, searchTerm],
  );

  const handleOpenCreate = () => {
    setEditingLetter(null);
    setInitialAiData(null);
    setShowModal(true);
  };

  const handleOpenEdit = (letter: CoverLetter) => {
    setEditingLetter(letter);
    setInitialAiData(null);
    setShowModal(true);
  };

  const handleSave = async (data: { title: string; content: string }) => {
    if (editingLetter?._id) {
      return await updateCoverLetter(editingLetter._id, data);
    }
    return await createCoverLetter(data);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <CoverLetterHeader
        totalCount={coverLetters.length}
        filteredCount={filteredLetters.length}
        onNewLetter={handleOpenCreate}
      />

      <CoverLetterFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {loading ? (
        <CoverLetterLoading />
      ) : (
        <CoverLetterList
          letters={filteredLetters}
          onEdit={handleOpenEdit}
          onDelete={deleteCoverLetter}
          onResetSearch={searchTerm ? () => setSearchTerm("") : undefined}
          onNewLetter={handleOpenCreate}
        />
      )}

      <CoverLetterModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingLetter(null);
          setInitialAiData(null);
        }}
        initialData={editingLetter}
        initialAiData={initialAiData || undefined}
        onSave={handleSave}
      />
    </div>
  );
}
