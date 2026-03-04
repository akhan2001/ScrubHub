"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ListingWithCoordinates } from "@/lib/map/mock-coordinates";
import { createMarkerElement } from "@/components/map/Marker";

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

type MapViewProps = {
  listings: ListingWithCoordinates[];
  activeListingId: string | null;
  hoveredListingId: string | null;
  onSelectListing: (id: string) => void;
  onHoverListing: (id: string | null) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
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
  onBoundsChange,
  className,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapFailed, setMapFailed] = useState(false);
  const freeStyle = useMemo<StyleSpecification>(
    () => ({
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "\u00a9 OpenStreetMap contributors",
        },
      },
      layers: [{ id: "osm", type: "raster", source: "osm" }],
    }),
    []
  );

  const fallbackCenter = useMemo(() => {
    const first = listings[0];
    return first ? [first.longitude, first.latitude] : [-79.3832, 43.6532];
  }, [listings]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: freeStyle,
      center: fallbackCenter as [number, number],
      zoom: 10.5,
      attributionControl: false,
    });
    map.on("error", () => setMapFailed(true));

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
    mapRef.current = map;

    function emitBounds() {
      if (!onBoundsChange) return;
      const b = map.getBounds();
      onBoundsChange({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    }

    map.on("load", emitBounds);
    map.on("moveend", emitBounds);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    listings.forEach((listing) => {
      const el = createMarkerElement({
        label: formatPrice(listing.price_cents),
        active: listing.id === activeListingId,
        hovered: listing.id === hoveredListingId,
        onClick: () => onSelectListing(listing.id),
        onMouseEnter: () => onHoverListing(listing.id),
        onMouseLeave: () => onHoverListing(null),
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([listing.longitude, listing.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [listings, activeListingId, hoveredListingId, onHoverListing, onSelectListing]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeListingId) return;
    const listing = listings.find((item) => item.id === activeListingId);
    if (!listing) return;
    map.easeTo({ center: [listing.longitude, listing.latitude], duration: 400 });
  }, [activeListingId, listings]);

  if (mapFailed) {
    return (
      <div
        className={className}
        style={{
          background: "radial-gradient(circle at top left, rgba(255,255,255,.8), rgba(236,236,236,.9))",
        }}
      >
        <div className="flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-sm rounded-2xl border border-border bg-background/95 p-4">
            <p className="text-sm font-medium text-foreground">Map unavailable</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Map failed to load. Listing panel remains available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
