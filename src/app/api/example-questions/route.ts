import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskType = searchParams.get("taskType");
  if (!taskType || (taskType !== "1" && taskType !== "2")) {
    return NextResponse.json({ error: "taskType must be 1 or 2" }, { status: 400 });
  }
  
  // Retry transient serverless database connection failures.
  const questions = await withRetry(() =>
    prisma.exampleQuestion.findMany({
      where: { taskType: parseInt(taskType, 10) },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true, body: true, sortOrder: true },
    })
  );
  
  return NextResponse.json(questions);
}
