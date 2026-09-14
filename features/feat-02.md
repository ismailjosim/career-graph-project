# feat-02: Interactive AI Resume Builder & Live ATS Side-by-Side Editor

## 1. Executive Summary

In the current Career Graph application, users can upload existing PDF/Text resumes to check their ATS score or run a fit analysis. However, **users cannot edit, create, or re-structure their resumes natively in the app**, forcing them to bounce back and forth between Microsoft Word, Google Docs, and Career Graph.

**feat-02** introduces the **Interactive AI Resume Architect & Live ATS Side-by-Side Editor**, giving candidates:
1. **Side-by-Side Split View**: Structured form & rich-text editor on the left; real-time pixel-perfect, ATS-compliant rendered preview on the right.
2. **STAR Method Bullet Enhancer**: Generates high-impact bullet points adhering to Google's standard: `[Accomplished X] as measured by [Y], by doing [Z]`.
3. **Dynamic Keyword Density Gauge**: Real-time ticker comparing the resume against any selected target job posting; keywords illuminate in real-time as the candidate types.
4. **Version Control per Application**: Create and manage customized resume variants (e.g., *"Resume - Frontend Vercel"*, *"Resume - Backend Stripe"*).
5. **Multi-Format ATS Export**: 1-click export to parseable PDF, DOCX, and LaTeX.

---

## 2. Competitive Advantage (Why This Outshines the Market)

- **Jobscan Comparison**: Jobscan costs $89/quarter, has a clunky interface, and forces users to upload files repeatedly rather than providing a seamless live builder.
- **Rezi Comparison**: Rezi offers resume generation but lacks integration with an active job portal, application tracking Kanban, and token pay-as-you-go pricing.
- **The Career Graph Differentiator**:
  - Direct 1-click connection between **Job Portal** postings and the builder.
  - Generates bullet points using Gemini 2.5 with industry-specific vocabulary and realistic quantification metrics.
  - Zero formatting traps: uses battle-tested ATS single-column templates guaranteed to score 95%+ parseability on Workday, Taleo, and Greenhouse.

---

## 3. UI/UX & Live Side-by-Side Architecture

```
+-----------------------------------------------------------------------------------------------+
| Career Graph Resume Architect: Senior Frontend Engineer (Target: Stripe - 10 Tokens)           |
+------------------------------------+----------------------------------------------------------+
| LEFT PANEL: Interactive Sections   | RIGHT PANEL: Live ATS Preview & Dynamic Score            |
|                                    |                                                          |
| [Header] [Summary] [Experience]    | +------------------------------------------------------+ |
| [Projects] [Skills] [Education]    | | Live ATS Match Score: 88/100 (▲ +14 pts)             | |
|                                    | | Matching: TypeScript (✓), React (✓), Kafka (✓)       | |
| Experience Item 1: Stripe          | | Missing: Distributed Ledgers (✗), Idempotency (✗)    | |
| Role: Senior Software Engineer     | +------------------------------------------------------+ |
| Period: 2023 - Present             |                                                          |
|                                    |  ALEXANDER WRIGHT                                        |
| Bullet Points:                     |  San Francisco, CA • alex@email.com • linkedin.com/in/.. |
| * Architected core payment ledger  |  ------------------------------------------------------- |
|                                    |  PROFESSIONAL SUMMARY                                    |
| [ ✨ AI Rewrite with STAR Method ] |  Results-driven Senior Full Stack Engineer with 6+ years |
| Suggestion:                        |  of experience architecting scalable distributed web...  |
| "Engineered fault-tolerant ledger  |                                                          |
|  reducing transaction latency by   |  EXPERIENCE                                              |
|  24% and processing $10M+ daily"   |  Stripe — Senior Software Engineer (2023 - Present)      |
| [ Accept & Insert ] [ Try Another ]|  • Engineered fault-tolerant ledger reducing transaction|
|                                    |    latency by 24% and processing $10M+ daily volume.    |
| + Add Another Bullet               |  • ...                                                   |
+------------------------------------+----------------------------------------------------------+
```

---

## 4. Technical Specifications & Data Models

### 4.1 Resume Schema (`src/lib/models.ts`)
Enhance the existing `Resume` model to support full structured JSON alongside the compiled PDF:

```typescript
export interface IResumeStructured {
  _id?: string;
  userId: string;
  name: string; // e.g., "Full Stack - Stripe Variant"
  isDefault: boolean;
  targetJobId?: string; // Link to JobPosting or Wishlist
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string; // or "Present"
    current: boolean;
    bulletPoints: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    frameworks: string[];
    tools: string[];
    softSkills: string[];
  };
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    bulletPoints: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  theme: {
    fontFamily: "Inter" | "Merriweather" | "Roboto" | "Geist";
    fontSize: "small" | "medium" | "large";
    spacing: "compact" | "normal" | "spacious";
  };
  atsScoreCached?: number;
  updatedAt: Date;
}
```

### 4.2 PDF Generation Engine
- Use `@react-pdf/renderer` or server-side Headless Chromium (`puppeteer-core` / `@sparticuz/chromium`) for zero-layout-drift PDF generation.
- Standard ATS rules enforced:
  - Standard system fonts or cleanly embedded Google Fonts.
  - Single column hierarchy with standard section titles (`Experience`, `Education`, `Skills`).
  - No tables, multi-column CSS grids, text boxes, or floating icon graphics that confuse legacy ATS parsers (Taleo/iCIMS).

### 4.3 AI STAR Bullet Generator API
- **Endpoint**: `POST /api/ai/resume/enhance-bullet`
- **Cost**: 2 tokens per 3 generated variations.
- **Prompt Architecture**:
  - Input: Raw bullet point + target job title + industry domain.
  - Rule: Output must start with a power action verb, specify context, include a plausible metric placeholder, and declare the business impact.

---

## 5. Token Economy & Monetization
- **Creating/Editing Resumes**: Free unlimited creation.
- **AI STAR Bullet Optimization**: 2 tokens per generation request.
- **1-Click Full Resume Tailor against Job**: 15 tokens (analyzes job requirements, inserts relevant keywords, reorders bullets by relevance).
- **High-Resolution PDF / DOCX Download**: Included.

---

## 6. Implementation Steps
1. **Week 1**: Build the structured resume JSON schema, form builder UI components (Contact, Experience, Skills), and state manager.
2. **Week 2**: Build the live preview renderer with CSS print stylesheet and `@react-pdf/renderer`.
3. **Week 3**: Implement the dynamic ATS keyword counter and real-time match percentage against any job selected from `/jobs`.
4. **Week 4**: Connect the Gemini AI STAR bullet optimizer and 1-Click Tailor action.
5. **Week 5**: Add variant cloning (`"Create Tailored Variant for Job..."`) and export functionality.
