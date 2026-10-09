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
import { PaginationControl } from "@/components/ui/PaginationControl";
import { useCoverLetters } from "@/hooks/useApi";
import type { CoverLetter } from "@/lib/validation";

const PAGE_SIZE = 8;

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
  const [currentPage, setCurrentPage] = useState(1);
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

  // Reset to page 1 on search change
  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset page when searchTerm changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredLetters.length / PAGE_SIZE) || 1;
  const paginatedLetters = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLetters.slice(start, start + PAGE_SIZE);
  }, [filteredLetters, currentPage]);

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
        <div className="space-y-6">
          <CoverLetterList
            letters={paginatedLetters}
            onEdit={handleOpenEdit}
            onDelete={deleteCoverLetter}
            onResetSearch={searchTerm ? () => setSearchTerm("") : undefined}
            onNewLetter={handleOpenCreate}
          />

          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLetters.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemName="cover letters"
          />
        </div>
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
