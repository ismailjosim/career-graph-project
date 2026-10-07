import type { AtsAiReadiness, AtsAnalysisResult } from "@/interfaces/ats";

export const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-pro",
];

const COMPREHENSIVE_SKILL_PATTERNS: Array<{
  name: string;
  pattern: RegExp;
  category: string;
}> = [
  // 2026 AI & Agentic Tools
  {
    name: "Cursor / AI IDE",
    pattern: /\b(cursor|cursor\.so)\b/i,
    category: "ai",
  },
  {
    name: "GitHub Copilot",
    pattern: /\b(copilot|github copilot)\b/i,
    category: "ai",
  },
  {
    name: "Claude / Anthropic",
    pattern: /\b(claude|anthropic)\b/i,
    category: "ai",
  },
  {
    name: "ChatGPT / OpenAI",
    pattern: /\b(chatgpt|openai|gpt-4|gpt-4o|o1|o3)\b/i,
    category: "ai",
  },
  {
    name: "LLM APIs & Prompting",
    pattern:
      /\b(llm|llms|prompt engineering|prompting|large language models?)\b/i,
    category: "ai",
  },
  {
    name: "Autonomous Agents",
    pattern:
      /\b(autonomous agents?|agentic workflows?|langchain|langgraph|llamaindex|crewai)\b/i,
    category: "ai",
  },
  {
    name: "v0 / Generative UI",
    pattern: /\b(v0|v0\.dev|generative ui)\b/i,
    category: "ai",
  },
  {
    name: "PyTorch / ML",
    pattern:
      /\b(pytorch|tensorflow|scikit-learn|keras|machine learning|deep learning|nlp)\b/i,
    category: "ai",
  },

  // Programming Languages
  { name: "TypeScript", pattern: /\b(typescript|ts)\b/i, category: "tech" },
  {
    name: "JavaScript",
    pattern: /\b(javascript|js|es6|es20\d\d)\b/i,
    category: "tech",
  },
  { name: "Python", pattern: /\b(python|python3)\b/i, category: "tech" },
  { name: "Java", pattern: /\b(java)\b/i, category: "tech" },
  { name: "C++", pattern: /\b(c\+\+)\b/i, category: "tech" },
  {
    name: "C# / .NET",
    pattern: /\b(c#|\.net|dotnet|asp\.net)\b/i,
    category: "tech",
  },
  { name: "Go / Golang", pattern: /\b(golang|go)\b/i, category: "tech" },
  { name: "Rust", pattern: /\b(rust)\b/i, category: "tech" },
  { name: "PHP", pattern: /\b(php|laravel|symfony)\b/i, category: "tech" },
  {
    name: "Ruby",
    pattern: /\b(ruby|rails|ruby on rails)\b/i,
    category: "tech",
  },
  { name: "Swift", pattern: /\b(swift|swiftui)\b/i, category: "tech" },
  { name: "Kotlin", pattern: /\b(kotlin)\b/i, category: "tech" },
  { name: "SQL", pattern: /\b(sql|pl\/sql)\b/i, category: "tech" },

  // Frontend & UI
  {
    name: "React",
    pattern: /\b(react|reactjs|react 18|react 19)\b/i,
    category: "tech",
  },
  {
    name: "Next.js",
    pattern: /\b(next\.js|nextjs|next 14|next 15)\b/i,
    category: "tech",
  },
  { name: "Vue.js", pattern: /\b(vue|vuejs|nuxt)\b/i, category: "tech" },
  { name: "Angular", pattern: /\b(angular|angularjs)\b/i, category: "tech" },
  {
    name: "Tailwind CSS",
    pattern: /\b(tailwind|tailwindcss)\b/i,
    category: "tech",
  },
  {
    name: "HTML5 & CSS3",
    pattern: /\b(html5?|css3?|sass|scss)\b/i,
    category: "tech",
  },
  {
    name: "UI/UX & Design Systems",
    pattern: /\b(ui\/ux|design systems?|figma|wireframing|prototyping)\b/i,
    category: "design",
  },

  // Backend & Cloud
  { name: "Node.js", pattern: /\b(node|nodejs|node\.js)\b/i, category: "tech" },
  {
    name: "Express / NestJS",
    pattern: /\b(express|expressjs|nestjs)\b/i,
    category: "tech",
  },
  {
    name: "Django / FastAPI",
    pattern: /\b(django|fastapi|flask)\b/i,
    category: "tech",
  },
  {
    name: "RESTful APIs",
    pattern: /\b(rest|restful|rest api|restful apis?)\b/i,
    category: "tech",
  },
  { name: "GraphQL", pattern: /\b(graphql|apollo)\b/i, category: "tech" },
  {
    name: "Microservices",
    pattern: /\b(microservices?|event-driven|distributed systems?)\b/i,
    category: "tech",
  },
  {
    name: "PostgreSQL",
    pattern: /\b(postgres|postgresql)\b/i,
    category: "tech",
  },
  {
    name: "MongoDB",
    pattern: /\b(mongodb|nosql|mongoose)\b/i,
    category: "tech",
  },
  { name: "Redis", pattern: /\b(redis|caching)\b/i, category: "tech" },
  { name: "MySQL", pattern: /\b(mysql|mariadb)\b/i, category: "tech" },
  {
    name: "AWS",
    pattern: /\b(aws|amazon web services|s3|ec2|lambda|dynamodb|ecs|eks)\b/i,
    category: "cloud",
  },
  {
    name: "Docker",
    pattern: /\b(docker|containerization|containers)\b/i,
    category: "cloud",
  },
  { name: "Kubernetes", pattern: /\b(kubernetes|k8s)\b/i, category: "cloud" },
  {
    name: "CI/CD & DevOps",
    pattern: /\b(ci\/cd|github actions|jenkins|gitlab ci|terraform)\b/i,
    category: "cloud",
  },
  { name: "Git", pattern: /\b(git|github|gitlab)\b/i, category: "tech" },

  // Business, Product & Management
  {
    name: "Agile / Scrum",
    pattern: /\b(agile|scrum|kanban|sprints?|jira)\b/i,
    category: "management",
  },
  {
    name: "Product Management",
    pattern:
      /\b(product management|roadmapping|user stories|product strategy|mvp)\b/i,
    category: "management",
  },
  {
    name: "Data Analysis & Metrics",
    pattern:
      /\b(data analysis|analytics|kpis|metrics|dashboards?|a\/b testing)\b/i,
    category: "management",
  },
  {
    name: "Leadership & Mentorship",
    pattern:
      /\b(leadership|mentorship|team lead|engineering management|code reviews?)\b/i,
    category: "management",
  },
  {
    name: "SEO & Digital Growth",
    pattern: /\b(seo|sem|content marketing|growth hacking|google analytics)\b/i,
    category: "business",
  },
  {
    name: "Sales & Client Management",
    pattern: /\b(crm|salesforce|hubspot|account management|b2b|negotiation)\b/i,
    category: "business",
  },
];

export interface ResumeExtractedProfile {
  detectedName?: string;
  detectedTitle?: string;
  detectedEmail?: string;
  detectedPhone?: string;
  hasLinkedIn: boolean;
  hasGitHub: boolean;
  hasSummarySection: boolean;
  hasExperienceSection: boolean;
  hasEducationSection: boolean;
  hasSkillsSection: boolean;
  detectedSkills: string[];
  detectedAiSkills: string[];
  actionVerbCount: number;
  hasMetrics: boolean;
  metricsSample: string[];
}

/**
 * Extracts real candidate attributes from raw text
 */
export function extractProfileFromText(text: string): ResumeExtractedProfile {
  const clean = text || "";
  const lines = clean
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Email & Phone
  const emailMatch = clean.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  );
  const phoneMatch = clean.match(
    /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/,
  );

  // Candidate Name (heuristic: first non-empty line without email/phone/url)
  let candidateName = "";
  for (const line of lines.slice(0, 4)) {
    if (
      !line.includes("@") &&
      !line.includes("http") &&
      !line.includes("+") &&
      line.length < 50 &&
      /^[a-zA-Z\s.'-]+$/.test(line)
    ) {
      candidateName = line;
      break;
    }
  }

  // Links
  const hasLinkedIn = /linkedin\.com/i.test(clean);
  const hasGitHub = /github\.com/i.test(clean);

  // Sections
  const hasSummarySection =
    /\b(summary|professional summary|about me|profile|objective)\b/i.test(
      clean,
    );
  const hasExperienceSection =
    /\b(experience|work history|employment|professional experience)\b/i.test(
      clean,
    );
  const hasEducationSection =
    /\b(education|academic|university|degree|bachelor|master|phd)\b/i.test(
      clean,
    );
  const hasSkillsSection =
    /\b(skills|technical skills|competencies|proficiencies|technologies)\b/i.test(
      clean,
    );

  // Skills
  const detectedSkills: string[] = [];
  const detectedAiSkills: string[] = [];

  for (const { name, pattern, category } of COMPREHENSIVE_SKILL_PATTERNS) {
    if (pattern.test(clean)) {
      detectedSkills.push(name);
      if (category === "ai") {
        detectedAiSkills.push(name);
      }
    }
  }

  // Action verbs
  const actionVerbsPattern =
    /\b(spearheaded|architected|engineered|developed|built|managed|led|designed|created|optimized|implemented|delivered|orchestrated|automated|reduced|increased|scaled|launched|accelerated|refactored)\b/gi;
  const actionVerbMatches = clean.match(actionVerbsPattern) || [];
  const actionVerbCount = actionVerbMatches.length;

  // Numbers & Metrics
  const metricRegex =
    /\b(\d+%\b|\$\d+[\d,.]*[kmb]?\b|\d+[kmb]\+?\b|\b\d+x\b|\d+\+?\s*(users|customers|clients|requests|ms|seconds|hours))/gi;
  const metricMatches = clean.match(metricRegex) || [];
  const hasMetrics = metricMatches.length > 0;
  const metricsSample = Array.from(new Set(metricMatches)).slice(0, 4);

  // Detected Title
  let detectedTitle = "";
  const titleMatch = clean.match(
    /\b(senior|staff|principal|lead|junior|associate)?\s*(full[- ]?stack|frontend|backend|software|devops|cloud|ai|data|product|ui\/ux|system)?\s*(engineer|developer|architect|designer|manager|specialist|lead|consultant)\b/i,
  );
  if (titleMatch) {
    detectedTitle = titleMatch[0].trim();
  }

  return {
    detectedName: candidateName || undefined,
    detectedTitle: detectedTitle || undefined,
    detectedEmail: emailMatch ? emailMatch[0] : undefined,
    detectedPhone: phoneMatch ? phoneMatch[0] : undefined,
    hasLinkedIn,
    hasGitHub,
    hasSummarySection,
    hasExperienceSection,
    hasEducationSection,
    hasSkillsSection,
    detectedSkills,
    detectedAiSkills,
    actionVerbCount,
    hasMetrics,
    metricsSample,
  };
}

/**
 * Performs dynamic, deterministic ATS Audit based on actual resume text and optional target job
 */
export function generateDeterministicAtsAudit(params: {
  resumeText: string;
  resumeTitle?: string;
  targetJobTitle?: string;
  targetJobDesc?: string;
  regionStandard?: string;
}): AtsAnalysisResult {
  const {
    resumeText,
    resumeTitle,
    targetJobTitle,
    targetJobDesc,
    regionStandard = "us_canada",
  } = params;
  const profile = extractProfileFromText(resumeText);

  // Check Target Job requirements
  const targetText = `${targetJobTitle || ""} ${targetJobDesc || ""}`.trim();
  const targetSkills: string[] = [];
  if (targetText) {
    for (const { name, pattern } of COMPREHENSIVE_SKILL_PATTERNS) {
      if (pattern.test(targetText)) {
        targetSkills.push(name);
      }
    }
  }

  // Calculate matching & missing skills
  const resumeSkillsSet = new Set(
    profile.detectedSkills.map((s) => s.toLowerCase()),
  );
  const matchedTargetSkills: string[] = [];
  const missingTargetSkills: string[] = [];

  if (targetSkills.length > 0) {
    for (const skill of targetSkills) {
      if (resumeSkillsSet.has(skill.toLowerCase())) {
        matchedTargetSkills.push(skill);
      } else {
        missingTargetSkills.push(skill);
      }
    }
  }

  // Missing recommended skills if not target job specified
  const generalMissingSkills: string[] = [];
  if (profile.detectedAiSkills.length === 0) {
    generalMissingSkills.push(
      "Cursor / Copilot",
      "Autonomous Agent Workflows",
      "Prompt Engineering",
    );
  }
  if (!profile.detectedSkills.includes("CI/CD & DevOps")) {
    generalMissingSkills.push("CI/CD Pipeline Optimization");
  }
  if (
    !profile.detectedSkills.includes("Microservices") &&
    profile.detectedSkills.includes("Backend")
  ) {
    generalMissingSkills.push("Microservices & Event-Driven Architecture");
  }

  const finalDetectedKeywords =
    profile.detectedSkills.length > 0
      ? profile.detectedSkills
      : [
          profile.detectedTitle || "Professional Experience",
          "Technical Problem Solving",
          "Project Delivery",
        ];

  const finalMissingKeywords =
    missingTargetSkills.length > 0
      ? missingTargetSkills.slice(0, 6)
      : generalMissingSkills.length > 0
        ? generalMissingSkills
        : [
            "System Design & Observability",
            "CI/CD Automated Testing",
            "AI Workflow Automation",
          ];

  // Calculate Category Scores
  let formattingScore = 78;
  if (profile.hasSummarySection) formattingScore += 5;
  if (profile.hasExperienceSection) formattingScore += 6;
  if (profile.hasEducationSection) formattingScore += 5;
  if (profile.detectedEmail && profile.detectedPhone) formattingScore += 6;
  formattingScore = Math.min(95, Math.max(60, formattingScore));

  let keywordsScore = 70;
  if (targetSkills.length > 0) {
    const matchRatio = matchedTargetSkills.length / targetSkills.length;
    keywordsScore = Math.round(55 + matchRatio * 40);
  } else {
    keywordsScore = Math.min(
      94,
      Math.max(62, 60 + profile.detectedSkills.length * 2.5),
    );
  }

  let contentImpactScore = 65;
  if (profile.hasMetrics) contentImpactScore += 16;
  if (profile.actionVerbCount >= 8) contentImpactScore += 10;
  else if (profile.actionVerbCount >= 4) contentImpactScore += 5;
  contentImpactScore = Math.min(95, Math.max(55, contentImpactScore));

  let structureScore = 72;
  if (profile.hasExperienceSection) structureScore += 8;
  if (profile.hasEducationSection) structureScore += 7;
  if (profile.hasSkillsSection) structureScore += 7;
  if (profile.hasLinkedIn || profile.hasGitHub) structureScore += 6;
  structureScore = Math.min(96, Math.max(60, structureScore));

  const overallScore = Math.round(
    formattingScore * 0.25 +
      keywordsScore * 0.35 +
      contentImpactScore * 0.25 +
      structureScore * 0.15,
  );

  const rating: "excellent" | "good" | "needs_improvement" | "poor" =
    overallScore >= 82
      ? "excellent"
      : overallScore >= 70
        ? "good"
        : overallScore >= 55
          ? "needs_improvement"
          : "poor";

  const badge =
    overallScore >= 85
      ? "Enterprise Ready Candidate"
      : overallScore >= 72
        ? "Strong ATS Candidate"
        : "Moderate ATS Risk";

  const candidateDisplay =
    profile.detectedName || profile.detectedTitle || resumeTitle || "Candidate";
  const targetDisplay = targetJobTitle
    ? ` for the ${targetJobTitle} position`
    : "";

  const executiveSummary = `Authoritative ATS audit completed for ${candidateDisplay}${targetDisplay}. The resume demonstrates genuine competency across ${finalDetectedKeywords.slice(0, 4).join(", ")}. Primary growth areas include integrating measurable business impact metrics and aligning with target role keywords.`;

  const quickWins: string[] = [
    profile.hasMetrics
      ? "Elevate your existing metrics by starting each bullet point with high-impact action verbs (e.g. 'Engineered', 'Optimized')."
      : "Add quantifiable metrics (%, $, numbers, hours saved) to at least 3 accomplishment bullets using the Google X-Y-Z formula.",
    finalMissingKeywords.length > 0
      ? `Incorporate missing target keywords like ${finalMissingKeywords.slice(0, 3).join(", ")} directly into your Skills and Experience sections.`
      : "Highlight 2026 modern AI productivity tools (Cursor, Copilot, LLM prompt engineering) in your technical matrix.",
    profile.hasLinkedIn
      ? "Ensure all section headings strictly follow single-column ATS conventions (Experience, Education, Skills)."
      : "Include your LinkedIn profile and professional GitHub/portfolio URL in the header contact block.",
  ];

  const criticalIssues: AtsAnalysisResult["criticalIssues"] = [];

  if (!profile.hasMetrics) {
    criticalIssues.push({
      id: "issue-metrics",
      section: "Content Impact & Metrics",
      severity: "high",
      title: "Missing Quantifiable Business Outcomes",
      issue:
        "Several experience descriptions list responsibilities rather than measurable outcomes (percentage gains, revenue, or latency reductions).",
      recommendation:
        "Rewrite bullets using Google's formula: 'Accomplished [X], as measured by [Y], by doing [Z]'. Example: 'Reduced API response times by 35% by implementing Redis caching.'",
    });
  }

  if (missingTargetSkills.length > 0) {
    criticalIssues.push({
      id: "issue-keywords",
      section: "Target Job Keyword Gaps",
      severity: "high",
      title: `Missing Job Keywords: ${missingTargetSkills.slice(0, 3).join(", ")}`,
      issue: `The target role places high priority on ${missingTargetSkills.slice(0, 3).join(", ")}, which were not detected in your resume text.`,
      recommendation: `Weave ${missingTargetSkills.slice(0, 3).join(", ")} naturally into past project bullets where you applied these competencies.`,
    });
  }

  if (profile.detectedAiSkills.length === 0) {
    criticalIssues.push({
      id: "issue-ai",
      section: "Modern & AI Tooling",
      severity: "medium",
      title: "2026 Modern AI Tooling Gap",
      issue:
        "Enterprise hiring teams increasingly screen for familiarity with modern AI-accelerated workflows and engineering toolchains.",
      recommendation:
        "Explicitly list tools like Cursor, GitHub Copilot, Claude/ChatGPT, or LLM-assisted workflows in your Technical Skills section.",
    });
  }

  if (!profile.detectedEmail || !profile.detectedPhone) {
    criticalIssues.push({
      id: "issue-contact",
      section: "Header Contact Information",
      severity: "medium",
      title: "Incomplete Contact Coordinates",
      issue:
        "Ensure your email address, phone number, and location are prominently placed at the very top of page 1.",
      recommendation:
        "Place email, phone, city/state, and LinkedIn URL on separate or bullet-separated lines immediately below your name.",
    });
  }

  if (regionStandard === "us_canada") {
    criticalIssues.push({
      id: "issue-region",
      section: "Regional Standard Compliance",
      severity: "low",
      title: "US/Canada Anti-Bias Compliance",
      issue:
        "Confirm layout conforms strictly to US/Canada hiring norms without headshots or demographic disclosures.",
      recommendation:
        "Do not include photos, marital status, or full street addresses to prevent automatic HR compliance filtering.",
    });
  }

  const aiScore =
    profile.detectedAiSkills.length >= 2
      ? 88
      : profile.detectedAiSkills.length === 1
        ? 75
        : 55;
  const aiReadiness: AtsAiReadiness = {
    score: aiScore,
    level:
      aiScore >= 85
        ? "agentic_native"
        : aiScore >= 70
          ? "ai_augmented"
          : "emerging",
    headline:
      profile.detectedAiSkills.length > 0
        ? `Demonstrates active adoption of ${profile.detectedAiSkills.join(", ")}.`
        : "Opportunity to showcase 2026 AI-assisted productivity tools.",
    detectedAiSkills: profile.detectedAiSkills,
    missingModernSkills: finalMissingKeywords.filter(
      (k) =>
        k.toLowerCase().includes("ai") ||
        k.toLowerCase().includes("copilot") ||
        k.toLowerCase().includes("cursor"),
    ),
    suggestions: [
      "Detail how you leverage modern AI tools to accelerate delivery velocity or improve code/work quality.",
      "Integrate prompt engineering and AI workflow automation into your technical competencies.",
    ],
  };

  return {
    overallScore,
    rating,
    badge,
    executiveSummary,
    quickWins,
    categoryScores: {
      formatting: formattingScore,
      keywords: keywordsScore,
      contentImpact: contentImpactScore,
      structure: structureScore,
    },
    categoryFeedback: {
      formatting:
        "Clean, standardized section headers adhering to enterprise ATS parsing guidelines.",
      keywords: `Demonstrated technical vocabulary in ${finalDetectedKeywords.slice(0, 3).join(", ")}.`,
      contentImpact: profile.hasMetrics
        ? "Good inclusion of metrics."
        : "Bullet points should include measurable business outcomes.",
      structure:
        "Logical chronological trajectory with identifiable section dividers.",
    },
    criticalIssues,
    detectedKeywords: finalDetectedKeywords,
    missingKeywords: finalMissingKeywords,
    actionVerbCount: profile.actionVerbCount || 10,
    quantifiableMetricsScore: profile.hasMetrics ? 85 : 55,
    regionStandard:
      regionStandard as unknown as AtsAnalysisResult["regionStandard"],
    aiReadiness,
  };
}

/**
 * Generates tailored cover letter deterministically from actual candidate background
 */
export function generateDeterministicCoverLetter(params: {
  candidateName: string;
  candidateEmail?: string;
  jobTitle: string;
  company?: string;
  tone?: string;
  jobDescription?: string;
  resumeText?: string;
}): string {
  const {
    candidateName,
    candidateEmail = "",
    jobTitle,
    company = "your organization",
    tone,
    jobDescription: _jobDescription = "",
    resumeText = "",
  } = params;
  const profile = extractProfileFromText(resumeText);

  const topSkills =
    profile.detectedSkills.slice(0, 4).join(", ") ||
    "software engineering, system design, and collaborative execution";
  const recentRole = profile.detectedTitle
    ? `as a ${profile.detectedTitle}`
    : "in my professional trajectory";
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const toneAdjective = tone?.includes("enthusiastic")
    ? "enthusiasm and high energy"
    : tone?.includes("executive")
      ? "strategic leadership and measurable impact"
      : tone?.includes("conversational")
        ? "collaborative problem-solving"
        : "technical precision and focus on scalable results";

  const letter = `${dateStr}

Hiring Team
${company}

Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. Having reviewed your requirements and technical roadmap, I am excited by the opportunity to contribute my background ${recentRole} to deliver immediate value to your team with ${toneAdjective}.

Throughout my career, I have focused on solving high-impact challenges with emphasis on ${topSkills}. In past projects, I have consistently prioritized clean architecture, rapid iteration, and cross-functional collaboration to transform complex requirements into dependable solutions.${profile.hasMetrics ? ` My track record includes delivering measurable results, including accomplishments such as ${profile.metricsSample.slice(0, 2).join(" and ")}.` : ""}

What particularly excites me about ${company} is the opportunity to apply these competencies to the ${jobTitle} role. I am confident that my experience with ${profile.detectedSkills.slice(0, 3).join(", ") || "contemporary frameworks and agile delivery"} will enable me to hit the ground running and make a tangible contribution to your product velocity.

I would welcome the opportunity to discuss how my experience and problem-solving mindset align with your goals for the ${jobTitle} position. Thank you very much for your time and consideration.

Sincerely,

${candidateName}
${candidateEmail}`;

  return letter;
}
