import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] ${className ?? ""}`}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={`px-6 pt-6 ${className ?? ""}`} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
  return <h3 className={`text-lg font-semibold text-[var(--foreground)] ${className ?? ""}`} {...props} />;
}

export function CardDescription({ className, ...props }: CardProps) {
  return <p className={`text-sm text-neutral-500 dark:text-neutral-400 ${className ?? ""}`} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={`px-6 pb-6 ${className ?? ""}`} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return <div className={`px-6 pb-6 ${className ?? ""}`} {...props} />;
}
