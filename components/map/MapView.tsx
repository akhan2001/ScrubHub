"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { ListingWithCoordinates } from "@/lib/map/mock-coordinates";
import { createMarkerElement } from "@/components/map/Marker";

type MapViewProps = {
  listings: ListingWithCoordinates[];
  activeListingId: string | null;
  hoveredListingId: string | null;
  onSelectListing: (id: string) => void;
  onHoverListing: (id: string | null) => void;
  className?: string;
};

function formatPrice(cents: number | null) {
  if (!cents) return "N/A";
  return `$${Math.round(cents / 100)}`;
}

export function MapView({
  listings,
  activeListingId,
  hoveredListingId,
  onSelectListing,
  onHoverListing,
  className,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapFailed, setMapFailed] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const fallbackCenter = useMemo(() => {
    const first = listings[0];
    return first ? [first.longitude, first.latitude] : [-79.3832, 43.6532];
  }, [listings]);

  useEffect(() => {
    if (!containerRef.current || !token) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: fallbackCenter as [number, number],
      zoom: 10.5,
      attributionControl: false,
    });
    map.on("error", () => {
      setMapFailed(true);
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [fallbackCenter, token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    listings.forEach((listing) => {
      const markerElement = createMarkerElement({
        label: formatPrice(listing.price_cents),
        active: listing.id === activeListingId,
        hovered: listing.id === hoveredListingId,
        onClick: () => onSelectListing(listing.id),
        onMouseEnter: () => onHoverListing(listing.id),
        onMouseLeave: () => onHoverListing(null),
      });

      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([listing.longitude, listing.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [
    listings,
    activeListingId,
    hoveredListingId,
    onHoverListing,
    onSelectListing,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeListingId) return;
    const listing = listings.find((item) => item.id === activeListingId);
    if (!listing) return;

    map.easeTo({
      center: [listing.longitude, listing.latitude],
      duration: 400,
    });
  }, [activeListingId, listings]);

  if (!token || mapFailed) {
    return (
      <div
        className={className}
        style={{
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,.8), rgba(236,236,236,.9))",
        }}
      >
        <div className="flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-sm rounded-2xl border border-border bg-background/95 p-4">
            <p className="text-sm font-medium text-foreground">Map unavailable</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {!token
                ? "Add `NEXT_PUBLIC_MAPBOX_TOKEN` to enable live map rendering."
                : "Map failed to load. Listing panel remains available."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
