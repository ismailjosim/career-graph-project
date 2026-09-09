import { type NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.replace(
  /^["']|["']$/g,
  "",
).trim();

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const cleanHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, " ")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
};

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A valid job post URL is required" },
        { status: 400 },
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    let pageText = "";
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            error: `Unable to access link (Status ${response.status}). Many job boards like LinkedIn protect listings behind logins. Please copy and paste the job description text directly.`,
          },
          { status: 200 },
        );
      }

      const html = await response.text();
      pageText = cleanHtml(html).slice(0, 15000);
    } catch (_fetchErr) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not fetch the URL due to network or anti-bot restrictions. Please copy and paste the job description directly.",
        },
        { status: 200 },
      );
    }

    if (!pageText || pageText.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No readable job content found at this link. Please paste the job description directly.",
        },
        { status: 200 },
      );
    }

    // Call Gemini to parse and extract structured job info
    const prompt = `You are an expert AI parser. Below is the text scraped from a job post URL (${parsedUrl.hostname}).
Extract the key job details into a clean JSON object.

Text:
"""
${pageText}
"""

Return a JSON object with this exact structure:
{
  "title": "Job Title (e.g., Senior Full Stack Engineer)",
  "company": "Company Name",
  "location": "Job Location or Remote",
  "employmentType": "Full-time, Part-time, Contract, etc.",
  "description": "Comprehensive job description including role overview, responsibilities, technical requirements, and qualifications."
}`;

    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("[Extract Job] Gemini call failed:", errText);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to extract job details via AI. Please paste manually.",
        },
        { status: 200 },
      );
    }

    const geminiData = await geminiRes.json();
    const rawContent =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(rawContent);

    return NextResponse.json({
      success: true,
      data: {
        title: parsed.title || "Job Posting",
        company: parsed.company || "Company",
        location: parsed.location || "Not specified",
        employmentType: parsed.employmentType || "Full-time",
        description: parsed.description || pageText.slice(0, 1000),
      },
    });
  } catch (error) {
    console.error("Error in extract-job route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "An unexpected error occurred while parsing the job link. Please copy and paste the description.",
      },
      { status: 500 },
    );
  }
}
