import { Award, Briefcase, Mic, TrendingUp } from "lucide-react";

export interface RoadmapStep {
  title: string;
  desc: string;
  status: "completed" | "in_progress" | "upcoming";
  tag: string;
}

export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    title: "Domain Question Engine",
    desc: "1,500+ curated behavioral and technical interview questions cross-referenced by company tier.",
    status: "completed",
    tag: "Ready",
  },
  {
    title: "Low-Latency Speech & Audio",
    desc: "Real-time speech-to-text with conversational turn-taking and natural AI voice synthesis.",
    status: "in_progress",
    tag: "In Progress",
  },
  {
    title: "STAR Framework Diagnostics",
    desc: "Automated breakdown of Situation, Task, Action, and Result with quantifiable impact scoring.",
    status: "in_progress",
    tag: "Testing",
  },
  {
    title: "Public Beta & Early Access",
    desc: "Rolling rollout for CareerGraph users with complimentary simulation credits.",
    status: "upcoming",
    tag: "Q2 2026",
  },
];

export const FEATURE_HIGHLIGHTS = [
  {
    icon: Mic,
    title: "Voice-Powered Simulation",
    description:
      "Practice vocal responses naturally with low-latency audio processing and realistic conversational pauses.",
    accent:
      "from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
  },
  {
    icon: Award,
    title: "STAR Method Diagnostics",
    description:
      "Real-time heuristic evaluation measuring your Situation clarity, Task definition, Action specifics, and Result metrics.",
    accent:
      "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
  },
  {
    icon: TrendingUp,
    title: "Speech & Pacing Analytics",
    description:
      "Pinpoint filler words (um, like, actually), monitor words-per-minute pace, and gauge tone confidence.",
    accent:
      "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
  },
  {
    icon: Briefcase,
    title: "Targeted Job Persona",
    description:
      "Calibrate the interviewer persona to FAANG, high-growth startups, or enterprise leadership standards.",
    accent:
      "from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
  },
];
