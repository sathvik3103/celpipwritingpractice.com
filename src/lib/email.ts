import nodemailer from "nodemailer";

/**
 * Creates a nodemailer transporter.
 *
 * If SMTP_USER and SMTP_PASSWORD are set, uses Gmail SMTP.
 * Otherwise, falls back to a console-only transport (logs the email
 * to stdout so you can test the flow without a real mail server).
 */
function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (user && pass) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  // Dev fallback: log emails to console
  return null;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║  📧 EMAIL (dev mode — no SMTP configured)                   ║");
    console.log("╠══════════════════════════════════════════════════════════════╣");
    console.log(`║  To:      ${to}`);
    console.log(`║  Subject: ${subject}`);
    console.log("║  Body (text):");
    console.log(`║  ${text ?? html}`);
    console.log("╚══════════════════════════════════════════════════════════════╝\n");
    return;
  }

  await transporter.sendMail({
    from: `"CELPIP Writing Practice" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
}

/**
 * Send a password-reset email containing a one-time link.
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Reset your password</h2>
      <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        We received a request to reset the password for your CELPIP Writing Practice account.
        Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
      </p>
      <a href="${resetUrl}"
         style="display: inline-block; background: #171717; color: #fff; text-decoration: none;
                padding: 12px 28px; border-radius: 12px; font-size: 14px; font-weight: 600;">
        Reset password
      </a>
      <p style="color: #888; font-size: 13px; margin-top: 24px; line-height: 1.5;">
        If you didn't request this, you can safely ignore this email — your password won't change.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #aaa; font-size: 12px;">
        CELPIP Writing Practice
      </p>
    </div>
  `;

  const text = [
    "Reset your password",
    "",
    "We received a request to reset the password for your CELPIP Writing Practice account.",
    "Visit the link below to choose a new password. It expires in 1 hour.",
    "",
    resetUrl,
    "",
    "If you didn't request this, you can safely ignore this email.",
  ].join("\n");

  await sendEmail({
    to: email,
    subject: "Reset your password — CELPIP Writing Practice",
    html,
    text,
  });
}
