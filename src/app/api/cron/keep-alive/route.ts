import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/cron/keep-alive
 *
 * Lightweight endpoint that pings the database to prevent Railway's
 * PostgreSQL instance from going to sleep due to inactivity.
 *
 * Protected by CRON_SECRET so only authorised callers (Vercel Cron,
 * cron-job.org, UptimeRobot, etc.) can trigger it.
 *
 * Recommended: hit this endpoint every 5 minutes via an external cron
 * service to keep the DB connection warm.
 */
export async function GET(req: NextRequest) {
  // ── Auth guard ──────────────────────────────────────────────
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.get("authorization");
    const querySecret = req.nextUrl.searchParams.get("secret");

    const provided = authHeader?.replace("Bearer ", "") ?? querySecret;

    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // ── Ping the database ──────────────────────────────────────
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;

    return NextResponse.json({
      ok: true,
      dbLatencyMs: latencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[keep-alive] Database ping failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
