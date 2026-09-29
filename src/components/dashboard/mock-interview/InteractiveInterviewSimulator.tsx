"use client";

import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Mic,
  MicOff,
  RefreshCw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTokens } from "@/context/tokens-context";

interface QuestionItem {
  id: string;
  question: string;
  category: string;
  competencyTested: string;
  tips: string;
}

interface StarBreakdown {
  score: number;
  feedback: string;
}

interface EvaluationResult {
  overallScore: number;
  verdict: string;
  starBreakdown: {
    situation: StarBreakdown;
    task: StarBreakdown;
    action: StarBreakdown;
    result: StarBreakdown;
  };
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
  pacingInsight: string;
}

export function InteractiveInterviewSimulator() {
  const { tokens, refreshTokens } = useTokens();

  // Configuration state
  const [role, setRole] = useState("Full Stack Engineer");
  const [interviewType, setInterviewType] = useState<
    "behavioral" | "technical" | "system_design" | "leadership"
  >("behavioral");
  const [experienceLevel, setExperienceLevel] = useState("mid");

  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Response state
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  interface SpeechRecognitionEvent {
    resultIndex: number;
    results: {
      length: number;
      [index: number]: {
        [index: number]: { transcript: string };
      };
    };
  }

  interface ISpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
  }

  // Audio / Speech state
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWithSpeech = window as unknown as {
        SpeechRecognition?: new () => ISpeechRecognition;
        webkitSpeechRecognition?: new () => ISpeechRecognition;
      };
      const SpeechRecognitionCtor =
        windowWithSpeech.SpeechRecognition ||
        windowWithSpeech.webkitSpeechRecognition;

      if (SpeechRecognitionCtor) {
        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setUserAnswer((prev) =>
            prev ? `${prev} ${transcript}` : transcript,
          );
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Text to Speech for question
  const toggleSpeakQuestion = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported on your browser.");
      return;
    }

    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);

    setIsSpeakingQuestion(true);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle voice dictation
  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      toast.error(
        "Speech dictation is not supported in this browser. Please type your response.",
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info("Voice dictation stopped.");
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success("Listening... Speak your answer clearly.");
      } catch {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  const handleStartSession = async () => {
    setLoadingQuestions(true);
    setEvaluation(null);
    setUserAnswer("");
    setCurrentIndex(0);

    try {
      const res = await fetch("/api/ai/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-questions",
          role,
          interviewType,
          experienceLevel,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setIsSessionActive(true);
        toast.success(`Simulation started: 4 questions loaded for ${role}.`);
      } else {
        toast.error("No questions generated. Please try again.");
      }
    } catch (_err) {
      toast.error("Could not initialize session. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer || userAnswer.trim().length < 20) {
      toast.error(
        "Please articulate a more detailed response (at least 20 characters) for an accurate STAR evaluation.",
      );
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    const activeQuestion = questions[currentIndex];

    try {
      const res = await fetch("/api/ai/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate-answer",
          question: activeQuestion.question,
          userAnswer: userAnswer.trim(),
          role,
          interviewType,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Evaluation failed");
      }

      const data = await res.json();
      setEvaluation(data.evaluation);
      refreshTokens();
      toast.success("STAR Evaluation complete! Review your scorecard below.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to evaluate answer";
      toast.error(msg);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setEvaluation(null);
      if (isSpeakingQuestion) {
        window.speechSynthesis?.cancel();
        setIsSpeakingQuestion(false);
      }
    } else {
      toast.success(
        "Congratulations! You completed all questions in this mock interview.",
      );
      setIsSessionActive(false);
    }
  };

  const activeQuestion = questions[currentIndex];
  const wordCount = userAnswer.trim()
    ? userAnswer.trim().split(/\s+/).length
    : 0;

  return (
    <div className="w-full space-y-6">
      {!isSessionActive ? (
        /* Configuration Card */
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Configure Live Interview Studio
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Customize the AI interviewer persona, question difficulty, and
                evaluation criteria.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Zap className="w-3.5 h-3.5" />5 Tokens per evaluation • {tokens}{" "}
              Available
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Target Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="Frontend Engineer">
                  Frontend Engineer (React/Next.js)
                </option>
                <option value="Backend Engineer">
                  Backend Engineer (Node/Python/Go)
                </option>
                <option value="Product Manager">Product Manager</option>
                <option value="Engineering Manager">
                  Engineering Manager / Lead
                </option>
                <option value="Data Scientist">
                  Data Scientist / AI Engineer
                </option>
                <option value="DevOps & Cloud Engineer">
                  DevOps & Cloud Architect
                </option>
              </select>
            </div>

            {/* Interview Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Interview Domain
              </label>
              <select
                value={interviewType}
                onChange={(e) =>
                  setInterviewType(
                    e.target.value as unknown as typeof interviewType,
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="behavioral">
                  Behavioral (STAR Method & Culture)
                </option>
                <option value="technical">Technical Problem Solving</option>
                <option value="system_design">
                  System Design & Scalability
                </option>
                <option value="leadership">
                  Leadership & Stakeholder Alignment
                </option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Seniority Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="entry">Entry Level / Junior (0-2 Yrs)</option>
                <option value="mid">Mid-Level Engineer (3-5 Yrs)</option>
                <option value="senior">Senior Engineer (6-9 Yrs)</option>
                <option value="lead">
                  Staff / Principal / Director (10+ Yrs)
                </option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleStartSession}
              disabled={loadingQuestions}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50"
            >
              {loadingQuestions ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Calibrating Interview Persona...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Launch Interactive Simulator
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Live Simulation Studio */
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {role} • {interviewType.replace("_", " ")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSessionActive(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Change Role Settings
              </button>
            </div>
          </div>

          {/* Active Question Card */}
          {activeQuestion && (
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-linear-to-br from-white via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/20 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    Tested Competency: {activeQuestion.competencyTested}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    &ldquo;{activeQuestion.question}&rdquo;
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSpeakQuestion(activeQuestion.question)}
                  title={
                    isSpeakingQuestion
                      ? "Stop voice playback"
                      : "Listen to question voice"
                  }
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 transition-all shadow-xs shrink-0"
                >
                  {isSpeakingQuestion ? (
                    <VolumeX className="w-5 h-5 text-rose-500 animate-pulse" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Tips Accordion */}
              {activeQuestion.tips && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Coaching Tip:</strong> {activeQuestion.tips}
                  </span>
                </div>
              )}

              {/* Answer Input Studio */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Your Response
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {wordCount} words • ~{Math.round(wordCount / 2.2)} sec
                      spoken
                    </span>
                    <button
                      type="button"
                      onClick={toggleVoiceRecording}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        isListening
                          ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" /> Stop Dictation
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-blue-500" /> Voice
                          Dictate
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Structure your answer using STAR: Describe the Situation you faced, the Task assigned, the specific Actions you drove, and the measurable Result achieved..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed resize-y"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <p className="text-xs text-slate-400">
                    Pro tip: Include quantifiable numbers, percentages, and
                    metrics to maximize your STAR Result score.
                  </p>
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={isEvaluating || !userAnswer.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-all disabled:opacity-50"
                  >
                    {isEvaluating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Evaluating STAR Structure...
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        Evaluate Answer (5 Tokens)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STAR Diagnostics Scorecard */}
          {evaluation && (
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
              {/* Header Score & Verdict */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Bar Raiser Evaluation
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      Score: {evaluation.overallScore}/100
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase border ${
                        evaluation.overallScore >= 80
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                          : evaluation.overallScore >= 65
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                      }`}
                    >
                      {evaluation.verdict}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {evaluation.pacingInsight}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-semibold transition-all shadow-xs"
                >
                  {currentIndex < questions.length - 1 ? (
                    <>
                      Next Question <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Complete Session <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* STAR 4-Pillar Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(evaluation.starBreakdown).map(
                  ([pillar, data]) => (
                    <div
                      key={pillar}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {pillar}
                        </span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {data.score}%
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            data.score >= 80
                              ? "bg-emerald-500"
                              : data.score >= 65
                                ? "bg-blue-500"
                                : "bg-amber-500"
                          }`}
                          style={{ width: `${data.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                        {data.feedback}
                      </p>
                    </div>
                  ),
                )}
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> What You Did Well
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {evaluation.strengths.map((str, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: Fixed items
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> High-Impact
                    Improvements
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {evaluation.improvements.map((imp, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: Fixed items
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Exemplary Model Answer */}
              {evaluation.modelAnswer && (
                <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Exemplary Top 1% Model
                    Answer
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    &ldquo;{evaluation.modelAnswer}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
