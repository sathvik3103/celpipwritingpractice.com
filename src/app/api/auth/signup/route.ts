import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma, withRetry } from "@/lib/prisma";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { email, password, name } = parsed.data;
    
    // Retry transient serverless database connection failures.
    const existing = await withRetry(() =>
      prisma.user.findUnique({ where: { email } })
    );
    
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }
    const passwordHash = await hash(password, 12);
    
    await withRetry(() =>
      prisma.user.create({
        data: { email, name: name ?? null, passwordHash },
      })
    );
    
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
