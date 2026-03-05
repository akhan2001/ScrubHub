"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { List, Map as MapIcon } from "lucide-react";
import type { ListingWithCoordinates } from "@/lib/map/mock-coordinates";
import type { Listing } from "@/types/database";
import { MapView, type MapBounds } from "@/components/map/MapView";
import { ListingPanel } from "@/components/listings/ListingPanel";
import { MapFilters, type MapFilterValues } from "@/components/listings/map-filters";
import { Button } from "@/components/ui/button";

type ListingsMarketplaceProps = {
  listings: Pick<
    Listing,
    | "id" | "title" | "description" | "address" | "price_cents" | "status" | "created_at"
    | "latitude" | "longitude" | "bedrooms" | "bathrooms" | "square_footage"
    | "is_furnished" | "are_pets_allowed" | "images" | "lease_terms"
  >[];
};

type MobileViewMode = "map" | "list";

export function ListingsMarketplace({ listings: initialListings }: ListingsMarketplaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<MobileViewMode>("map");
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFilterValues>({});
  const [dynamicListings, setDynamicListings] = useState<ListingWithCoordinates[] | null>(null);

  const mappedListings = useMemo<ListingWithCoordinates[]>(() => {
    if (dynamicListings) return dynamicListings;
    return initialListings
      .filter((l): l is typeof l & { latitude: number; longitude: number } =>
        l.latitude != null && l.longitude != null
      )
      .map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description ?? null,
        address: l.address,
        price_cents: l.price_cents,
        status: l.status,
        created_at: l.created_at,
        latitude: l.latitude,
        longitude: l.longitude,
        bedrooms: l.bedrooms ?? null,
        bathrooms: l.bathrooms ?? null,
        square_footage: l.square_footage ?? null,
        is_furnished: l.is_furnished ?? false,
        are_pets_allowed: l.are_pets_allowed ?? false,
        images: l.images ?? null,
        lease_terms: l.lease_terms ?? null,
      }));
  }, [initialListings, dynamicListings]);

  const selectedFromQuery = searchParams.get("listing");
  const shouldAutoOpenDetail = searchParams.get("view") === "detail";
  const initialListing =
    selectedFromQuery && mappedListings.some((entry) => entry.id === selectedFromQuery)
      ? selectedFromQuery
      : null;
  const [activeListingId, setActiveListingId] = useState<string | null>(initialListing);
  const [autoOpenListingId] = useState<string | null>(
    shouldAutoOpenDetail && initialListing ? initialListing : null
  );
  const effectiveActiveId = activeListingId ?? mappedListings[0]?.id ?? null;

  useEffect(() => {
    if (!effectiveActiveId) return;
    if (searchParams.get("listing") === effectiveActiveId) return;
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("listing", effectiveActiveId);
    nextParams.delete("view");
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [effectiveActiveId, pathname, router, searchParams]);

  const fetchViewport = useCallback(
    async (bounds: MapBounds) => {
      const params = new URLSearchParams({
        north: String(bounds.north),
        south: String(bounds.south),
        east: String(bounds.east),
        west: String(bounds.west),
      });
      if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
      if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
      if (filters.isFurnished) params.set("isFurnished", "true");
      if (filters.arePetsAllowed) params.set("arePetsAllowed", "true");

      try {
        const res = await fetch(`/api/listings/map?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        setDynamicListings(
          (data.listings ?? []).map((l: Record<string, unknown>) => ({
            ...l,
            latitude: l.latitude as number,
            longitude: l.longitude as number,
          }))
        );
      } catch {
        // Silently fail — keep existing listing data
      }
    },
    [filters]
  );

  const handleBoundsChange = useCallback(
    (bounds: MapBounds) => {
      fetchViewport(bounds);
    },
    [fetchViewport]
  );

  if (!mappedListings.length && !dynamicListings) {
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
        <div className="flex items-center gap-2">
          <MapFilters value={filters} onChange={setFilters} />
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
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid h-[calc(100vh-12rem)] grid-cols-1 lg:grid-cols-[7fr_5fr]">
          <div className={viewMode === "list" ? "hidden lg:block" : "block"}>
            <MapView
              listings={mappedListings}
              activeListingId={effectiveActiveId}
              hoveredListingId={hoveredListingId}
              onSelectListing={setActiveListingId}
              onHoverListing={setHoveredListingId}
              onBoundsChange={handleBoundsChange}
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
              autoOpenListingId={autoOpenListingId}
              className="h-full rounded-none border-0 border-l border-border lg:rounded-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
