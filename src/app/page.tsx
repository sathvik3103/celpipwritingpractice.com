import Link from "next/link";
import { Clock, FileCheck, Sparkles, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppLogo } from "@/components/icons/app-logo";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center">
              <AppLogo className="h-6 w-6" />
            </span>
            CELPIP Writing Practice
          </div>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-6">
              Practice CELPIP writing with AI evaluation for FREE!
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-[65ch] mb-3">
              Get FREE CELPIP writing practice tests for Task 1: Email and Task 2: Survey Response with a built-in
              timer, 20 practice questions, and instant AI feedback aligned to the official CELPIP rubric.
            </p>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-[65ch] mb-8">
             Save your sessions, track progress over time, and walk into test day with confidence. NO PAYMENT REQUIRED!!!
            </p>
            <div>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 text-base font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              >
                Get started
              </Link>
            </div>
            <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-500 max-w-[65ch]">
              AI evaluation is for practice only and does not replace an official CELPIP score.
            </p>
          </div>

          <Card className="bg-[var(--surface-elevated)]">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-300 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">26-minute timer like the actual test conditions</p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-300 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  AI evaluation across 4 rubric categories: Content, Vocabulary, Redability & Task Fulfillment
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-300 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Scores 0–12 with detailed feedback
                </p>
              </div>
              <div className="flex items-start gap-3">
                <History className="h-5 w-5 text-blue-600 dark:text-blue-300 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Save sessions and track improvements
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-[var(--border)] mt-auto bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 text-sm text-neutral-500 dark:text-neutral-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>celpipwritingpractice.com — FREE CELPIP writing practice AI tool</span>
            <span>
              Made with <span className="text-rose-500">♥</span> by{" "}
              <Link
                href="https://sathvik.world/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                Sathvik Divili
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
