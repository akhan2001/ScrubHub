"use client";

import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import type { ListingWithCoordinates } from "@/lib/map/mock-coordinates";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { ListingPreview } from "@/components/listings/ListingPreview";
import { ListingModal } from "@/components/listings/ListingModal";
import { cn } from "@/lib/utils";

type ListingPanelProps = {
  listings: ListingWithCoordinates[];
  activeListingId: string | null;
  hoveredListingId: string | null;
  onSelectListing: (id: string) => void;
  onHoverListing: (id: string | null) => void;
  autoOpenListingId?: string | null;
  className?: string;
};

function formatPrice(cents: number | null) {
  if (!cents) return "Price on request";
  return `$${Math.round(cents / 100)} / night`;
}

export function ListingPanel({
  listings,
  activeListingId,
  hoveredListingId,
  onSelectListing,
  onHoverListing,
  autoOpenListingId,
  className,
}: ListingPanelProps) {
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [modalListing, setModalListing] = useState<ListingWithCoordinates | null>(null);
  const autoOpenedRef = useRef(false);
  const activeListing =
    listings.find((listing) => listing.id === activeListingId) ?? listings[0] ?? null;

  useEffect(() => {
    if (!activeListingId) return;
    rowRefs.current[activeListingId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeListingId]);

  useEffect(() => {
    if (autoOpenedRef.current || !autoOpenListingId) return;
    const match = listings.find((l) => l.id === autoOpenListingId);
    if (match) {
      setModalListing(match);
      autoOpenedRef.current = true;
    }
  }, [autoOpenListingId, listings]);

  return (
    <section className={cn("flex h-full flex-col rounded-3xl border border-border bg-card", className)}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-5 py-4 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Most popular</p>
          <p className="text-sm font-medium text-foreground">{listings.length} properties visible</p>
        </div>
        <IconButton variant="subtle" aria-label="Share listings">
          <Share2 className="size-4" />
        </IconButton>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {activeListing ? (
          <ListingPreview
            listing={activeListing}
            onViewDetails={() => setModalListing(activeListing)}
          />
        ) : null}

        <div className="space-y-3">
          <p className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Nearby picks
          </p>
          <ul className="space-y-2">
            {listings.map((listing) => {
              const isActive = listing.id === activeListingId;
              const isHovered = listing.id === hoveredListingId;
              return (
                <li
                  key={listing.id}
                  ref={(node) => {
                    rowRefs.current[listing.id] = node;
                  }}
                  onMouseEnter={() => onHoverListing(listing.id)}
                  onMouseLeave={() => onHoverListing(null)}
                  className={cn(
                    "rounded-2xl border bg-background p-3 transition-all",
                    isActive
                      ? "border-foreground/30 shadow-sm"
                      : "border-border hover:border-foreground/20",
                    isHovered && !isActive ? "border-foreground/35 bg-muted/40" : ""
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectListing(listing.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{listing.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {listing.address ?? "Address pending"}
                        </p>
                      </div>
                      <Badge variant={listing.status === "published" ? "default" : "secondary"} className="capitalize">
                        {listing.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatPrice(listing.price_cents)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalListing(listing)}
                    className="mt-2 inline-flex text-xs font-medium text-primary hover:underline"
                  >
                    Open details
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <ListingModal
        listing={modalListing}
        open={modalListing !== null}
        onOpenChange={(open) => {
          if (!open) setModalListing(null);
        }}
      />
    </section>
  );
}
