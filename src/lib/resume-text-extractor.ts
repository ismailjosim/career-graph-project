import { PDFParse } from "pdf-parse";
import type { ResumeBuilderData } from "@/lib/validation";

/**
 * Extracts plain text from builderData
 */
export function compileResumeBuilderText(
  data?: ResumeBuilderData | null,
): string {
  if (!data) return "";
  const parts: string[] = [];
  const {
    personalInfo,
    summary,
    experiences,
    educations,
    skillGroups,
    projects,
    certifications,
  } = data;

  if (personalInfo?.fullName) {
    parts.push(personalInfo.fullName);
    if (personalInfo.headline) parts.push(personalInfo.headline);
    const contacts = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
      personalInfo.github,
      personalInfo.website,
    ].filter(Boolean);
    if (contacts.length > 0) parts.push(contacts.join(" | "));
  }

  if (summary) {
    parts.push(`\nPROFESSIONAL SUMMARY\n${summary}`);
  }

  if (experiences && experiences.length > 0) {
    parts.push("\nEXPERIENCE");
    for (const exp of experiences) {
      const line = `${exp.role || "Role"} at ${exp.company || "Company"}${exp.location ? `, ${exp.location}` : ""} (${exp.startDate || ""} - ${exp.isCurrent ? "Present" : exp.endDate || "Present"})`;
      parts.push(line);
      if (exp.description) parts.push(exp.description);
      if (exp.highlights && exp.highlights.length > 0) {
        parts.push(exp.highlights.map((h) => `• ${h}`).join("\n"));
      }
    }
  }

  if (educations && educations.length > 0) {
    parts.push("\nEDUCATION");
    for (const edu of educations) {
      parts.push(
        `${edu.degree || ""}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""} - ${edu.institution || ""} (${edu.startDate || ""} - ${edu.endDate || ""})`,
      );
      if (edu.honors) parts.push(`Honors: ${edu.honors}`);
    }
  }

  if (skillGroups && skillGroups.length > 0) {
    parts.push("\nSKILLS");
    for (const group of skillGroups) {
      if (group.skills && group.skills.length > 0) {
        parts.push(
          `${group.category || "Technical Skills"}: ${group.skills.join(", ")}`,
        );
      }
    }
  }

  if (projects && projects.length > 0) {
    parts.push("\nPROJECTS");
    for (const proj of projects) {
      parts.push(`${proj.title || "Project"}: ${proj.description || ""}`);
      if (proj.techStack && proj.techStack.length > 0) {
        parts.push(`Technologies: ${proj.techStack.join(", ")}`);
      }
    }
  }

  if (certifications && certifications.length > 0) {
    parts.push("\nCERTIFICATIONS");
    for (const cert of certifications) {
      parts.push(
        `${cert.name || "Certification"} - ${cert.issuer || ""} (${cert.date || ""})`,
      );
    }
  }

  return parts.join("\n").trim();
}

/**
 * Fallback regex stream decoder for PDF buffers
 */
function extractTextFromPdfStreamRegex(buffer: Buffer): string {
  try {
    const raw = buffer.toString("binary");
    const textPieces: string[] = [];

    // Match (string) Tj
    const tjMatches = raw.matchAll(/\(([^)]+)\)\s*Tj/g);
    for (const m of tjMatches) {
      if (m[1]) textPieces.push(m[1]);
    }

    // Match [(string)...] TJ
    const tjArrayMatches = raw.matchAll(/\[(.*?)\]\s*TJ/g);
    for (const m of tjArrayMatches) {
      if (m[1]) {
        const inner = m[1].matchAll(/\(([^)]+)\)/g);
        for (const im of inner) {
          if (im[1]) textPieces.push(im[1]);
        }
      }
    }

    const clean = textPieces
      .join(" ")
      .replace(/\\([()\\])/g, "$1")
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return clean;
  } catch {
    return "";
  }
}

/**
 * Extracts plain text from a PDF Buffer
 */
export async function extractTextFromPdfBuffer(
  buffer: Buffer,
): Promise<string> {
  try {
    const parser = new PDFParse({
      data: new Uint8Array(buffer),
      verbosity: 0,
    });
    const result = await parser.getText();
    const text = typeof result === "string" ? result : result?.text || "";

    if (text && text.trim().length > 30) {
      return text.trim();
    }
  } catch (err) {
    console.warn(
      "[PDF Parser] PDFParse error, falling back to stream parsing:",
      err,
    );
  }

  // Fallback to stream regex extraction
  const streamText = extractTextFromPdfStreamRegex(buffer);
  if (streamText && streamText.length > 30) {
    return streamText;
  }

  // Last resort: extract visible ASCII printable strings
  try {
    const str = buffer.toString("utf-8");
    const clean = str
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (clean.length > 50) {
      return clean.slice(0, 10000);
    }
  } catch {
    // ignore
  }

  return "";
}

/**
 * Universally extract resume text from any source:
 * - base64 string
 * - remote URL (Cloudinary / HTTPS)
 * - data URL
 * - raw text
 * - builderData
 */
export async function extractResumeTextUniversal(options: {
  rawText?: string | null;
  fileBase64?: string | null;
  fileUrl?: string | null;
  builderData?: ResumeBuilderData | null;
  fileName?: string | null;
}): Promise<{
  text: string;
  inlinePdfData: { mimeType: string; data: string } | null;
}> {
  const { rawText, fileBase64, fileUrl, builderData, fileName } = options;

  let text = "";
  let inlinePdfData: { mimeType: string; data: string } | null = null;

  // 1. If rawText already exists and has substantial content
  if (rawText && rawText.trim().length > 30) {
    text = rawText.trim();
  }

  // 2. If builderData exists
  if (!text && builderData) {
    text = compileResumeBuilderText(builderData);
  }

  // 3. If fileBase64 is passed (upload mode)
  if (fileBase64) {
    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, "");
    const isPdf =
      fileBase64.includes("application/pdf") ||
      fileName?.toLowerCase().endsWith(".pdf") ||
      cleanBase64.startsWith("JVBERi"); // %PDF- in base64

    if (isPdf) {
      inlinePdfData = {
        mimeType: "application/pdf",
        data: cleanBase64,
      };
      if (!text) {
        try {
          const buffer = Buffer.from(cleanBase64, "base64");
          text = await extractTextFromPdfBuffer(buffer);
        } catch (err) {
          console.warn(
            "[Resume Text Extractor] Failed to extract from fileBase64:",
            err,
          );
        }
      }
    } else if (!text) {
      try {
        text = Buffer.from(cleanBase64, "base64").toString("utf-8");
      } catch {
        text = cleanBase64;
      }
    }
  }

  // 4. If fileUrl is a data URL
  if (fileUrl?.startsWith("data:")) {
    const cleanBase64 = fileUrl.replace(/^data:[^;]+;base64,/, "");
    if (
      fileUrl.includes("application/pdf") ||
      cleanBase64.startsWith("JVBERi")
    ) {
      inlinePdfData = {
        mimeType: "application/pdf",
        data: cleanBase64,
      };
      if (!text) {
        try {
          const buffer = Buffer.from(cleanBase64, "base64");
          text = await extractTextFromPdfBuffer(buffer);
        } catch (err) {
          console.warn(
            "[Resume Text Extractor] Failed to extract from data URL:",
            err,
          );
        }
      }
    } else if (!text) {
      try {
        text = Buffer.from(cleanBase64, "base64").toString("utf-8");
      } catch {
        // ignore
      }
    }
  }

  // 5. If fileUrl is remote URL (e.g. Cloudinary) and text is still empty
  if (!text && fileUrl && fileUrl.startsWith("http")) {
    try {
      const res = await fetch(fileUrl);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        const isPdf =
          fileUrl.toLowerCase().includes(".pdf") ||
          buffer.slice(0, 4).toString() === "%PDF";

        if (isPdf) {
          const base64 = buffer.toString("base64");
          inlinePdfData = {
            mimeType: "application/pdf",
            data: base64,
          };
          text = await extractTextFromPdfBuffer(buffer);
        } else {
          text = buffer.toString("utf-8");
        }
      }
    } catch (err) {
      console.warn(
        "[Resume Text Extractor] Could not fetch remote fileUrl:",
        err,
      );
    }
  }

  return { text: text.trim(), inlinePdfData };
}
