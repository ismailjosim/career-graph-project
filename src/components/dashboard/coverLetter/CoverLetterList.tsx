import { CoverLetterCard } from "./CoverLetterCard";
import { CoverLetterEmptyState } from "./CoverLetterEmptyState";
import type { CoverLetterListProps } from "./types";

export function CoverLetterList({
  letters,
  onEdit,
  onDelete,
  onResetSearch,
  onNewLetter,
}: CoverLetterListProps) {
  if (letters.length === 0) {
    return (
      <CoverLetterEmptyState
        hasSearch={Boolean(onResetSearch)}
        onResetSearch={onResetSearch}
        onNewLetter={onNewLetter}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {letters.map((letter) => (
        <CoverLetterCard
          key={letter._id}
          letter={letter}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
