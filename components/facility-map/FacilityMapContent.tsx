'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Facility } from '@/lib/map/facilities';
import { FACILITIES } from '@/lib/map/facilities';
import type { ListingWithCoordinates } from '@/lib/map/mock-coordinates';
import { useFacilityMap } from '@/hooks/use-facility-map';
import { FacilitySearch } from '@/components/facility-map/FacilitySearch';
import { FacilityMapLegend } from '@/components/facility-map/FacilityMapLegend';
import { FacilityMapCTA } from '@/components/facility-map/FacilityMapCTA';
import { ListingDetailPanel } from '@/components/facility-map/ListingDetailPanel';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

/** 401 corridor bounds: Southern Ontario */
const INITIAL_BOUNDS = {
  north: 45.5,
  south: 42.5,
  east: -78,
  west: -82.5,
};

declare global {
  interface Window {
    __facilityMapViewListing?: (id: string) => void;
  }
}

type FacilityMapContentProps = {
  variant?: 'marketing' | 'dashboard';
};

export function FacilityMapContent({ variant = 'marketing' }: FacilityMapContentProps) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const [listings, setListings] = useState<ListingWithCoordinates[]>([]);
  const [selectedListing, setSelectedListing] = useState<ListingWithCoordinates | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      north: String(INITIAL_BOUNDS.north),
      south: String(INITIAL_BOUNDS.south),
      east: String(INITIAL_BOUNDS.east),
      west: String(INITIAL_BOUNDS.west),
    });
    fetch(`/api/listings/map?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { listings: [] }))
      .then((data) => {
        const list = (data.listings ?? []).map((l: Record<string, unknown>) => ({
          ...l,
          latitude: l.latitude as number,
          longitude: l.longitude as number,
        }));
        setListings(list);
      })
      .catch(() => setListings([]));
  }, []);

  useEffect(() => {
    window.__facilityMapViewListing = (id: string) => {
      const listing = listings.find((l) => l.id === id);
      if (listing) setSelectedListing(listing);
    };
    return () => {
      delete window.__facilityMapViewListing;
    };
  }, [listings]);

  const { mapRef, markersByFacilityIdRef, mapReady } = useFacilityMap(
    mapElRef,
    FACILITIES,
    listings
  );

  const handleSearchSelect = (facility: Facility) => {
    mapRef.current?.flyTo([facility.lat, facility.lng], 15);
    markersByFacilityIdRef.current[facility.id]?.openPopup();
  };

  const handleSelectListing = (listing: ListingWithCoordinates) => {
    mapRef.current?.flyTo([listing.latitude, listing.longitude], 15);
    setSelectedListing(listing);
  };

  const isDashboard = variant === 'dashboard';

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="relative z-[500] shrink-0 border-b border-[#d8e4f0] bg-white px-6 py-4">
        {isDashboard ? (
          <nav aria-label="Breadcrumb" className="mb-1 text-sm text-muted-foreground">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/dashboard" className="font-semibold text-primary hover:underline">
                  Dashboard
                </Link>
              </li>
              <li aria-hidden className="select-none text-muted-foreground/80">
                &gt;
              </li>
              <li>
                <span className="text-muted-foreground">Facility Map</span>
              </li>
            </ol>
          </nav>
        ) : (
          <p className="mb-0.5 text-xs text-[#6b7280]">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="mx-1.5">›</span>
            Facility Map
          </p>
        )}
        <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
          401 Corridor — Live Facility Map
        </h1>
        <p className="mb-4 text-sm text-[#6b7280]">
          {FACILITIES.length}+ hospitals, clinics, and healthcare facilities. Click any pin to view
          details and book a space.
        </p>
        <FacilitySearch
          facilities={FACILITIES}
          listings={listings}
          onSelect={handleSearchSelect}
          onSelectListing={handleSelectListing}
          mapReady={mapReady}
        />
      </div>

      {/* Map */}
      <div className="relative z-0 flex min-h-[600px] flex-1 overflow-hidden">
        <div ref={mapElRef} className="absolute inset-0 h-full w-full bg-muted/30" />
        {!mapReady && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted/50">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm font-medium text-muted-foreground">Loading map...</p>
          </div>
        )}
        <FacilityMapLegend />
        <FacilityMapCTA />
      </div>

      {/* Listing detail sheet */}
      <Sheet
        open={!!selectedListing}
        onOpenChange={(open) => !open && setSelectedListing(null)}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col overflow-hidden p-0 sm:max-w-lg"
        >
          <SheetTitle className="sr-only">Listing details</SheetTitle>
          {selectedListing && (
            <ListingDetailPanel
              listing={selectedListing}
              onClose={() => setSelectedListing(null)}
              variant="sheet"
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
