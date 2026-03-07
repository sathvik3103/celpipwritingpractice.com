"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";
import { AppLogo } from "@/components/icons/app-logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center">
              <AppLogo className="h-6 w-6" />
            </span>
            CELPIP Writing Practice
          </Link>
          <Link href="/login" className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100">
            Log in
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight">Forgot password</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <Card>
            <CardHeader className="flex items-center gap-3">
              <IconBadge icon={<Mail className="h-5 w-5" />} tone="accent" />
              <CardTitle className="text-base">
                {submitted ? "Check your email" : "Reset your password"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {submitted ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/50 dark:text-emerald-200">
                    If an account with <strong>{email}</strong> exists, we&apos;ve sent a
                    password reset link. Please check your inbox (and spam folder).
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Didn&apos;t receive it?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setError("");
                      }}
                      className="font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
                    >
                      Try again
                    </button>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/50 dark:text-rose-200">
                      {error}
                    </div>
                  )}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      placeholder="you@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                  >
                    {loading ? "Sending…" : "Send reset link"}
                  </button>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="text-sm text-neutral-500 text-center">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-neutral-900 dark:text-neutral-100 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
