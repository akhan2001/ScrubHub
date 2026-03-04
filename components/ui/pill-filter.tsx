"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type PillFilterProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function PillFilter({
  className,
  active = false,
  children,
  ...props
}: PillFilterProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
        "backdrop-blur-md",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border/70 bg-background/90 text-foreground hover:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
