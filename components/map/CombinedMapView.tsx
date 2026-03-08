"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import type { ListingWithCoordinates } from "@/lib/map/mock-coordinates";
import type { Facility } from "@/lib/map/facilities";
import { markerClassName } from "@/components/map/Marker";

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

type CombinedMapViewProps = {
  facilities: Facility[];
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

function createListingMarkerIcon(
  label: string,
  active: boolean,
  hovered: boolean,
  isMock: boolean
): L.DivIcon {
  const className = markerClassName({ active, hovered, mock: isMock });
  return L.divIcon({
    html: `<span class="${className}">${label}</span>`,
    className: "!border-0 !bg-transparent",
    iconSize: [60, 28],
    iconAnchor: [30, 28],
  });
}

const SOUTHERN_ONTARIO_CENTER: L.LatLngTuple = [43.65, -80.0];
const SOUTHERN_ONTARIO_ZOOM = 7.5;

export function CombinedMapView({
  facilities,
  listings,
  activeListingId,
  hoveredListingId,
  onSelectListing,
  onHoverListing,
  onBoundsChange,
  className,
}: CombinedMapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const listingMarkersRef = useRef<L.Marker[]>([]);
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
      clusterRef.current?.clearLayers();
      clusterRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [onBoundsChange]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    clusterRef.current?.clearLayers();
    clusterRef.current = null;

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 15,
      maxClusterRadius: 60,
      iconCreateFunction: (cluster: L.MarkerCluster) => {
        const count = cluster.getChildCount();
        const col = count > 50 ? "#EF4444" : count > 20 ? "#F59E0B" : "#2563eb";
        const size = count > 50 ? 48 : count > 20 ? 40 : 34;
        return L.divIcon({
          html: `<div style="
            background:${col};color:white;border-radius:50%;
            width:${size}px;height:${size}px;
            display:flex;align-items:center;justify-content:center;
            font-size:${count > 99 ? 11 : 13}px;font-weight:700;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            border:3px solid rgba(255,255,255,0.7);
          ">${count}</div>`,
          className: "",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      },
    });

    facilities.forEach((f) => {
      const isUrgent = f.status === "urgent";
      const isHospital = f.type === "hospital";
      const col = isUrgent ? "#EF4444" : isHospital ? "#2563eb" : "#475569";
      const icon = L.divIcon({
        html: `<div style="
          background:${col};color:white;
          border:2.5px solid white;border-radius:50%;
          width:14px;height:14px;
          box-shadow:0 1px 4px rgba(0,0,0,0.3);
        "></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const statusBadge = isUrgent
        ? '<span style="display:inline-block;background:#FEE2E2;color:#DC2626;border:1px solid #FECACA;border-radius:999px;padding:1px 8px;font-size:11px;font-weight:700;">Urgent</span>'
        : '<span style="display:inline-block;background:#EFF6FF;color:#1D4ED8;border:1px solid #BFDBFE;border-radius:999px;padding:1px 8px;font-size:11px;font-weight:700;">Live</span>';

      const popup = `
        <div style="font-family:Inter,sans-serif;min-width:200px;padding:4px 2px;">
          <h4 style="margin:0 0 6px;font-size:14px;font-weight:700;color:#0F172A;">${f.name}</h4>
          ${statusBadge}
          <p style="margin:8px 0 12px;font-size:12px;color:#6b7280;">
            ${f.type === "hospital" ? "🏥" : "🩺"} ${f.type.charAt(0).toUpperCase() + f.type.slice(1)}
          </p>
          <a href="/signup" style="
            display:block;text-align:center;background:#2563eb;color:white;
            border-radius:8px;padding:8px 0;font-size:13px;font-weight:700;
            text-decoration:none;
          ">View Availability →</a>
        </div>`;

      L.marker([f.lat, f.lng], { icon })
        .bindPopup(popup, { maxWidth: 260 })
        .addTo(cluster);
    });

    map.addLayer(cluster);
    clusterRef.current = cluster;
  }, [facilities]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    listingMarkersRef.current.forEach((m) => m.remove());
    listingMarkersRef.current = [];

    listings.forEach((listing) => {
      const active = listing.id === activeListingId;
      const hovered = listing.id === hoveredListingId;
      const isMock = listing.isMock === true;
      const icon = createListingMarkerIcon(
        formatPrice(listing.price_cents),
        active,
        hovered,
        isMock
      );

      const marker = L.marker([listing.latitude, listing.longitude], { icon })
        .addTo(map)
        .on("click", () => onSelectListing(listing.id))
        .on("mouseover", () => onHoverListing(listing.id))
        .on("mouseout", () => onHoverListing(null));

      listingMarkersRef.current.push(marker);
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
