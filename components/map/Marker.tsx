import { cn } from "@/lib/utils";

export function markerClassName({
  active,
  hovered,
}: {
  active?: boolean;
  hovered?: boolean;
}) {
  return cn(
    "rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm transition-transform duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
    active
      ? "scale-105 border-foreground bg-foreground text-background"
      : hovered
        ? "scale-105 border-foreground/40 bg-background text-foreground"
        : "border-border bg-background/95 text-foreground"
  );
}

export function createMarkerElement({
  label,
  active,
  hovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  label: string;
  active?: boolean;
  hovered?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = markerClassName({ active, hovered });
  button.textContent = label;
  button.setAttribute("aria-label", `Open listing ${label}`);
  button.addEventListener("click", onClick);
  button.addEventListener("mouseenter", onMouseEnter);
  button.addEventListener("mouseleave", onMouseLeave);
  return button;
}
