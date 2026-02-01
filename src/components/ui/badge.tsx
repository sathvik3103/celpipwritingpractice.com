import type { HTMLAttributes } from "react";

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const toneStyles: Record<BadgeTone, string> = {
  neutral: "bg-[var(--surface-muted)] text-neutral-700 dark:text-neutral-200",
  accent: "bg-[var(--accent-soft)] text-blue-700 dark:text-blue-200",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200",
  danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-200",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]} ${className ?? ""}`}
      {...props}
    />
  );
}
