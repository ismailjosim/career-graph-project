import { ResumeCard } from "./ResumeCard";
import { ResumeEmptyState } from "./ResumeEmptyState";
import type { ResumeListProps } from "./types";

export function ResumeList({
  resumes,
  onSetDefault,
  onDelete,
  onResetSearch,
  onAddResume,
}: ResumeListProps) {
  if (resumes.length === 0) {
    return (
      <ResumeEmptyState
        hasSearch={Boolean(onResetSearch)}
        onResetSearch={onResetSearch}
        onAddResume={onAddResume}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {resumes.map((resume) => (
        <ResumeCard
          key={resume._id}
          resume={resume}
          onSetDefault={onSetDefault}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
