"use client";

import { useMemo } from "react";

type LocalDateTimeProps = {
  value: string;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
};

export function LocalDateTime({ value, options, className }: LocalDateTimeProps) {
  const formatted = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, options).format(new Date(value));
  }, [value, options]);

  return <span className={className}>{formatted}</span>;
}
