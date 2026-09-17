"use client";

import {
  ArrowRight,
  Award,
  Bell,
  Bot,
  Briefcase,
  CheckCircle2,
  FileCheck,
  Mic,
  Play,
  Sparkles,
  TrendingUp,
  Volume2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

interface RoadmapStep {
  title: string;
  desc: string;
  status: "completed" | "in_progress" | "upcoming";
  tag: string;
}

const roadmapSteps: RoadmapStep[] = [
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

const featureHighlights = [
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

export default function MockInterviewPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "sample">("preview");
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim() || session?.user?.email;
    if (!targetEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubscribed(true);
    toast.success(
      "You're on the VIP waitlist! We'll notify you when early access opens.",
    );
  };

  const toggleAudioDemo = () => {
    setIsPlayingDemo((prev) => !prev);
    if (!isPlayingDemo) {
      toast.info("Simulating audio question playback...");
      setTimeout(() => {
        setIsPlayingDemo(false);
      }, 5000);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in pb-20 max-w-7xl mx-auto">
      {/* Top Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-linear-to-br from-white via-slate-50 to-blue-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/20 p-6 sm:p-10 shadow-sm">
        {/* Glow orb */}
        <div className="absolute top-0 right-1/4 -mt-16 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mb-16 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Under Active Development • Phase 2 Beta
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Mock Interview{" "}
            <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Simulator
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Practice realistic, voice-powered mock interviews tailored to your
            target role. Receive instant STAR-method scorecards, pacing
            diagnostics, and actionable feedback before the actual high-stakes
            call.
          </p>

          {/* Waitlist Form */}
          <div className="pt-3">
            {subscribed ? (
              <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-medium text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>
                  You're registered for VIP early access! We will email you
                  priority credentials.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleNotifySubmit}
                className="flex flex-col sm:flex-row gap-2.5 max-w-md"
              >
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      session?.user?.email ||
                      "Enter your email for early access"
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] shrink-0"
                >
                  <Bell className="w-4 h-4" />
                  Notify Me
                </button>
              </form>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Early testers receive 50 complimentary interview coaching tokens
              upon launch.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tabs / Feature Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Simulator Capabilities
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A preview of the real-time AI audio interview suite in development
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "preview"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Key Pillars
            </button>
            <button
              onClick={() => setActiveTab("sample")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "sample"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Live Demo Preview
            </button>
          </div>
        </div>

        {activeTab === "preview" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureHighlights.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3 group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border bg-linear-to-br ${feature.accent}`}
                  >
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* Live Demo Preview Card */
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    AI Interviewer: Lead Architect Persona
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Topic: System Reliability & Incident Mitigation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAudioDemo}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isPlayingDemo
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  }`}
                >
                  {isPlayingDemo ? (
                    <>
                      <Volume2 className="w-4 h-4 animate-pulse" /> Playing
                      Question Audio...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Listen to Sample Prompt
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulated Prompt & Response */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Question 3 of 5 • Behavioral & Problem Solving
                </span>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  "Tell me about a time when a critical production pipeline
                  failed. How did you diagnose the root cause, communicate with
                  stakeholders, and prevent recurrence?"
                </p>
              </div>

              {/* Sample STAR Scorecard Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  STAR Diagnostic Evaluator (Sample Feedback)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Situation
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                      92 / 100
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Clear blast-radius context
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Task
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                      88 / 100
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Explicit ownership defined
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      Action
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                      95 / 100
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Strong technical isolation
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      Result
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                      85 / 100
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Add MTTR percentage metrics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Development Roadmap */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-5 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Development Milestones
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Current engineering progress toward the full audio simulator release
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {roadmapSteps.map((step, idx) => (
            <div
              key={step.title}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    step.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : step.status === "in_progress"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {step.tag}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  0{idx + 1}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {step.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Active Tools Callout */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-linear-to-r from-blue-50/50 via-slate-50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-blue-950/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Prepare Your Resume in the Meantime
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Use our AI ATS Checker or Job Fit Analyzer to ensure your
            application materials are fully optimized for recruiter screening.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/ats-checker"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold shadow-xs transition-all"
          >
            <FileCheck className="w-4 h-4 text-blue-500" />
            ATS Resume Checker
          </Link>
          <Link
            href="/fit-analysis"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Zap className="w-4 h-4" />
            Run Fit Analysis
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
