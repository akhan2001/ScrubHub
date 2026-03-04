import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex size-9 items-center justify-center rounded-full border transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground hover:bg-muted",
        subtle: "border-transparent bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function IconButton({
  className,
  variant,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButtonVariants>) {
  return (
    <button
      type="button"
      className={cn(iconButtonVariants({ variant }), className)}
      {...props}
    />
  );
}
