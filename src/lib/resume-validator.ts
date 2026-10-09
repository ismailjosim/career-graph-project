/**
 * Resume Content Validator
 * Analyzes extracted document text to ensure uploaded files are genuine
 * resumes/CVs rather than arbitrary non-resume documents (e.g., invoices, textbooks, bills, empty PDFs).
 */

export interface ResumeValidationResult {
  isValid: boolean;
  score: number;
  matchedCategories: string[];
  reason?: string;
}

const RESUME_CATEGORY_PATTERNS: Record<string, RegExp[]> = {
  experience: [
    /\b(experience|employment|work history|career history|professional background|work experience|job history)\b/i,
    /\b(responsibilities|achievements|intern|internship|roles? and responsibilities)\b/i,
    /\b(present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4}\s*[-–—]\s*(present|\d{4}))\b/i,
  ],
  education: [
    /\b(education|academic|university|college|school of|institute of|polytechnic)\b/i,
    /\b(degree|bachelor|b\.s|b\.a|master|m\.s|m\.a|ph\.?d|diploma|hsc|ssc|o[- ]level|a[- ]level)\b/i,
    /\b(major|minor|gpa|cgpa|graduated|graduation|coursework)\b/i,
  ],
  skills: [
    /\b(skills?|technical skills?|core competencies|tools? & technologies|tech stack|proficienc(y|ies))\b/i,
    /\b(javascript|typescript|python|react|node|html|css|sql|git|docker|aws|c\+\+|java|c#|figma|tailwind)\b/i,
    /\b(languages?|frameworks?|libraries|methodologies)\b/i,
  ],
  contact: [
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // email pattern
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/, // phone pattern
    /\b(linkedin\.com|github\.com|portfolio|contact|phone|mobile|address)\b/i,
  ],
  summary: [
    /\b(professional summary|summary of qualifications|profile|about me|career objective|executive summary)\b/i,
  ],
  projects: [
    /\b(projects?|personal projects?|key projects?|portfolio projects?|open source)\b/i,
  ],
};

/**
 * Validates whether the given plain text corresponds to a genuine resume/CV.
 */
export function validateResumeContent(text: string): ResumeValidationResult {
  const cleanText = (text || "").trim();

  // 1. Minimum length requirement: Resumes must have readable text (> 120 characters)
  if (cleanText.length < 120) {
    return {
      isValid: false,
      score: 0,
      matchedCategories: [],
      reason:
        "The uploaded PDF has insufficient readable text. Please ensure the document is not an image-only scan or empty page, and contains readable resume text.",
    };
  }

  // Count word count (must have at least 25 words)
  const words = cleanText.split(/\s+/).filter(Boolean);
  if (words.length < 25) {
    return {
      isValid: false,
      score: 5,
      matchedCategories: [],
      reason:
        "The uploaded file is too brief to be a complete resume. A valid resume must contain your experience, education, or skills.",
    };
  }

  const matchedCategories: string[] = [];

  for (const [category, patterns] of Object.entries(RESUME_CATEGORY_PATTERNS)) {
    const hasMatch = patterns.some((p) => p.test(cleanText));
    if (hasMatch) {
      matchedCategories.push(category);
    }
  }

  // Calculate matching score out of 100
  const score = Math.min(100, Math.round((matchedCategories.length / 6) * 100));

  // Must match at least 2 key categories (e.g. experience + education, or skills + contact, etc.)
  const hasStrongSections =
    matchedCategories.includes("experience") ||
    matchedCategories.includes("education") ||
    matchedCategories.includes("skills");

  if (matchedCategories.length >= 2 && hasStrongSections) {
    return {
      isValid: true,
      score: Math.max(score, 60),
      matchedCategories,
    };
  }

  return {
    isValid: false,
    score,
    matchedCategories,
    reason:
      "The uploaded document does not appear to be a valid resume or CV. Please upload a PDF document that clearly includes your work experience, education, and skills.",
  };
}
