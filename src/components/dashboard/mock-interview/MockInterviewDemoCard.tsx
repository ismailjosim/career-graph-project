"use client";

import { Bot, Play, Volume2 } from "lucide-react";

interface MockInterviewDemoCardProps {
  isPlayingDemo: boolean;
  onToggleAudioDemo: () => void;
}

export function MockInterviewDemoCard({
  isPlayingDemo,
  onToggleAudioDemo,
}: MockInterviewDemoCardProps) {
  return (
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
            type="button"
            onClick={onToggleAudioDemo}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isPlayingDemo
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            }`}
          >
            {isPlayingDemo ? (
              <>
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Playing Question Audio...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Listen to Sample Prompt</span>
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
            &quot;Tell me about a time when a critical production pipeline
            failed. How did you diagnose the root cause, communicate with
            stakeholders, and prevent recurrence?&quot;
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
  );
}
