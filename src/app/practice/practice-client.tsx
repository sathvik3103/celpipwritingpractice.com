"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Clock,
  ClipboardList,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquareText,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { EvaluationCards } from "@/components/evaluation/evaluation-cards";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";

const TIMER_SECONDS = 26 * 60; // 26 minutes

type ExampleQuestion = { id: string; title: string | null; body: string; sortOrder: number };

export function PracticeClient({
  initialTaskType,
  initialExampleQuestions,
}: {
  initialTaskType: number;
  initialExampleQuestions: ExampleQuestion[];
}) {
  const router = useRouter();
  const evaluationSectionRef = useRef<HTMLDivElement | null>(null);
  const [taskType, setTaskType] = useState(initialTaskType);
  const [exampleQuestions, setExampleQuestions] = useState(initialExampleQuestions);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | "custom">(
    initialExampleQuestions[0]?.id ?? "custom"
  );
  const [customQuestion, setCustomQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionCollapsed, setQuestionCollapsed] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TIMER_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [evaluationCollapsed, setEvaluationCollapsed] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    evaluationRaw: string;
    scores: {
      overall: number | null;
      content: number | null;
      vocabulary: number | null;
      readability: number | null;
      taskFulfillment: number | null;
    };
  } | null>(null);
  const prevTaskTypeRef = useRef<number>(initialTaskType);

  const questionText =
    selectedQuestionId === "custom"
      ? customQuestion
      : exampleQuestions.find((q) => q.id === selectedQuestionId)?.body ?? "";

  // Load example questions when task type changes
  useEffect(() => {
    if (taskType === initialTaskType) {
      setExampleQuestions(initialExampleQuestions);
      setSelectedQuestionId(initialExampleQuestions[0]?.id ?? "custom");
    } else {
      fetch(`/api/example-questions?taskType=${taskType}`)
        .then((r) => r.json())
        .then((data) => {
          setExampleQuestions(Array.isArray(data) ? data : []);
          setSelectedQuestionId(Array.isArray(data) && data[0] ? data[0].id : "custom");
        })
        .catch(() => setExampleQuestions([]));
    }

    // Only reset the evaluation when the task actually changes.
    // (A route refresh can change `initialExampleQuestions` identity without a task change.)
    if (taskType !== prevTaskTypeRef.current) {
      prevTaskTypeRef.current = taskType;
      setResult(null);
      setAnswer("");
    }
  }, [taskType, initialTaskType, initialExampleQuestions]);

  // Timer
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;
    const t = setInterval(() => setTimeRemaining((s) => (s <= 0 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [timerActive, timeRemaining]);

  useEffect(() => {
    if (!result) return;
    if (evaluationCollapsed) return;
    evaluationSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result, evaluationCollapsed]);

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  const handleSubmit = useCallback(async () => {
    if (!questionText.trim() || !answer.trim()) {
      setError("Please enter the question and your response.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType,
          questionText,
          answerText: answer,
          exampleQuestionId: selectedQuestionId === "custom" ? undefined : selectedQuestionId,
          timeRemainingSeconds: timerActive ? timeRemaining : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Evaluation failed.");
        return;
      }
      setResult(data);
      setEvaluationCollapsed(false);
      setTimerActive(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [questionText, answer, taskType, selectedQuestionId, timerActive, timeRemaining, router]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const primaryButton =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2";
  const secondaryButton =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-[var(--surface-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2";
  const inputBase =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Practice session</p>
        <h1 className="text-3xl font-semibold tracking-tight">Write and get feedback</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between gap-4 h-full py-5">
            <div className="flex items-center gap-3">
              <IconBadge icon={<ClipboardList className="h-5 w-5" />} tone="accent" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Task type
                </p>
                <CardTitle className="whitespace-nowrap">Select your task</CardTitle>
              </div>
            </div>
            <select
              value={taskType}
              onChange={(e) => setTaskType(Number(e.target.value))}
              className={`${inputBase} w-auto max-w-[140px] py-2 px-3 text-xs`}
            >
              <option value={1}>Task 1 (Email)</option>
              <option value={2}>Task 2 (Survey)</option>
            </select>
          </CardHeader>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between gap-4 h-full py-5">
            <div className="flex items-center gap-3">
              <IconBadge icon={<Clock className="h-5 w-5" />} tone="warning" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Timer
                </p>
                <CardTitle className="whitespace-nowrap text-base">26-min practice</CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="warning" className="text-xs px-2 py-1 font-mono tabular-nums">
                {formatTime(timeRemaining)}
              </Badge>
              {!timerActive ? (
                <button
                  type="button"
                  onClick={() => {
                    setTimerActive(true);
                    setTimeRemaining(TIMER_SECONDS);
                  }}
                  className={`${primaryButton} px-3 py-2 text-xs`}
                >
                  <Play className="h-3.5 w-3.5" />
                  Start
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimerActive(false)}
                  className={`${secondaryButton} px-3 py-2 text-xs`}
                >
                  <Pause className="h-3.5 w-3.5" />
                  Pause
                </button>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader
          className="flex flex-row items-center justify-between gap-3 cursor-pointer select-none pb-5"
          onClick={() => setQuestionCollapsed(!questionCollapsed)}
        >
          <div className="flex items-center gap-3">
            <IconBadge icon={<HelpCircle className="h-5 w-5" />} tone="danger" />
            <CardTitle>Question</CardTitle>
          </div>
          <button
            type="button"
            className="p-1 hover:bg-[var(--surface-muted)] rounded-lg transition-colors"
          >
            {questionCollapsed ? (
              <ChevronDown className="h-5 w-5 text-neutral-500" />
            ) : (
              <ChevronUp className="h-5 w-5 text-neutral-500" />
            )}
          </button>
        </CardHeader>
        {!questionCollapsed && (
          <CardContent className="space-y-5">
            <select
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value as string | "custom")}
              className={inputBase}
            >
              <option value="custom">Custom question</option>
              {exampleQuestions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title ?? `Question ${q.sortOrder}`}
                </option>
              ))}
            </select>
            {selectedQuestionId === "custom" ? (
              <textarea
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Paste or type the question prompt here..."
                rows={12}
                className={`${inputBase} min-h-[280px] resize-y`}
              />
            ) : (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
                <span className="font-bold">Prompt:</span> {questionText}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconBadge icon={<MessageSquareText className="h-5 w-5" />} tone="accent" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Your response
              </p>
              <CardTitle>150–200 words</CardTitle>
            </div>
          </div>
          <Badge tone="neutral">Word count: {wordCount}</Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here..."
            rows={24}
            className={`${inputBase} min-h-[560px] resize-y`}
          />
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/50 dark:text-rose-200">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !questionText.trim() || !answer.trim()}
        className={`${primaryButton} disabled:opacity-50`}
      >
        <Sparkles className="h-4 w-4" />
        {loading ? "Evaluating…" : result ? "Re-evaluate" : "Submit for evaluation"}
      </button>

      {result && (
        <section ref={evaluationSectionRef} className="pt-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Evaluation</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/session/${result.id}`} className={secondaryButton}>
                View in history
              </Link>
              <button
                type="button"
                onClick={() => {
                  setEvaluationCollapsed((v) => !v);
                }}
                className={secondaryButton}
              >
                {evaluationCollapsed ? (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Expand
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Collapse
                  </>
                )}
              </button>
            </div>
          </div>

          {!evaluationCollapsed && (
            <EvaluationCards
              evaluationRaw={result.evaluationRaw}
              scores={{
                overall: result.scores.overall,
                content: result.scores.content,
                vocabulary: result.scores.vocabulary,
                readability: result.scores.readability,
                taskFulfillment: result.scores.taskFulfillment,
              }}
            />
          )}
        </section>
      )}
    </div>
  );
}
