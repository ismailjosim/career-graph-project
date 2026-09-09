"use client";

import { useMemo, useState } from "react";
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

export default function CoverLettersPage() {
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

  const filteredLetters = useMemo(
    () => filterCoverLetters(coverLetters, searchTerm),
    [coverLetters, searchTerm],
  );

  const handleOpenCreate = () => {
    setEditingLetter(null);
    setShowModal(true);
  };

  const handleOpenEdit = (letter: CoverLetter) => {
    setEditingLetter(letter);
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
        }}
        initialData={editingLetter}
        onSave={handleSave}
      />
    </div>
  );
}
