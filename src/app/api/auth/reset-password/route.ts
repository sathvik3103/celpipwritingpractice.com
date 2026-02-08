import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma, withRetry } from "@/lib/prisma";
import { verifyPasswordResetToken } from "@/lib/tokens";

const schema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    // Verify and consume the token
    const email = await verifyPasswordResetToken(token);

    if (!email) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash the new password and update the user
    const passwordHash = await hash(password, 12);

    await withRetry(() =>
      prisma.user.update({
        where: { email },
        data: { passwordHash },
      })
    );

    return NextResponse.json({
      message: "Your password has been reset. You can now log in.",
    });
  } catch (e) {
    console.error("Reset-password error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
