import { connectDB } from "@/lib/db";
import { Resume } from "@/lib/models";

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  targetRole: string;
  skills: string[];
  location: string;
  resumeTitle?: string;
  hasResume: boolean;
}

export interface CandidateRoleCluster {
  roleName: string;
  userCount: number;
  candidates: CandidateProfile[];
  topSkills: string[];
  recommendedPlatforms: string[];
  sampleSearchQuery: string;
}

export interface CandidateDemandSummary {
  totalJobSeekers: number;
  totalWithResumes: number;
  analyzedAt: string;
  clusters: CandidateRoleCluster[];
  allExtractedRoles: string[];
  topGlobalSkills: { skill: string; count: number }[];
}

// Known common role categories to cleanly cluster diverse headlines
const ROLE_PATTERNS: { regex: RegExp; standardized: string }[] = [
  { regex: /react/i, standardized: "React Developer" },
  { regex: /full[\s-]?stack/i, standardized: "Full Stack Developer" },
  { regex: /frontend|front[\s-]?end/i, standardized: "Frontend Engineer" },
  { regex: /backend|back[\s-]?end/i, standardized: "Backend Engineer" },
  {
    regex: /ai|machine[\s-]?learning|ml|deep[\s-]?learning|llm/i,
    standardized: "AI / ML Engineer",
  },
  { regex: /node|express/i, standardized: "Node.js Developer" },
  { regex: /python/i, standardized: "Python Developer" },
  {
    regex: /devops|cloud|sre|infrastructure/i,
    standardized: "DevOps Engineer",
  },
  { regex: /ui[/-]?ux|product[\s-]?design/i, standardized: "UI/UX Designer" },
  {
    regex: /data[\s-]?engineer|data[\s-]?analytics|data[\s-]?scientist/i,
    standardized: "Data Engineer",
  },
  { regex: /product[\s-]?manager/i, standardized: "Product Manager" },
  {
    regex: /mobile|ios|android|react[\s-]?native|flutter/i,
    standardized: "Mobile Developer",
  },
];

function standardizeRole(rawHeadline: string): string {
  const clean = rawHeadline.trim();
  if (!clean) return "Full Stack Developer";

  for (const { regex, standardized } of ROLE_PATTERNS) {
    if (regex.test(clean)) {
      return standardized;
    }
  }

  // Capitalize title
  return clean
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .slice(0, 35);
}

function extractSkillsFromUserData(
  userDoc: Record<string, unknown>,
  resumeDoc?: Record<string, unknown> | null,
): string[] {
  const skillsSet = new Set<string>();

  // 1. From User profile skills
  if (Array.isArray(userDoc.skills)) {
    for (const s of userDoc.skills) {
      if (typeof s === "string" && s.trim()) skillsSet.add(s.trim());
    }
  } else if (typeof userDoc.skills === "string") {
    userDoc.skills.split(",").forEach((s) => {
      const trimmed = s.trim();
      if (trimmed) skillsSet.add(trimmed);
    });
  }

  // 2. From User technicalSkills
  if (Array.isArray(userDoc.technicalSkills)) {
    for (const s of userDoc.technicalSkills) {
      if (typeof s === "string" && s.trim()) skillsSet.add(s.trim());
    }
  } else if (typeof userDoc.technicalSkills === "string") {
    userDoc.technicalSkills.split(",").forEach((s) => {
      const trimmed = s.trim();
      if (trimmed) skillsSet.add(trimmed);
    });
  }

  // 3. From Resume builderData skills
  if (resumeDoc?.builderData && typeof resumeDoc.builderData === "object") {
    const bData = resumeDoc.builderData as Record<string, unknown>;
    if (Array.isArray(bData.skills)) {
      for (const group of bData.skills) {
        if (
          group &&
          typeof group === "object" &&
          Array.isArray((group as Record<string, unknown>).skills)
        ) {
          for (const s of (group as Record<string, unknown>)
            .skills as unknown[]) {
            if (typeof s === "string" && s.trim()) skillsSet.add(s.trim());
          }
        }
      }
    }
  }

  // 4. Fallback scan on rawText or headline
  const text =
    `${userDoc.headline || ""} ${resumeDoc?.rawText || ""}`.toLowerCase();
  const techMap = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Python",
    "Tailwind CSS",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Express",
    "GraphQL",
    "Redis",
    "PyTorch",
    "OpenAI",
    "LangChain",
    "Git",
    "Figma",
  ];
  for (const tech of techMap) {
    if (text.includes(tech.toLowerCase())) {
      skillsSet.add(tech);
    }
  }

  if (skillsSet.size === 0) {
    return ["React", "JavaScript", "TypeScript", "Next.js", "Node.js"];
  }

  return Array.from(skillsSet);
}

/**
 * Analyzes all active candidates/job seekers in the platform,
 * clusters their target job roles and extracts prioritized skillsets.
 */
export async function analyzeCandidateDemand(): Promise<CandidateDemandSummary> {
  const mongoose = await connectDB();
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("Database connection unavailable");
  }

  // Fetch all active job seekers (exclude super_admin)
  const userCollection = db.collection<Record<string, unknown>>("user");
  const users = await userCollection
    .find({
      status: { $ne: "blocked" },
      role: { $in: ["job_seeker", "user", null, undefined] },
    })
    .toArray();

  // If there are few or no users with role job_seeker, also include users with status active
  let candidateUsers = users;
  if (candidateUsers.length === 0) {
    candidateUsers = await userCollection
      .find({ status: { $ne: "blocked" } })
      .toArray();
  }

  // Fetch all resumes mapped by userId
  const allResumes = await Resume.find().sort({ createdAt: -1 }).lean();
  const resumeByUserId = new Map<string, Record<string, unknown>>();
  for (const r of allResumes) {
    const uId = String(r.userId);
    if (!resumeByUserId.has(uId) || r.isDefault) {
      resumeByUserId.set(uId, r as Record<string, unknown>);
    }
  }

  const candidateProfiles: CandidateProfile[] = [];
  const globalSkillFreq = new Map<string, number>();

  for (const u of candidateUsers) {
    const userId = String(u._id || u.id);
    const resume = resumeByUserId.get(userId);

    // Extract target role
    let rawRole = (u.headline as string) || "";
    if (
      !rawRole &&
      resume?.builderData &&
      typeof resume.builderData === "object"
    ) {
      const bBasics = (resume.builderData as Record<string, unknown>).basics;
      if (bBasics && typeof bBasics === "object") {
        rawRole =
          ((bBasics as Record<string, unknown>).headline as string) || "";
      }
    }
    if (!rawRole && resume?.name) {
      rawRole = resume.name as string;
    }
    if (!rawRole) {
      rawRole = "Full Stack Developer";
    }

    const targetRole = standardizeRole(rawRole);
    const skills = extractSkillsFromUserData(u, resume);
    const location = (u.location as string) || "Remote";

    for (const s of skills) {
      globalSkillFreq.set(s, (globalSkillFreq.get(s) || 0) + 1);
    }

    candidateProfiles.push({
      id: userId,
      name: (u.name as string) || "Candidate",
      email: (u.email as string) || "",
      image: (u.image as string) || undefined,
      targetRole,
      skills,
      location,
      resumeTitle: resume ? String(resume.name || "Resume") : undefined,
      hasResume: Boolean(resume),
    });
  }

  // Group candidates into clusters by target role
  const clusterMap = new Map<string, CandidateProfile[]>();
  for (const candidate of candidateProfiles) {
    const role = candidate.targetRole;
    const existing = clusterMap.get(role);
    if (existing) {
      existing.push(candidate);
    } else {
      clusterMap.set(role, [candidate]);
    }
  }

  // If no candidates exist in DB, return empty cluster analytics
  if (candidateProfiles.length === 0) {
    return {
      totalJobSeekers: 0,
      totalWithResumes: 0,
      analyzedAt: new Date().toISOString(),
      clusters: [],
      allExtractedRoles: [],
      topGlobalSkills: [],
    };
  }

  const clusters: CandidateRoleCluster[] = [];
  clusterMap.forEach((candidates, roleName) => {
    // Count skills frequency within cluster
    const clusterSkills = new Map<string, number>();
    for (const c of candidates) {
      for (const s of c.skills) {
        clusterSkills.set(s, (clusterSkills.get(s) || 0) + 1);
      }
    }
    const sortedSkills = Array.from(clusterSkills.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([s]) => s)
      .slice(0, 6);

    clusters.push({
      roleName,
      userCount: candidates.length,
      candidates,
      topSkills:
        sortedSkills.length > 0
          ? sortedSkills
          : ["React", "TypeScript", "Next.js"],
      recommendedPlatforms: ["LinkedIn", "Indeed", "Google Jobs", "Glassdoor"],
      sampleSearchQuery: `${roleName} Remote`,
    });
  });

  // Sort clusters by highest candidate demand
  clusters.sort((a, b) => b.userCount - a.userCount);

  // Top global skills
  const topGlobalSkills = Array.from(globalSkillFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  return {
    totalJobSeekers: candidateProfiles.length,
    totalWithResumes: candidateProfiles.filter((c) => c.hasResume).length,
    analyzedAt: new Date().toISOString(),
    clusters,
    allExtractedRoles: clusters.map((c) => c.roleName),
    topGlobalSkills,
  };
}
