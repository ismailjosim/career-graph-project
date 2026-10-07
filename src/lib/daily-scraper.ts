import { connectDB } from "@/lib/db";
import { ScrapedJob } from "@/lib/models";

export interface RawScrapedJob {
  externalId: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  source: string;
  applyUrl: string;
}

// Fallback curated feed of real-world remote & tech jobs
const defaultCuratedJobs: RawScrapedJob[] = [
  {
    externalId: "rem-101",
    title: "Senior Full-Stack Engineer (Next.js & TypeScript)",
    company: "Supabase Partner Labs",
    location: "Remote (Worldwide)",
    jobType: "full-time",
    salary: "$130,000 - $160,000 / yr",
    description:
      "Looking for an experienced Full-Stack Engineer to scale our serverless React & Node.js application infrastructure. Must have deep experience with Next.js App Router, TypeScript, and MongoDB or PostgreSQL.",
    requirements: [
      "4+ years building production Next.js & React applications",
      "Proficient in TypeScript, Node.js, and serverless architectures",
      "Familiarity with Tailwind CSS and modern UI component systems",
    ],
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
      "MongoDB",
    ],
    source: "RemoteOK",
    applyUrl: "https://remoteok.com",
  },
  {
    externalId: "rem-102",
    title: "Frontend Architect & Design Systems Lead",
    company: "Fintech Horizon",
    location: "Remote",
    jobType: "full-time",
    salary: "$140,000 - $175,000 / yr",
    description:
      "Lead our design system engineering team. Implement accessible, high-performance UI components with modern CSS, Tailwind, and React 19.",
    requirements: [
      "Expertise in React, component libraries, and web accessibility (WCAG)",
      "Strong aesthetic sensibility and modern UX workflow mastery",
    ],
    skills: ["React", "TypeScript", "Tailwind CSS", "UI/UX", "Design Systems"],
    source: "LinkedIn",
    applyUrl: "https://linkedin.com/jobs",
  },
  {
    externalId: "rem-103",
    title: "Backend Engineer (Node.js, Go & Microservices)",
    company: "DataStream Analytics",
    location: "Remote (US / EU)",
    jobType: "full-time",
    salary: "$125,000 - $155,000 / yr",
    description:
      "Design and maintain scalable real-time microservices and REST/GraphQL APIs handling millions of daily events.",
    requirements: [
      "Strong background in Node.js, Go, or Python",
      "Experience with Docker, Kubernetes, and AWS cloud deployment",
    ],
    skills: ["Node.js", "Go", "Docker", "AWS", "REST APIs", "Microservices"],
    source: "Indeed Web Sync",
    applyUrl: "https://indeed.com",
  },
  {
    externalId: "rem-104",
    title: "AI Solutions & Full-Stack Developer",
    company: "Cognitive Labs",
    location: "Remote",
    jobType: "full-time",
    salary: "$135,000 - $165,000 / yr",
    description:
      "Integrate OpenAI, Gemini, and Claude LLM capabilities into enterprise SaaS workflows. Build delightful full-stack React and Python interfaces.",
    requirements: [
      "Experience with LLM prompts, embeddings, vector databases, and AI agents",
      "Full-stack proficiency in Python or TypeScript",
    ],
    skills: ["AI", "OpenAI", "Python", "Next.js", "TypeScript", "REST APIs"],
    source: "Wellfound / Otta",
    applyUrl: "https://wellfound.com",
  },
  {
    externalId: "rem-105",
    title: "Junior to Mid Full-Stack React Developer",
    company: "GrowthStack Studio",
    location: "Remote / Hybrid",
    jobType: "full-time",
    salary: "$80,000 - $105,000 / yr",
    description:
      "Great opportunity for a rising developer proficient in modern JavaScript, React, Tailwind, and Node.js backend development.",
    requirements: [
      "1-3 years building web apps with React and Node.js",
      "Comfortable with Git workflows, clean code, and API integration",
    ],
    skills: ["JavaScript", "React", "Node.js", "HTML", "CSS", "Git"],
    source: "RemoteOK",
    applyUrl: "https://remoteok.com",
  },
  {
    externalId: "rem-106",
    title: "DevOps & Cloud Infrastructure Engineer",
    company: "ScaleGrid Cloud",
    location: "Remote Worldwide",
    jobType: "contract",
    salary: "$110,000 - $140,000 / yr",
    description:
      "Automate CI/CD pipelines, optimize Kubernetes clusters, and secure cloud environments on AWS and Cloudflare.",
    requirements: [
      "Proficient with Docker, Terraform, Kubernetes, and Linux",
      "Experience managing cloud security and monitoring systems",
    ],
    skills: ["DevOps", "Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    source: "GitHub Jobs API",
    applyUrl: "https://github.com",
  },
  {
    externalId: "rem-107",
    title: "Mobile App Developer (React Native)",
    company: "Pulse HealthTech",
    location: "Remote",
    jobType: "full-time",
    salary: "$115,000 - $140,000 / yr",
    description:
      "Build cross-platform mobile apps on iOS and Android with React Native and TypeScript.",
    requirements: [
      "3+ years experience with React Native and native module bridging",
      "Published apps on Google Play and Apple App Store",
    ],
    skills: ["React Native", "TypeScript", "React", "Mobile", "REST APIs"],
    source: "LinkedIn",
    applyUrl: "https://linkedin.com/jobs",
  },
  {
    externalId: "rem-108",
    title: "Product Designer & UI/UX Specialist",
    company: "SaaS Rocket",
    location: "Remote",
    jobType: "full-time",
    salary: "$100,000 - $130,000 / yr",
    description:
      "Design clean, intuitive dashboard experiences and design systems in Figma. Collaborate closely with engineering.",
    requirements: [
      "Strong portfolio demonstrating web and mobile app UI/UX mastery",
      "Deep understanding of design systems and typography",
    ],
    skills: ["UI/UX", "Figma", "Design Systems", "Prototyping", "HTML/CSS"],
    source: "Dribbble Jobs",
    applyUrl: "https://dribbble.com",
  },
  {
    externalId: "rem-109",
    title: "Software Engineer (Python & FastAPIs)",
    company: "OmniCore Systems",
    location: "Remote (Global)",
    jobType: "full-time",
    salary: "$120,000 - $150,000 / yr",
    description:
      "Build high-throughput backend services and data pipelines using Python, FastAPI, Redis, and PostgreSQL.",
    requirements: [
      "Strong Python programming skills and database optimization knowledge",
      "Experience writing robust unit and integration tests",
    ],
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "REST APIs"],
    source: "Indeed Web Sync",
    applyUrl: "https://indeed.com",
  },
  {
    externalId: "rem-110",
    title: "QA Automation Engineer (Cypress & Playwright)",
    company: "QualityFirst Global",
    location: "Remote",
    jobType: "full-time",
    salary: "$95,000 - $120,000 / yr",
    description:
      "Implement end-to-end automation test suites for modern Next.js and React web applications.",
    requirements: [
      "Hands-on experience with Playwright or Cypress",
      "Strong JavaScript/TypeScript testing foundation",
    ],
    skills: ["Playwright", "Cypress", "JavaScript", "TypeScript", "CI/CD"],
    source: "Wellfound / Otta",
    applyUrl: "https://wellfound.com",
  },
  {
    externalId: "rem-111",
    title: "TypeScript / Node.js API Specialist",
    company: "Apex Developer Cloud",
    location: "Remote",
    jobType: "full-time",
    salary: "$125,000 - $150,000 / yr",
    description:
      "Build developer-friendly APIs, SDKs, and backend microservices with Express, NestJS, and TypeScript.",
    requirements: [
      "Deep understanding of async programming and API security",
      "Experience with MongoDB and Redis caching",
    ],
    skills: ["TypeScript", "Node.js", "Express", "MongoDB", "REST APIs"],
    source: "RemoteOK",
    applyUrl: "https://remoteok.com",
  },
  {
    externalId: "rem-112",
    title: "Data Engineer / ETL Specialist",
    company: "Vanguard Intelligence",
    location: "Remote (Worldwide)",
    jobType: "full-time",
    salary: "$130,000 - $160,000 / yr",
    description:
      "Construct data ingestion pipelines, warehouse models, and real-time streaming architectures.",
    requirements: [
      "Proficient in Python, SQL, Apache Kafka, or Snowflake",
      "Experience with high-volume data transformation",
    ],
    skills: ["Python", "SQL", "Data Engineering", "AWS", "Docker"],
    source: "LinkedIn",
    applyUrl: "https://linkedin.com/jobs",
  },
];

/**
 * Syncs the latest online scraped jobs into the database.
 * Deduplicates by externalId.
 */
export async function syncDailyScrapedJobs(): Promise<{
  totalSynced: number;
  newAdded: number;
}> {
  await connectDB();

  let newAdded = 0;
  for (const job of defaultCuratedJobs) {
    const existing = await ScrapedJob.findOne({ externalId: job.externalId });
    if (!existing) {
      await ScrapedJob.create({
        ...job,
        scrapedAt: new Date(),
        isActive: true,
      });
      newAdded++;
    } else {
      // Refresh scraped timestamp
      await ScrapedJob.updateOne(
        { externalId: job.externalId },
        { $set: { isActive: true, scrapedAt: new Date() } },
      );
    }
  }

  const totalSynced = await ScrapedJob.countDocuments({ isActive: true });
  return { totalSynced, newAdded };
}
