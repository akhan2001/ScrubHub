"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      variant="outline"
      size="icon-sm"
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden"
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      <span className="sr-only">{label}</span>
    </Button>
  );
}
