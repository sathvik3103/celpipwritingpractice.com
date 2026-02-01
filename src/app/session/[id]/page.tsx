import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/app-header";
import CheckCircle from "lucide-react/dist/esm/icons/check-circle-2";
import HelpCircle from "lucide-react/dist/esm/icons/help-circle";
import MessageSquareText from "lucide-react/dist/esm/icons/message-square-text";
import { EvaluationCards } from "@/components/evaluation/evaluation-cards";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const practiceSession = await prisma.practiceSession.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!practiceSession) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Session detail</p>
            <h1 className="text-3xl font-semibold tracking-tight">Your submission</h1>
          </div>
          <Link
            href="/history"
            className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Back to history
          </Link>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Task {practiceSession.taskType} ·{" "}
          {practiceSession.createdAt.toLocaleDateString()}{" "}
          {practiceSession.createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <section className="mb-6 space-y-4">
          <Card>
            <CardHeader className="flex items-center gap-3">
              <IconBadge 
                icon={<HelpCircle className="h-5 w-5" />} 
                tone="neutral"
                className="bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-200"
              />
              <CardTitle>Question</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
              {practiceSession.questionText}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3">
              <IconBadge icon={<MessageSquareText className="h-5 w-5" />} tone="accent" />
              <CardTitle>Submission</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
              {practiceSession.answerText}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <IconBadge icon={<CheckCircle className="h-5 w-5" />} tone="success" />
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">Evaluation</h2>
              {practiceSession.scoreOverall != null && (
                <Badge tone="accent">Overall {practiceSession.scoreOverall}/12</Badge>
              )}
            </div>
          </div>
          <EvaluationCards
            evaluationRaw={practiceSession.evaluationRaw}
            scores={{
              overall: practiceSession.scoreOverall,
              content: practiceSession.scoreContent,
              vocabulary: practiceSession.scoreVocabulary,
              readability: practiceSession.scoreReadability,
              taskFulfillment: practiceSession.scoreTaskFulfillment,
            }}
          />
        </section>
      </main>
    </div>
  );
}
