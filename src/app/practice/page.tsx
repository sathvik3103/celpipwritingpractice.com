import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, withRetry } from "@/lib/prisma";
import { AppHeader } from "@/components/app-header";
import { PracticeClient } from "./practice-client";

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ task?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { task } = await searchParams;
  const taskType = task === "2" ? 2 : 1;

  // Retry transient serverless database connection failures.
  const exampleQuestions = await withRetry(() =>
    prisma.exampleQuestion.findMany({
      where: { taskType },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true, body: true, sortOrder: true },
    })
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <PracticeClient
          initialTaskType={taskType}
          initialExampleQuestions={exampleQuestions}
        />
      </main>
    </div>
  );
}
