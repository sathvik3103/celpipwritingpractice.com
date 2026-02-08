import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, withRetry } from "@/lib/prisma";
import { AppHeader } from "@/components/app-header";
import { LocalDateTime } from "@/components/ui/local-datetime";
import { HistoryFilters } from "./history-filters";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ task?: string; from?: string; to?: string; sort?: string }>;
}) {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { task, from, to, sort } = await searchParams;
  const taskFilter = task === "1" ? 1 : task === "2" ? 2 : undefined;
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;
  const sortBy = sort || "date-desc";

  const where: { userId: string; taskType?: number; createdAt?: { gte?: Date; lte?: Date } } = {
    userId: session.user.id,
  };
  if (taskFilter != null) where.taskType = taskFilter;
  if (fromDate || toDate) {
    where.createdAt = {};
    if (fromDate) where.createdAt.gte = fromDate;
    if (toDate) where.createdAt.lte = toDate;
  }

  // Determine orderBy based on sort parameter
  let orderBy: { createdAt?: "asc" | "desc"; scoreOverall?: "asc" | "desc"; taskType?: "asc" | "desc" } | Array<{ createdAt?: "asc" | "desc"; scoreOverall?: "asc" | "desc"; taskType?: "asc" | "desc" }>;
  
  if (sortBy === "date-desc") {
    orderBy = { createdAt: "desc" };
  } else if (sortBy === "date-asc") {
    orderBy = { createdAt: "asc" };
  } else if (sortBy === "score-desc") {
    // For score sorting, we need to handle nulls. Prisma doesn't support nullsLast/nullFirst directly,
    // so we'll sort by scoreOverall desc, then createdAt desc as secondary
    orderBy = [{ scoreOverall: "desc" }, { createdAt: "desc" }];
  } else if (sortBy === "score-asc") {
    orderBy = [{ scoreOverall: "asc" }, { createdAt: "desc" }];
  } else if (sortBy === "task-asc") {
    orderBy = [{ taskType: "asc" }, { createdAt: "desc" }];
  } else if (sortBy === "task-desc") {
    orderBy = [{ taskType: "desc" }, { createdAt: "desc" }];
  } else {
    // Default to date-desc
    orderBy = { createdAt: "desc" };
  }

  // Use retry logic to handle Railway database cold starts
  const sessions = await withRetry(() =>
    prisma.practiceSession.findMany({
      where,
      orderBy,
      select: {
        id: true,
        taskType: true,
        questionText: true,
        scoreOverall: true,
        createdAt: true,
        timeTakenSeconds: true,
      },
    })
  );

  // Handle null scores for proper sorting (nulls should go to end)
  // Prisma doesn't handle nulls in orderBy the way we want, so we'll sort in memory
  if (sortBy === "score-desc" || sortBy === "score-asc") {
    sessions.sort((a, b) => {
      const aScore = a.scoreOverall ?? -1; // Treat null as -1 for sorting
      const bScore = b.scoreOverall ?? -1;
      
      if (sortBy === "score-desc") {
        // Highest first, nulls last
        if (a.scoreOverall === null && b.scoreOverall === null) return 0;
        if (a.scoreOverall === null) return 1;
        if (b.scoreOverall === null) return -1;
        return bScore - aScore;
      } else {
        // Lowest first, nulls last
        if (a.scoreOverall === null && b.scoreOverall === null) return 0;
        if (a.scoreOverall === null) return 1;
        if (b.scoreOverall === null) return -1;
        return aScore - bScore;
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Sessions</p>
          <h1 className="text-3xl font-semibold tracking-tight">History</h1>
        </div>

        <HistoryFilters currentTask={task} currentFrom={from} currentTo={to} currentSort={sort} />

        {sessions.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400 mt-6">
            No practice sessions match your filters. Complete a practice from the{" "}
            <Link href="/practice" className="font-medium text-neutral-900 dark:text-neutral-100 hover:underline">
              Practice
            </Link>{" "}
            page.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/session/${s.id}`}
                  className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2 flex-1 min-w-0">
                      {s.questionText.slice(0, 160)}
                      {s.questionText.length > 160 ? "…" : ""}
                    </p>
                    <span className="text-sm font-medium shrink-0">
                      Task {s.taskType} · Score {s.scoreOverall ?? "—"}/12
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    <LocalDateTime
                      value={s.createdAt.toISOString()}
                      options={{ year: "numeric", month: "numeric", day: "numeric" }}
                    />{" "}
                    <LocalDateTime
                      value={s.createdAt.toISOString()}
                      options={{ hour: "2-digit", minute: "2-digit" }}
                    />
                    {s.timeTakenSeconds != null
                      ? ` · Time taken ${formatTime(s.timeTakenSeconds)}`
                      : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
