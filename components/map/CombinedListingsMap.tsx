"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { List, Map as MapIcon } from "lucide-react";
import Link from "next/link";
import type { ListingWithCoordinates } from "@/lib/map/mock-coordinates";
import type { Listing } from "@/types/database";
import { FACILITIES } from "@/lib/map/facilities";
import { MOCK_LISTINGS } from "@/lib/map/mock-listings";
import { ListingPanel } from "@/components/listings/ListingPanel";
import type { MapBounds } from "@/components/map/CombinedMapView";
import { MapFilters, type MapFilterValues } from "@/components/listings/map-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CombinedMapView = dynamic(
  () => import("@/components/map/CombinedMapView").then((m) => m.CombinedMapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] w-full items-center justify-center bg-muted/30">
        <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
      </div>
    ),
  }
);

type CombinedListingsMapProps = {
  listings: Pick<
    Listing,
    | "id"
    | "title"
    | "description"
    | "address"
    | "price_cents"
    | "status"
    | "created_at"
    | "latitude"
    | "longitude"
    | "bedrooms"
    | "bathrooms"
    | "square_footage"
    | "is_furnished"
    | "are_pets_allowed"
    | "images"
    | "lease_terms"
  >[];
  variant?: "full" | "compact";
  showFilters?: boolean;
  className?: string;
};

type MobileViewMode = "map" | "list";

export function CombinedListingsMap({
  listings: initialListings,
  variant = "full",
  showFilters = true,
  className,
}: CombinedListingsMapProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<MobileViewMode>("map");
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFilterValues>({});
  const [dynamicListings, setDynamicListings] = useState<ListingWithCoordinates[] | null>(null);

  const realListings = useMemo<ListingWithCoordinates[]>(() => {
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
        isMock: false,
      }));
  }, [initialListings, dynamicListings]);

  const allListings = useMemo<ListingWithCoordinates[]>(() => {
    const realIds = new Set(realListings.map((l) => l.id));
    const mockFiltered = MOCK_LISTINGS.filter((m) => !realIds.has(m.id));
    return [...realListings, ...mockFiltered];
  }, [realListings]);

  const selectedFromQuery = searchParams.get("listing");
  const shouldAutoOpenDetail = searchParams.get("view") === "detail";
  const initialListing =
    selectedFromQuery && allListings.some((entry) => entry.id === selectedFromQuery)
      ? selectedFromQuery
      : null;
  const [activeListingId, setActiveListingId] = useState<string | null>(initialListing);
  const [autoOpenListingId] = useState<string | null>(
    shouldAutoOpenDetail && initialListing ? initialListing : null
  );
  const effectiveActiveId = activeListingId ?? allListings[0]?.id ?? null;

  useEffect(() => {
    if (!effectiveActiveId) return;
    if (searchParams.get("listing") === effectiveActiveId) return;
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("listing", effectiveActiveId);
    nextParams.delete("view");
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [effectiveActiveId, pathname, router, searchParams]);

  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
            isMock: false,
          }))
        );
      } catch {
        // Silently fail
      }
    },
    [filters]
  );

  const handleBoundsChange = useCallback(
    (bounds: MapBounds) => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = setTimeout(() => {
        fetchTimeoutRef.current = null;
        fetchViewport(bounds);
      }, 400);
    },
    [fetchViewport]
  );

  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, []);

  const getCanApply = useCallback((listing: ListingWithCoordinates) => !listing.isMock, []);

  if (variant === "compact") {
    return (
      <div className={className}>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <div className="h-[320px] w-full">
            <CombinedMapView
              facilities={FACILITIES}
              listings={allListings}
              activeListingId={effectiveActiveId}
              hoveredListingId={hoveredListingId}
              onSelectListing={setActiveListingId}
              onHoverListing={setHoveredListingId}
              onBoundsChange={handleBoundsChange}
              className="h-full w-full"
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-border bg-background/95 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm font-medium text-foreground">
              {FACILITIES.length}+ facilities · {allListings.length} listings
            </p>
            <Button asChild size="sm">
              <Link href="/listings">Explore map</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto w-full max-w-[var(--container-max)] px-4 py-6", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Find your next property</h1>
          <p className="text-sm text-muted-foreground">
            Healthcare facilities and housing near hospitals. Real and sample listings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showFilters && <MapFilters value={filters} onChange={setFilters} />}
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
            <CombinedMapView
              facilities={FACILITIES}
              listings={allListings}
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
              listings={allListings}
              activeListingId={effectiveActiveId}
              hoveredListingId={hoveredListingId}
              onSelectListing={setActiveListingId}
              onHoverListing={setHoveredListingId}
              autoOpenListingId={autoOpenListingId}
              getCanApply={getCanApply}
              className="h-full rounded-none border-0 border-l border-border lg:rounded-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
