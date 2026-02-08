import { randomBytes, createHash } from "crypto";
import { prisma, withRetry } from "./prisma";

const TOKEN_EXPIRY_HOURS = 1;

/**
 * Hash a raw token with SHA-256 before storing it in the database.
 * This way, even if the DB is compromised, tokens cannot be replayed.
 */
function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/**
 * Create a password-reset token for the given email.
 * Returns the raw (unhashed) token to embed in the reset URL.
 *
 * Uses the existing NextAuth `VerificationToken` model:
 *   identifier = user email
 *   token      = SHA-256 hash of the raw token
 *   expires    = now + TOKEN_EXPIRY_HOURS
 */
export async function createPasswordResetToken(email: string): Promise<string> {
  const raw = randomBytes(32).toString("hex");
  const hashed = hashToken(raw);
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  // Delete any previous reset tokens for this email
  await withRetry(() =>
    prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })
  );

  // Create the new token
  await withRetry(() =>
    prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashed,
        expires,
      },
    })
  );

  return raw;
}

/**
 * Verify a password-reset token.
 * Returns the email (identifier) if valid, or null if invalid/expired.
 * On success the token is consumed (deleted) so it cannot be reused.
 */
export async function verifyPasswordResetToken(
  raw: string
): Promise<string | null> {
  const hashed = hashToken(raw);

  const record = await withRetry(() =>
    prisma.verificationToken.findUnique({
      where: { token: hashed },
    })
  );

  if (!record) return null;

  // Check expiry
  if (record.expires < new Date()) {
    // Clean up expired token
    await withRetry(() =>
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier: record.identifier, token: hashed } },
      })
    ).catch(() => {});
    return null;
  }

  // Consume the token
  await withRetry(() =>
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier: record.identifier, token: hashed } },
    })
  );

  return record.identifier;
}
