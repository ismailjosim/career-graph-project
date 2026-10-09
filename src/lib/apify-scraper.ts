import { ApifyClient } from "apify-client";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { ScrapedJob, ScraperRun } from "@/lib/models";

export type ScraperPlatform =
  | "linkedin"
  | "indeed"
  | "google_jobs"
  | "glassdoor"
  | "all";

export interface ScraperInput {
  platform: ScraperPlatform;
  targetRole: string;
  location?: string;
  jobCount?: number;
  adminId: string;
  adminEmail?: string;
}

export interface NormalizedScrapedJob {
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
  deadline?: Date;
}

// Map platform to verified Apify Store actors
export const PLATFORM_ACTORS: Record<
  ScraperPlatform,
  { actorId: string; name: string; defaultSource: string }
> = {
  linkedin: {
    actorId: "bebity/linkedin-jobs-scraper",
    name: "LinkedIn Jobs Scraper",
    defaultSource: "LinkedIn",
  },
  indeed: {
    actorId: "borderline/indeed-scraper",
    name: "Indeed Jobs Scraper",
    defaultSource: "Indeed",
  },
  google_jobs: {
    actorId: "epctex/google-jobs-scraper",
    name: "Google Jobs Multi-Aggregator",
    defaultSource: "Google Jobs",
  },
  glassdoor: {
    actorId: "bebity/glassdoor-jobs-scraper",
    name: "Glassdoor Jobs Scraper",
    defaultSource: "Glassdoor",
  },
  all: {
    actorId: "bebity/linkedin-jobs-scraper",
    name: "Universal Multi-Platform Aggregator",
    defaultSource: "All Platforms",
  },
};

export const COMMON_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Go",
  "Golang",
  "Java",
  "C++",
  "C#",
  ".NET",
  "Rust",
  "PHP",
  "Ruby",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "REST API",
  "Tailwind CSS",
  "Vue",
  "Angular",
  "Django",
  "FastAPI",
  "Spring Boot",
  "CI/CD",
  "Terraform",
  "Linux",
  "Git",
  "Kafka",
  "RabbitMQ",
  "Elasticsearch",
  "Microservices",
  "Machine Learning",
  "AI",
  "LLM",
  "Prompt Engineering",
  "UI/UX",
  "Figma",
  "Agile",
  "Scrum",
];

export function extractSkillsFromJobText(text: string): string[] {
  if (!text) return [];
  const found = new Set<string>();
  const lower = text.toLowerCase();

  for (const skill of COMMON_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lower)) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

export function extractRequirementsFromText(text: string): string[] {
  if (!text) return [];
  const lines = text.split(/\r?\n|•|\*/);
  const requirements: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (
      line.length >= 20 &&
      line.length <= 250 &&
      !line.toLowerCase().includes("about us") &&
      !line.toLowerCase().includes("equal opportunity")
    ) {
      if (
        /year|experience|proficien|knowledge|degree|skill|ability|responsible|build|design/i.test(
          line,
        )
      ) {
        requirements.push(line);
      }
    }
    if (requirements.length >= 6) break;
  }

  return requirements;
}

export function getApifyClient(): ApifyClient {
  const token =
    process.env.APIFY_API_TOKEN?.replace(/^["']|["']$/g, "").trim() ||
    "apify_api_hJjOtdhzbiPRD347kKvGMAVMfoPPwO4sK1Ow";
  return new ApifyClient({ token });
}

export function formatActorInput(
  platform: ScraperPlatform,
  role: string,
  location: string,
  count: number,
): Record<string, unknown> {
  const loc = location || "Remote";

  switch (platform) {
    case "linkedin":
    case "all":
      return {
        titles: [role],
        queries: [role],
        locations: [loc],
        maxItems: count,
        scrapeCompanyDetails: false,
      };

    case "indeed":
      return {
        position: role,
        location: loc,
        maxRows: count,
      };

    case "glassdoor":
      return {
        query: role,
        location: loc,
        maxItems: count,
      };

    default:
      return {
        queries: [`${role} in ${loc}`],
        maxItems: count,
        proxy: { useApifyProxy: true },
      };
  }
}

/**
 * Normalizes an arbitrary item from any Apify job scraper actor
 */
export function normalizeApifyJobItem(
  item: Record<string, unknown>,
  platform: ScraperPlatform,
): NormalizedScrapedJob | null {
  if (!item || typeof item !== "object") return null;

  // Title extraction
  const title =
    (item.title as string) ||
    (item.jobTitle as string) ||
    (item.positionName as string) ||
    (item.role as string) ||
    "";
  if (!title || title.trim().length < 2) return null;

  // Company extraction
  const company =
    (item.companyName as string) ||
    (item.company as string) ||
    (item.employerName as string) ||
    (item.hiringOrganization as string) ||
    ((item.companyDetails as Record<string, unknown>)?.name as string) ||
    "Technology Company";

  // Location extraction
  let location =
    (item.location as string) ||
    (item.formattedLocation as string) ||
    (item.jobLocation as string) ||
    (item.city as string) ||
    "Remote";
  if (!location.trim()) location = "Remote";

  // Apply URL
  const applyUrl =
    (item.applyUrl as string) ||
    (item.applyLink as string) ||
    (item.jobUrl as string) ||
    (item.url as string) ||
    (item.link as string) ||
    (item.shareUrl as string) ||
    "";
  if (!applyUrl) return null;

  // Description
  const description =
    (item.description as string) ||
    (item.descriptionText as string) ||
    (item.snippet as string) ||
    (item.overview as string) ||
    (item.summary as string) ||
    `${title} at ${company}. Explore role details and submit your application online.`;

  // Salary
  const salary =
    (item.salary as string) ||
    (item.estimatedSalary as string) ||
    (item.compensation as string) ||
    (item.pay as string) ||
    "Competitive";

  // Job Type
  let jobType =
    (item.jobType as string) ||
    (item.employmentType as string) ||
    (item.scheduleType as string) ||
    "full-time";
  if (/contract/i.test(jobType)) jobType = "contract";
  else if (/part/i.test(jobType)) jobType = "part-time";
  else if (/intern/i.test(jobType)) jobType = "internship";
  else jobType = "full-time";

  // Source platform determination
  let source = PLATFORM_ACTORS[platform].defaultSource;
  if (item.via && typeof item.via === "string") {
    source = item.via.replace(/^via\s+/i, "");
  } else if (applyUrl.includes("linkedin.com")) {
    source = "LinkedIn";
  } else if (applyUrl.includes("indeed.com")) {
    source = "Indeed";
  } else if (applyUrl.includes("glassdoor.com")) {
    source = "Glassdoor";
  } else if (applyUrl.includes("remoteok.com")) {
    source = "RemoteOK";
  }

  // Composite external ID
  const rawId =
    (item.id as string) ||
    (item.jobId as string) ||
    (item.externalId as string) ||
    applyUrl;
  const safeId = `${platform.slice(0, 3)}-${Buffer.from(rawId).toString("base64").slice(0, 24).replace(/[/+=]/g, "")}`;

  // Skills & Requirements
  const skills = extractSkillsFromJobText(`${title} ${description}`);
  const requirements = extractRequirementsFromText(description);

  // Application Deadline calculation
  let deadline: Date;
  const rawDeadline =
    (item.validThrough as string) ||
    (item.deadline as string) ||
    (item.applicationDeadline as string) ||
    (item.expiresAt as string);
  if (rawDeadline) {
    const parsed = new Date(rawDeadline);
    deadline = !Number.isNaN(parsed.getTime())
      ? parsed
      : new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
  } else {
    deadline = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
  }

  // Discard expired jobs immediately
  if (deadline.getTime() <= Date.now()) {
    return null;
  }

  return {
    externalId: safeId,
    title: title.trim(),
    company: company.trim(),
    location: location.trim(),
    jobType,
    salary,
    description,
    requirements,
    skills,
    source,
    applyUrl,
    deadline,
  };
}

/**
 * Initiates an Apify Actor run and records a ScraperRun in MongoDB
 */
export async function startApifyScraperRun(input: ScraperInput): Promise<{
  runId: string;
  apifyRunId: string;
  actorId: string;
}> {
  await connectDB();
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connection.asPromise();
  }

  const count = Math.min(200, Math.max(5, input.jobCount || 50));
  const location = input.location?.trim() || "Remote";
  const actorConfig = PLATFORM_ACTORS[input.platform];
  const actorInput = formatActorInput(
    input.platform,
    input.targetRole,
    location,
    count,
  );

  const client = getApifyClient();

  // 1. Start the Apify Actor asynchronously
  const run = await client.actor(actorConfig.actorId).start(actorInput, {
    memory: 1024,
    timeout: 300,
  });

  // 2. Persist initial ScraperRun record in MongoDB
  const runDoc = {
    adminId: input.adminId,
    adminEmail: input.adminEmail,
    platform: input.platform,
    targetRole: input.targetRole,
    location,
    targetCount: count,
    scrapedCount: 0,
    newJobsCount: 0,
    duplicateCount: 0,
    status: "running",
    apifyActorId: actorConfig.actorId,
    apifyRunId: run.id,
    apifyDatasetId: run.defaultDatasetId,
    startedAt: new Date(),
  };

  const db = mongoose.connection.db;
  let runId: string;
  if (db) {
    const insertRes = await db.collection("scraperruns").insertOne(runDoc);
    runId = insertRes.insertedId.toString();
  } else {
    const scraperRun = new ScraperRun(runDoc);
    await scraperRun.save();
    runId = scraperRun._id.toString();
  }

  return {
    runId,
    apifyRunId: run.id,
    actorId: actorConfig.actorId,
  };
}

/**
 * Ingests dataset items from an Apify Actor run into MongoDB with deduplication
 */
export async function ingestApifyDatasetItems(
  _runId: string,
  datasetId: string,
  platform: ScraperPlatform,
): Promise<{
  totalScraped: number;
  newJobsCount: number;
  duplicateCount: number;
  sampleJobs: NormalizedScrapedJob[];
}> {
  await connectDB();
  const client = getApifyClient();

  const dataset = client.dataset(datasetId);
  const itemsResponse = await dataset.listItems({ limit: 250 });
  const rawItems = itemsResponse.items as Record<string, unknown>[];

  const normalizedJobs: NormalizedScrapedJob[] = [];
  const seenUrls = new Set<string>();

  for (const raw of rawItems) {
    const job = normalizeApifyJobItem(raw, platform);
    if (job && !seenUrls.has(job.applyUrl)) {
      seenUrls.add(job.applyUrl);
      normalizedJobs.push(job);
    }
  }

  if (normalizedJobs.length === 0) {
    return {
      totalScraped: 0,
      newJobsCount: 0,
      duplicateCount: 0,
      sampleJobs: [],
    };
  }

  // Deduplicate against existing jobs in MongoDB
  const urls = normalizedJobs.map((j) => j.applyUrl);
  const externalIds = normalizedJobs.map((j) => j.externalId);

  const existingDocs = await ScrapedJob.find({
    $or: [{ applyUrl: { $in: urls } }, { externalId: { $in: externalIds } }],
  }).select("applyUrl externalId");

  const existingUrls = new Set(existingDocs.map((d) => d.applyUrl));
  const existingExternalIds = new Set(existingDocs.map((d) => d.externalId));

  const newJobs: NormalizedScrapedJob[] = [];
  let duplicateCount = 0;

  for (const job of normalizedJobs) {
    if (
      existingUrls.has(job.applyUrl) ||
      existingExternalIds.has(job.externalId)
    ) {
      duplicateCount++;
    } else {
      newJobs.push(job);
    }
  }

  // Bulk write new jobs
  if (newJobs.length > 0) {
    const ops = newJobs.map((job) => ({
      updateOne: {
        filter: { externalId: job.externalId },
        update: { $set: { ...job, scrapedAt: new Date(), isActive: true } },
        upsert: true,
      },
    }));
    await ScrapedJob.bulkWrite(ops);
  }

  return {
    totalScraped: normalizedJobs.length,
    newJobsCount: newJobs.length,
    duplicateCount,
    sampleJobs: normalizedJobs.slice(0, 10),
  };
}
