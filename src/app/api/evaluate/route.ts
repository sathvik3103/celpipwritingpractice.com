import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, withRetry } from "@/lib/prisma";
import { evaluateWithGroq, parseScoresFromEvaluation } from "@/lib/evaluate";
import { z } from "zod";

export const maxDuration = 60;

const bodySchema = z.object({
  taskType: z.union([z.literal(1), z.literal(2)]),
  questionText: z.string().min(1),
  answerText: z.string().min(1),
  exampleQuestionId: z.string().optional(),
  timeRemainingSeconds: z.number().int().min(0).optional(),
  timeTakenSeconds: z.number().int().min(0).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Evaluation service is not configured" },
      { status: 503 }
    );
  }

  const taskLabel = body.taskType === 1 ? "Task 1 (Email)" : "Task 2 (Survey Response)";
  let evaluationRaw: string;
  try {
    evaluationRaw = await evaluateWithGroq(taskLabel, body.questionText, body.answerText);
  } catch (e) {
    console.error("Groq evaluation error:", e);
    return NextResponse.json(
      { error: "Evaluation failed. Please try again." },
      { status: 502 }
    );
  }

  const parsed = parseScoresFromEvaluation(evaluationRaw);

  // Retry transient serverless database connection failures.
  const sessionRecord = await withRetry(() =>
    prisma.practiceSession.create({
      data: {
        userId: session.user.id,
        taskType: body.taskType,
        questionText: body.questionText,
        exampleQuestionId: body.exampleQuestionId ?? null,
        answerText: body.answerText,
        evaluationRaw,
        scoreOverall: parsed.scoreOverall,
        scoreContent: parsed.scoreContent,
        scoreVocabulary: parsed.scoreVocabulary,
        scoreReadability: parsed.scoreReadability,
        scoreTaskFulfillment: parsed.scoreTaskFulfillment,
        timeRemainingSeconds: body.timeRemainingSeconds ?? null,
        timeTakenSeconds: body.timeTakenSeconds ?? null,
      },
    })
  );

  return NextResponse.json({
    id: sessionRecord.id,
    evaluationRaw,
    timeTakenSeconds: sessionRecord.timeTakenSeconds,
    scores: {
      overall: parsed.scoreOverall,
      content: parsed.scoreContent,
      vocabulary: parsed.scoreVocabulary,
      readability: parsed.scoreReadability,
      taskFulfillment: parsed.scoreTaskFulfillment,
    },
  });
}
