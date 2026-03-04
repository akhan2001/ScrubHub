"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, List, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import type { Listing } from "@/types/database";
import { withMockCoordinates } from "@/lib/map/mock-coordinates";
import { MapView } from "@/components/map/MapView";
import { ListingPanel } from "@/components/listings/ListingPanel";
import { PillFilter } from "@/components/ui/pill-filter";
import { Button } from "@/components/ui/button";

type ListingsMarketplaceProps = {
  listings: Pick<
    Listing,
    "id" | "title" | "description" | "address" | "price_cents" | "status" | "created_at"
  >[];
};

type MobileViewMode = "map" | "list";

const FILTER_ITEMS = ["Type", "Price", "Area", "Beds", "More"];

export function ListingsMarketplace({ listings }: ListingsMarketplaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<MobileViewMode>("map");
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);

  const mappedListings = useMemo(() => withMockCoordinates(listings), [listings]);
  const selectedFromQuery = searchParams.get("listing");
  const initialListing =
    selectedFromQuery && mappedListings.some((entry) => entry.id === selectedFromQuery)
      ? selectedFromQuery
      : null;
  const [activeListingId, setActiveListingId] = useState<string | null>(initialListing);
  const effectiveActiveId = activeListingId ?? mappedListings[0]?.id ?? null;

  useEffect(() => {
    if (!effectiveActiveId) return;
    if (searchParams.get("listing") === effectiveActiveId) return;
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("listing", effectiveActiveId);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [effectiveActiveId, pathname, router, searchParams]);

  if (!mappedListings.length) {
    return (
      <div className="mx-auto w-full max-w-[var(--container-max)] px-4 py-10">
        <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          No published listings available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Find your next property</h1>
          <p className="text-sm text-muted-foreground">
            Map-first view with contextual listing previews.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card p-1 lg:hidden">
          <Button
            size="sm"
            variant={viewMode === "map" ? "default" : "ghost"}
            onClick={() => setViewMode("map")}
          >
            <MapIcon className="mr-1 size-4" />
            Map
          </Button>
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "ghost"}
            onClick={() => setViewMode("list")}
          >
            <List className="mr-1 size-4" />
            List
          </Button>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
        <div className="absolute left-3 top-3 z-20 flex max-w-[calc(100%-1.5rem)] gap-2 overflow-x-auto pb-2">
          {FILTER_ITEMS.map((item, index) => (
            <PillFilter key={item} active={index === 0}>
              {item}
              <ChevronDown className="size-3.5" />
            </PillFilter>
          ))}
          <PillFilter>
            <SlidersHorizontal className="size-3.5" />
          </PillFilter>
        </div>

        <div className="grid h-[calc(100vh-12rem)] grid-cols-1 lg:grid-cols-[7fr_5fr]">
          <div className={viewMode === "list" ? "hidden lg:block" : "block"}>
            <MapView
              listings={mappedListings}
              activeListingId={effectiveActiveId}
              hoveredListingId={hoveredListingId}
              onSelectListing={setActiveListingId}
              onHoverListing={setHoveredListingId}
              className="h-full min-h-[420px] w-full"
            />
          </div>
          <div className={viewMode === "map" ? "hidden lg:block" : "block"}>
            <ListingPanel
              listings={mappedListings}
              activeListingId={effectiveActiveId}
              hoveredListingId={hoveredListingId}
              onSelectListing={setActiveListingId}
              onHoverListing={setHoveredListingId}
              className="h-full rounded-none border-0 border-l border-border lg:rounded-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
