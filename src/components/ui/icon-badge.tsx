import type { HTMLAttributes, ReactNode } from "react";

type IconBadgeProps = HTMLAttributes<HTMLDivElement> & {
  icon: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
};

const toneClasses: Record<NonNullable<IconBadgeProps["tone"]>, string> = {
  neutral: "bg-[var(--surface-muted)] text-neutral-700 dark:text-neutral-200",
  accent: "bg-[var(--accent-soft)] text-blue-700 dark:text-blue-200",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200",
  danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-200",
};

export function IconBadge({ icon, tone = "neutral", className, ...props }: IconBadgeProps) {
  return (
    <div
      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${toneClasses[tone]} ${className ?? ""}`}
      {...props}
    >
      {icon}
    </div>
  );
}
