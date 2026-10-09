/**
 * Comprehensive technical skill extractor and role detector.
 * Extracts technical competencies from uploaded resume text or builder data
 * and normalizes them for profile syncing and job matching.
 */

export interface ExtractedResumeProfile {
  skills: string[];
  detectedRole?: string;
}

// Canonical tech skills mapped from lower-case keywords / regex patterns
const CANONICAL_TECH_SKILLS: { name: string; pattern: RegExp }[] = [
  // Frontend
  { name: "React", pattern: /\b(react|reactjs|react\.js)\b/i },
  { name: "Next.js", pattern: /\b(next|nextjs|next\.js)\b/i },
  { name: "Vue.js", pattern: /\b(vue|vuejs|vue\.js)\b/i },
  { name: "Angular", pattern: /\b(angular|angularjs)\b/i },
  { name: "Svelte", pattern: /\b(svelte|sveltekit)\b/i },
  { name: "TypeScript", pattern: /\b(typescript|ts)\b/i },
  { name: "JavaScript", pattern: /\b(javascript|js|es6|es2015)\b/i },
  { name: "HTML5", pattern: /\b(html|html5)\b/i },
  { name: "CSS3", pattern: /\b(css|css3)\b/i },
  { name: "Tailwind CSS", pattern: /\b(tailwind|tailwindcss)\b/i },
  { name: "Bootstrap", pattern: /\b(bootstrap)\b/i },
  { name: "Sass", pattern: /\b(sass|scss)\b/i },
  { name: "Redux", pattern: /\b(redux|redux toolkit|rtk)\b/i },
  { name: "Zustand", pattern: /\b(zustand)\b/i },

  // Backend & Languages
  { name: "Node.js", pattern: /\b(node|nodejs|node\.js)\b/i },
  { name: "Express", pattern: /\b(express|expressjs|express\.js)\b/i },
  { name: "NestJS", pattern: /\b(nest|nestjs|nest\.js)\b/i },
  { name: "Python", pattern: /\b(python|py)\b/i },
  { name: "Django", pattern: /\b(django)\b/i },
  { name: "FastAPI", pattern: /\b(fastapi)\b/i },
  { name: "Flask", pattern: /\b(flask)\b/i },
  { name: "Java", pattern: /\b(java|jdk)\b/i },
  { name: "Spring Boot", pattern: /\b(spring|spring boot)\b/i },
  { name: "C#", pattern: /\b(c#|\.net|dotnet)\b/i },
  { name: "Go", pattern: /\b(golang|go language)\b/i },
  { name: "Rust", pattern: /\b(rust)\b/i },
  { name: "PHP", pattern: /\b(php)\b/i },
  { name: "Laravel", pattern: /\b(laravel)\b/i },
  { name: "Ruby on Rails", pattern: /\b(ruby|rails|ruby on rails)\b/i },

  // Mobile
  { name: "React Native", pattern: /\b(react native)\b/i },
  { name: "Flutter", pattern: /\b(flutter|dart)\b/i },
  { name: "Swift", pattern: /\b(swift|ios)\b/i },
  { name: "Kotlin", pattern: /\b(kotlin|android)\b/i },

  // Databases & Storage
  { name: "PostgreSQL", pattern: /\b(postgres|postgresql)\b/i },
  { name: "MySQL", pattern: /\b(mysql)\b/i },
  { name: "MongoDB", pattern: /\b(mongodb|mongo|mongoose)\b/i },
  { name: "Redis", pattern: /\b(redis)\b/i },
  { name: "SQLite", pattern: /\b(sqlite)\b/i },
  { name: "Prisma", pattern: /\b(prisma)\b/i },
  { name: "Drizzle", pattern: /\b(drizzle|drizzle orm)\b/i },
  { name: "GraphQL", pattern: /\b(graphql|apollo)\b/i },
  { name: "REST APIs", pattern: /\b(rest|restful|rest api|rest apis)\b/i },
  { name: "WebSockets", pattern: /\b(websocket|websockets|socket\.io)\b/i },

  // Cloud & DevOps
  { name: "Docker", pattern: /\b(docker|containerization)\b/i },
  { name: "Kubernetes", pattern: /\b(kubernetes|k8s)\b/i },
  { name: "AWS", pattern: /\b(aws|amazon web services|ec2|s3|lambda)\b/i },
  { name: "Google Cloud", pattern: /\b(gcp|google cloud)\b/i },
  { name: "Azure", pattern: /\b(azure|microsoft azure)\b/i },
  { name: "CI/CD", pattern: /\b(ci\/cd|github actions|gitlab ci|jenkins)\b/i },
  { name: "Git", pattern: /\b(git|github|gitlab)\b/i },
  { name: "Linux", pattern: /\b(linux|ubuntu|bash|shell)\b/i },
  { name: "Terraform", pattern: /\b(terraform)\b/i },

  // AI / ML & Data
  {
    name: "Machine Learning",
    pattern: /\b(machine learning|deep learning|ml|ai)\b/i,
  },
  { name: "PyTorch", pattern: /\b(pytorch)\b/i },
  { name: "TensorFlow", pattern: /\b(tensorflow|keras)\b/i },
  { name: "OpenAI", pattern: /\b(openai|chatgpt|llm|langchain)\b/i },

  // Testing & Methodologies
  { name: "Jest", pattern: /\b(jest|vitest)\b/i },
  { name: "Cypress", pattern: /\b(cypress|playwright)\b/i },
  {
    name: "Microservices",
    pattern: /\b(microservices|distributed systems)\b/i,
  },
  { name: "Figma", pattern: /\b(figma|ui\/ux|wireframing)\b/i },
  { name: "Agile / Scrum", pattern: /\b(agile|scrum|jira)\b/i },
];

const COMMON_ROLE_PATTERNS: { name: string; pattern: RegExp }[] = [
  { name: "Full Stack Developer", pattern: /\bfull[\s-]?stack\b/i },
  {
    name: "Frontend Engineer",
    pattern: /\b(frontend|front[\s-]?end|ui[\s-]?developer)\b/i,
  },
  {
    name: "Backend Engineer",
    pattern: /\b(backend|back[\s-]?end|server[\s-]?side)\b/i,
  },
  {
    name: "DevOps Engineer",
    pattern: /\b(devops|site reliability|sre|cloud engineer)\b/i,
  },
  { name: "React Developer", pattern: /\breact[\s-]?(developer|engineer)\b/i },
  { name: "Node.js Developer", pattern: /\bnode[\s-]?(developer|engineer)\b/i },
  {
    name: "Python Developer",
    pattern: /\bpython[\s-]?(developer|engineer)\b/i,
  },
  {
    name: "Mobile Developer",
    pattern:
      /\b(mobile|ios|android|flutter|react native)[\s-]?(developer|engineer)\b/i,
  },
  { name: "Data Engineer", pattern: /\bdata[\s-]?engineer\b/i },
  {
    name: "AI / ML Engineer",
    pattern: /\b(machine learning|ai|ml)[\s-]?engineer\b/i,
  },
  { name: "UI/UX Designer", pattern: /\b(ui[\s/]?ux|product designer)\b/i },
  {
    name: "Software Engineer",
    pattern: /\bsoftware[\s-]?(engineer|developer)\b/i,
  },
];

/**
 * Extracts normalized skills and target role from resume content.
 */
export function extractSkillsAndRoleFromResume(options: {
  rawText?: string;
  builderData?: Record<string, unknown> | null;
  name?: string;
}): ExtractedResumeProfile {
  const { rawText = "", builderData, name = "" } = options;
  const skillsSet = new Map<string, string>(); // lowercase -> canonical

  // 1. Extract from builderData if structured skills are present
  if (builderData && typeof builderData === "object") {
    if (Array.isArray(builderData.skills)) {
      for (const group of builderData.skills) {
        if (
          group &&
          typeof group === "object" &&
          Array.isArray((group as Record<string, unknown>).skills)
        ) {
          for (const s of (group as Record<string, unknown>)
            .skills as unknown[]) {
            if (typeof s === "string" && s.trim()) {
              const cleaned = s.trim();
              skillsSet.set(cleaned.toLowerCase(), cleaned);
            }
          }
        }
      }
    }
  }

  // 2. Scan raw text and title against the canonical tech skills catalog
  const textToScan = `${name} ${rawText}`.toLowerCase();
  for (const tech of CANONICAL_TECH_SKILLS) {
    if (tech.pattern.test(textToScan)) {
      skillsSet.set(tech.name.toLowerCase(), tech.name);
    }
  }

  // 3. Detect candidate target role from resume title or first lines of text
  let detectedRole: string | undefined;

  // Check resume name first
  for (const role of COMMON_ROLE_PATTERNS) {
    if (role.pattern.test(name)) {
      detectedRole = role.name;
      break;
    }
  }

  // Check top 500 characters of resume text
  if (!detectedRole && rawText) {
    const headText = rawText.slice(0, 600);
    for (const role of COMMON_ROLE_PATTERNS) {
      if (role.pattern.test(headText)) {
        detectedRole = role.name;
        break;
      }
    }
  }

  return {
    skills: Array.from(skillsSet.values()),
    detectedRole,
  };
}
