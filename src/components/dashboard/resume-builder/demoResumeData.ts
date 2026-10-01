import type { ResumeBuilderData } from "./types";

export const EMPTY_RESUME_DATA: ResumeBuilderData = {
  personalInfo: {
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  experiences: [],
  educations: [],
  skillGroups: [
    { category: "Technical Skills", skills: [] },
    { category: "Tools & Frameworks", skills: [] },
  ],
  projects: [],
  certifications: [],
};

export const DEMO_RESUME_DATA: ResumeBuilderData = {
  personalInfo: {
    fullName: "Alex Chen",
    headline: "Senior Full-Stack & Cloud Engineer",
    email: "alex.chen.dev@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA (Open to Remote)",
    website: "https://alexchen.dev",
    linkedin: "linkedin.com/in/alexchen-dev",
    github: "github.com/alexchen-cloud",
  },
  summary:
    "Results-driven Senior Full-Stack Engineer with 6+ years of expertise architecting high-throughput distributed web systems, Next.js micro-frontends, and cloud native services. Spearheaded backend performance refactoring that reduced API p99 latency by 42% across 1.8M active users. Passionate about developer tooling, scalable system design, and leading high-performing agile engineering squads.",
  experiences: [
    {
      id: "exp-1",
      company: "Apex Cloud Technologies",
      role: "Lead Full-Stack Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2023",
      endDate: "Present",
      isCurrent: true,
      description:
        "Direct the core web engineering team of 7 engineers delivering enterprise cloud migration platforms.",
      highlights: [
        "Architected scalable real-time analytics pipeline using Next.js 15, Node.js, and Redis caching, processing over 12M events daily.",
        "Decreased continuous deployment build times by 55% by redesigning Docker multi-stage CI/CD pipelines.",
        "Mentored 5 associate and mid-level engineers, resulting in 2 fast-track promotions within 12 months.",
      ],
    },
    {
      id: "exp-2",
      company: "Horizon Digital Solutions",
      role: "Senior Software Engineer",
      location: "Austin, TX (Remote)",
      startDate: "Aug 2020",
      endDate: "Dec 2022",
      isCurrent: false,
      description:
        "Engineered customer-facing SaaS dashboards and RESTful / GraphQL microservices.",
      highlights: [
        "Re-engineered core billing and checkout workflows with Stripe webhook idempotency, slashing failed transaction drop-offs by 28%.",
        "Pioneered migration from monolithic React architecture to modern Server Components, improving Lighthouse performance score from 61 to 98.",
        "Collaborated with security teams to implement OAuth 2.0 PKCE auth and SOC-2 compliance across all client portal endpoints.",
      ],
    },
    {
      id: "exp-3",
      company: "Vanguard Media Labs",
      role: "Software Engineer",
      location: "Seattle, WA",
      startDate: "Jun 2018",
      endDate: "Jul 2020",
      isCurrent: false,
      description:
        "Developed high-traffic media publishing interfaces and search query indexing systems.",
      highlights: [
        "Implemented Elasticsearch full-text search engine handling 25,000+ queries per minute with sub-100ms response times.",
        "Integrated automated end-to-end testing suite achieving 92% code coverage on core payment and authorization services.",
      ],
    },
  ],
  educations: [
    {
      id: "edu-1",
      institution: "University of Washington",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science & Software Engineering",
      location: "Seattle, WA",
      startDate: "2014",
      endDate: "2018",
      gpa: "3.85 / 4.0",
      honors: "Magna Cum Laude & Dean's Honor List",
    },
  ],
  skillGroups: [
    {
      category: "Core Languages",
      skills: [
        "TypeScript",
        "JavaScript (ESNext)",
        "Python",
        "Go",
        "SQL",
        "HTML5/CSS3",
      ],
    },
    {
      category: "Frameworks & Libraries",
      skills: [
        "React 19",
        "Next.js (App Router)",
        "Node.js",
        "Express",
        "Tailwind CSS",
        "GraphQL",
      ],
    },
    {
      category: "Cloud & Infrastructure",
      skills: [
        "AWS (ECS, Lambda, S3)",
        "Docker",
        "Kubernetes",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Terraform",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "FlowMetrics - Distributed Tracing Engine",
      role: "Creator & Maintainer",
      link: "https://flowmetrics.dev",
      github: "github.com/alexchen/flowmetrics",
      techStack: ["Go", "Next.js", "ClickHouse", "Docker"],
      description:
        "Open-source distributed APM monitoring tool with visual trace timelines and error tracking.",
      highlights: [
        "Earned 1,400+ GitHub stars with active production deployments across 30+ startup engineering teams.",
        "Benchmarked to ingest up to 50,000 telemetry spans per second with zero dropped frames.",
      ],
    },
    {
      id: "proj-2",
      title: "PulseAI - Automated PR Reviewer Bot",
      role: "Lead Developer",
      link: "https://pulseai.app",
      github: "github.com/alexchen/pulse-ai",
      techStack: ["TypeScript", "Gemini Pro", "GitHub Actions", "Vercel"],
      description:
        "Developer productivity bot that summarizes pull request diffs and flags potential anti-patterns.",
      highlights: [
        "Integrated across 180+ repositories, shaving an estimated 4.5 hours of code review time per developer monthly.",
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      date: "2024",
      url: "https://aws.amazon.com/verification",
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation (CNCF)",
      date: "2023",
      url: "https://cncf.io",
    },
  ],
};
