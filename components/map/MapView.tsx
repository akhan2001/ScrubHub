"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ListingWithCoordinates } from "@/lib/map/mock-coordinates";
import { markerClassName } from "@/components/map/Marker";

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

function createMarkerIcon(
  label: string,
  active: boolean,
  hovered: boolean
): L.DivIcon {
  const className = markerClassName({ active, hovered });
  return L.divIcon({
    html: `<span class="${className}">${label}</span>`,
    className: "!border-0 !bg-transparent",
    iconSize: [60, 28],
    iconAnchor: [30, 28],
  });
}

const SOUTHERN_ONTARIO_CENTER: L.LatLngTuple = [43.65, -80.0];
const SOUTHERN_ONTARIO_ZOOM = 7.5;

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
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [mapFailed, setMapFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let map: L.Map;
    try {
      map = L.map(containerRef.current, {
        center: SOUTHERN_ONTARIO_CENTER,
        zoom: SOUTHERN_ONTARIO_ZOOM,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
    } catch {
      setMapFailed(true);
      return undefined;
    }

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

    map.whenReady(emitBounds);
    map.on("moveend", emitBounds);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onBoundsChange]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    listings.forEach((listing) => {
      const active = listing.id === activeListingId;
      const hovered = listing.id === hoveredListingId;
      const icon = createMarkerIcon(
        formatPrice(listing.price_cents),
        active,
        hovered
      );

      const marker = L.marker([listing.latitude, listing.longitude], { icon })
        .addTo(map)
        .on("click", () => onSelectListing(listing.id))
        .on("mouseover", () => onHoverListing(listing.id))
        .on("mouseout", () => onHoverListing(null));

      markersRef.current.push(marker);
    });
  }, [
    listings,
    activeListingId,
    hoveredListingId,
    onSelectListing,
    onHoverListing,
  ]);

  if (mapFailed) {
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
              Map failed to load. Listing panel remains available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
