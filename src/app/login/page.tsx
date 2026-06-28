"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";
import { AppLogo } from "@/components/icons/app-logo";
import { GoogleAuthButton } from "@/components/google-auth-button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
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
          <Link href="/signup" className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100">
            Sign up
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Welcome back</p>
            <h1 className="text-3xl font-semibold tracking-tight">Log in</h1>
          </div>

          <Card>
            <CardHeader className="flex items-center gap-3">
              <IconBadge icon={<LogIn className="h-5 w-5" />} tone="accent" />
              <CardTitle className="text-base">Sign in to your account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
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
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 pr-10 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                >
                  {loading ? "Signing in…" : "Log in"}
                </button>
              </form>

              <GoogleAuthButton callbackUrl={callbackUrl} />
            </CardContent>
          </Card>

          <p className="text-sm text-neutral-500 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-neutral-900 dark:text-neutral-100 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-[var(--background)]">
          <header className="border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 flex justify-between items-center">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                CELPIP Writing Practice
              </Link>
              <Link href="/signup" className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                Sign up
              </Link>
            </div>
          </header>
          <main className="flex-1 flex items-center justify-center px-4 py-12">
            <p className="text-neutral-500">Loading…</p>
          </main>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
