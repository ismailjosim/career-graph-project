import type { CoverLetter } from "@/lib/validation";

/**
 * Filters cover letters by search term matching in title or content.
 */
export function filterCoverLetters(
  letters: CoverLetter[],
  searchTerm: string,
): CoverLetter[] {
  const normalized = searchTerm.trim().toLowerCase();
  if (!normalized) return letters;

  return letters.filter(
    (letter) =>
      letter.title.toLowerCase().includes(normalized) ||
      letter.content.toLowerCase().includes(normalized),
  );
}

/**
 * Formats date into a user-friendly readable string.
 */
export function formatCoverLetterDate(date?: Date | string): string {
  if (!date) return "Recently";
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? "Recently" : d.toLocaleDateString();
}

/**
 * Returns word count and character count for text.
 */
export function getWordAndCharCount(text: string): {
  words: number;
  chars: number;
} {
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return { words, chars };
}
