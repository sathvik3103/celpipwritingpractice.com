"use client";

import type { ReactNode } from "react";
import { Eye, Layers, ListChecks, Sparkles, Trophy } from "lucide-react";
import { parseEvaluationRaw } from "@/lib/evaluation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";

type Scores = {
  overall?: number | null;
  content?: number | null;
  vocabulary?: number | null;
  readability?: number | null;
  taskFulfillment?: number | null;
};

type EvaluationCardsProps = {
  evaluationRaw: string;
  scores?: Scores;
  timeTakenSeconds?: number | null;
};

const categoryIcons: Record<string, ReactNode> = {
  "Content/Coherence": <Layers className="h-5 w-5" />,
  Vocabulary: <Sparkles className="h-5 w-5" />,
  Readability: <Eye className="h-5 w-5" />,
  "Task Fulfillment": <ListChecks className="h-5 w-5" />,
};

function SectionBlock({ title, value }: { title: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </p>
      <p className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
        {value}
      </p>
    </div>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function EvaluationCards({ evaluationRaw, scores, timeTakenSeconds }: EvaluationCardsProps) {
  const parsed = parseEvaluationRaw(evaluationRaw);

  if (!parsed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
            {evaluationRaw}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {scores && (
        <Card className="bg-[var(--surface-elevated)]">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Overall score</p>
              <p className="text-3xl font-semibold text-[var(--foreground)]">
                {scores.overall != null ? `${scores.overall}/12` : "—"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {scores.content != null && <Badge tone="neutral">Content {scores.content}</Badge>}
              {scores.vocabulary != null && <Badge tone="neutral">Vocabulary {scores.vocabulary}</Badge>}
              {scores.readability != null && <Badge tone="neutral">Readability {scores.readability}</Badge>}
              {scores.taskFulfillment != null && <Badge tone="neutral">Task Fulfillment {scores.taskFulfillment}</Badge>}
              {timeTakenSeconds != null && (
                <Badge tone="neutral">Time {formatTime(timeTakenSeconds)}</Badge>
              )}
            </div>
          </CardHeader>
        </Card>
      )}

      {parsed.overall && (
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <IconBadge icon={<Trophy className="h-5 w-5" />} tone="success" />
              <CardTitle>Overall feedback</CardTitle>
            </div>
            {scores?.overall != null && (
              <Badge tone="success" className="text-sm px-4 py-1.5">
                Overall Score {scores.overall}/12
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionBlock title="Key Strengths" value={parsed.overall.strengths} />
            <SectionBlock title="Areas for Improvement" value={parsed.overall.improvements} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {parsed.categories.map((category) => (
          <Card key={category.title}>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <IconBadge icon={categoryIcons[category.title] ?? <ListChecks className="h-5 w-5" />} tone="accent" />
                <CardTitle>{category.title}</CardTitle>
              </div>
              {category.score && (
                <Badge tone="accent" className="text-sm px-4 py-1.5">
                  Score {category.score}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <SectionBlock title="Evaluation" value={category.evaluation} />
              <SectionBlock title="Examples" value={category.examples} />
              <SectionBlock title="Justification" value={category.justification} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
