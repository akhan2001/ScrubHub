import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-[var(--radius-md)] border px-4 py-3 text-sm",
  {
    variants: {
      tone: {
        info: "border-[color:var(--color-info)]/35 bg-[color:var(--color-info)]/12 text-foreground",
        success:
          "border-[color:var(--color-success)]/35 bg-[color:var(--color-success)]/12 text-foreground",
        warning:
          "border-[color:var(--color-warning)]/35 bg-[color:var(--color-warning)]/12 text-foreground",
        error: "border-[color:var(--color-error)]/40 bg-[color:var(--color-error)]/14 text-foreground",
      },
    },
    defaultVariants: {
      tone: "info",
    },
  }
);

function Alert({
  className,
  tone,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div role="alert" data-slot="alert" className={cn(alertVariants({ tone }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
  return <h5 data-slot="alert-title" className={cn("mb-1 font-semibold", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
