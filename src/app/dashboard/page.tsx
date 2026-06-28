import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, withRetry } from "@/lib/prisma";
import { AppHeader } from "@/components/app-header";
import { LocalDateTime } from "@/components/ui/local-datetime";
import {
  ClipboardCheck,
  Eye,
  FileQuestion,
  Layers,
  ListChecks,
  Mail,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  
  // Retry transient serverless database connection failures.
  const [recentSessions, kpisOverall, kpisContent, kpisVocab, kpisReadability, kpisTask] = await withRetry(() =>
    Promise.all([
      prisma.practiceSession.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          taskType: true,
          scoreOverall: true,
          questionText: true,
          createdAt: true,
        },
      }),
      prisma.practiceSession.aggregate({
        where: { userId },
        _avg: { scoreOverall: true },
        _min: { scoreOverall: true },
        _max: { scoreOverall: true },
        _count: true,
      }),
      prisma.practiceSession.aggregate({
        where: { userId, scoreContent: { not: null } },
        _avg: { scoreContent: true },
        _min: { scoreContent: true },
        _max: { scoreContent: true },
      }),
      prisma.practiceSession.aggregate({
        where: { userId, scoreVocabulary: { not: null } },
        _avg: { scoreVocabulary: true },
        _min: { scoreVocabulary: true },
        _max: { scoreVocabulary: true },
      }),
      prisma.practiceSession.aggregate({
        where: { userId, scoreReadability: { not: null } },
        _avg: { scoreReadability: true },
        _min: { scoreReadability: true },
        _max: { scoreReadability: true },
      }),
      prisma.practiceSession.aggregate({
        where: { userId, scoreTaskFulfillment: { not: null } },
        _avg: { scoreTaskFulfillment: true },
        _min: { scoreTaskFulfillment: true },
        _max: { scoreTaskFulfillment: true },
      }),
    ])
  );

  const hasSessions = (kpisOverall._count ?? 0) > 0;
  const avg = kpisOverall._avg?.scoreOverall != null ? Math.round(kpisOverall._avg.scoreOverall) : null;
  const min = kpisOverall._min?.scoreOverall ?? null;
  const max = kpisOverall._max?.scoreOverall ?? null;
  const round = (n: number | null) => (n != null ? Math.round(n) : null);
  const cat = (a: { _avg: { [k: string]: number | null }; _min: { [k: string]: number | null }; _max: { [k: string]: number | null } }, key: string) => ({
    avg: round(a._avg?.[key] ?? null),
    min: a._min?.[key] ?? null,
    max: a._max?.[key] ?? null,
  });
  const contentKpi = cat(kpisContent, "scoreContent");
  const vocabKpi = cat(kpisVocab, "scoreVocabulary");
  const readabilityKpi = cat(kpisReadability, "scoreReadability");
  const taskKpi = cat(kpisTask, "scoreTaskFulfillment");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        </div>

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Your Scores</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Best, worst, and average results</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Best overall</p>
                    <p className="text-3xl font-semibold">{hasSessions && max != null ? max : "—"}</p>
                  </div>
                  <IconBadge icon={<TrendingUp className="h-5 w-5" />} tone="success" />
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Worst overall</p>
                    <p className="text-3xl font-semibold">{hasSessions && min != null ? min : "—"}</p>
                  </div>
                  <IconBadge icon={<TrendingDown className="h-5 w-5" />} tone="warning" />
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Average overall</p>
                    <p className="text-3xl font-semibold">{hasSessions && avg != null ? avg : "—"}</p>
                  </div>
                  <IconBadge icon={<ClipboardCheck className="h-5 w-5" />} tone="accent" />
                </div>
              </CardHeader>
            </Card>
          </div>
          {!hasSessions && (
            <p className="text-sm text-neutral-500 mt-3">Complete a practice to see your KPIs.</p>
          )}
        </section>

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Scores by Category</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Highlights across the rubric</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="px-4 pb-4">
                <div className="flex items-start gap-3 mb-4">
                  <IconBadge icon={<Layers className="h-5 w-5" />} tone="accent" />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-1">Content/Coherence</CardTitle>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Idea quality & organization</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pt-0">
                <div className="flex gap-1.5">
                  <Badge tone="success" className="font-medium px-2">Best {contentKpi.max ?? "—"}</Badge>
                  <Badge tone="danger" className="font-medium px-2">Worst {contentKpi.min ?? "—"}</Badge>
                  <Badge tone="accent" className="font-medium px-2">Avg {contentKpi.avg ?? "—"}</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="px-4 pb-4">
                <div className="flex items-start gap-3 mb-4">
                  <IconBadge icon={<Sparkles className="h-5 w-5" />} tone="accent" />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-1">Vocabulary</CardTitle>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Word choice & range</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pt-0">
                <div className="flex gap-1.5">
                  <Badge tone="success" className="font-medium px-2">Best {vocabKpi.max ?? "—"}</Badge>
                  <Badge tone="danger" className="font-medium px-2">Worst {vocabKpi.min ?? "—"}</Badge>
                  <Badge tone="accent" className="font-medium px-2">Avg {vocabKpi.avg ?? "—"}</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="px-4 pb-4">
                <div className="flex items-start gap-3 mb-4">
                  <IconBadge icon={<Eye className="h-5 w-5" />} tone="accent" />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-1">Readability</CardTitle>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Grammar & structure</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pt-0">
                <div className="flex gap-1.5">
                  <Badge tone="success" className="font-medium px-2">Best {readabilityKpi.max ?? "—"}</Badge>
                  <Badge tone="danger" className="font-medium px-2">Worst {readabilityKpi.min ?? "—"}</Badge>
                  <Badge tone="accent" className="font-medium px-2">Avg {readabilityKpi.avg ?? "—"}</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="px-4 pb-4">
                <div className="flex items-start gap-3 mb-4">
                  <IconBadge icon={<ListChecks className="h-5 w-5" />} tone="accent" />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-1">Task Fulfillment</CardTitle>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Answering the Question</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pt-0">
                <div className="flex gap-1.5">
                  <Badge tone="success" className="font-medium px-2">Best {taskKpi.max ?? "—"}</Badge>
                  <Badge tone="danger" className="font-medium px-2">Worst {taskKpi.min ?? "—"}</Badge>
                  <Badge tone="accent" className="font-medium px-2">Avg {taskKpi.avg ?? "—"}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <hr className="border-t border-neutral-300 dark:border-neutral-600 my-8" />

        <section className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Quick actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/practice?task=1"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              <Mail className="h-4 w-4" />
              Start Task 1: Email
            </Link>
            <Link
              href="/practice?task=2"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              <FileQuestion className="h-4 w-4" />
              Start Task 2: Survey
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              <ClipboardCheck className="h-4 w-4" />
              View history
            </Link>
          </div>
        </section>

        <hr className="border-t border-neutral-300 dark:border-neutral-600 mb-8" />

        <section>
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Recent sessions</h2>
          {recentSessions.length === 0 ? (
            <p className="text-neutral-500 dark:text-neutral-400">No practice sessions yet. Start a practice above.</p>
          ) : (
            <ul className="space-y-3">
              {recentSessions.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/session/${s.id}`}
                    className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2 flex-1">
                        {s.questionText.slice(0, 120)}…
                      </p>
                      <span className="text-sm font-medium shrink-0">
                        Task {s.taskType} · Score {s.scoreOverall ?? "—"}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      <LocalDateTime
                        value={new Date(s.createdAt).toISOString()}
                        options={{ year: "numeric", month: "numeric", day: "numeric" }}
                      />{" "}
                      <LocalDateTime
                        value={new Date(s.createdAt).toISOString()}
                        options={{ hour: "2-digit", minute: "2-digit" }}
                      />
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
