"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";

export function HistoryFilters({
  currentTask,
  currentFrom,
  currentTo,
  currentSort,
}: {
  currentTask?: string;
  currentFrom?: string;
  currentTo?: string;
  currentSort?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilters(updates: { task?: string; from?: string; to?: string; sort?: string }) {
    const next = new URLSearchParams(searchParams.toString());
    if (updates.task !== undefined) {
      if (updates.task) next.set("task", updates.task);
      else next.delete("task");
    }
    if (updates.from !== undefined) {
      if (updates.from) next.set("from", updates.from);
      else next.delete("from");
    }
    if (updates.to !== undefined) {
      if (updates.to) next.set("to", updates.to);
      else next.delete("to");
    }
    if (updates.sort !== undefined) {
      if (updates.sort) next.set("sort", updates.sort);
      else next.delete("sort");
    }
    router.push(`/history?${next.toString()}`);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <IconBadge icon={<SlidersHorizontal className="h-5 w-5" />} tone="neutral" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Filters
            </p>
            <CardTitle className="text-base">Refine your history</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Task
            <select
              value={currentTask ?? ""}
              onChange={(e) => updateFilters({ task: e.target.value === "" ? "" : e.target.value })}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="">All</option>
              <option value="1">Task 1 (Email)</option>
              <option value="2">Task 2 (Survey)</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            From
            <input
              type="date"
              value={currentFrom ?? ""}
              onChange={(e) => updateFilters({ from: e.target.value || undefined })}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            To
            <input
              type="date"
              value={currentTo ?? ""}
              onChange={(e) => updateFilters({ to: e.target.value || undefined })}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Sort by
            <select
              value={currentSort ?? "date-desc"}
              onChange={(e) => updateFilters({ sort: e.target.value || undefined })}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="date-desc">Date (Newest first)</option>
              <option value="date-asc">Date (Oldest first)</option>
              <option value="score-desc">Score (Highest first)</option>
              <option value="score-asc">Score (Lowest first)</option>
              <option value="task-asc">Task Type (1 → 2)</option>
              <option value="task-desc">Task Type (2 → 1)</option>
            </select>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
