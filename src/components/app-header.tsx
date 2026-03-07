"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutGrid, PenTool, ScrollText } from "lucide-react";
import { AppLogo } from "./icons/app-logo";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center">
            <AppLogo className="h-6 w-6" />
          </span>
          CELPIP Writing Practice
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
          <Link
            href="/dashboard"
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors ${
              pathname === "/dashboard"
                ? "bg-[var(--accent-soft)] text-blue-700 dark:text-blue-200"
                : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/practice"
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors ${
              pathname?.startsWith("/practice")
                ? "bg-[var(--accent-soft)] text-blue-700 dark:text-blue-200"
                : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            <PenTool className="h-4 w-4" />
            Practice
          </Link>
          <Link
            href="/history"
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors ${
              pathname?.startsWith("/history")
                ? "bg-[var(--accent-soft)] text-blue-700 dark:text-blue-200"
                : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            <ScrollText className="h-4 w-4" />
            History
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
