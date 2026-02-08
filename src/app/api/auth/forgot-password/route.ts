import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, withRetry } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Look up user — only proceed if they have a password-based account
    const user = await withRetry(() =>
      prisma.user.findUnique({ where: { email } })
    );

    if (user?.passwordHash) {
      // Generate token and send email
      const raw = await createPasswordResetToken(email);

      const baseUrl =
        process.env.NEXTAUTH_URL ?? `https://${req.headers.get("host")}`;
      const resetUrl = `${baseUrl}/reset-password?token=${raw}`;

      await sendPasswordResetEmail(email, resetUrl);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message:
        "If an account with that email exists, we've sent a password reset link.",
    });
  } catch (e) {
    console.error("Forgot-password error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
