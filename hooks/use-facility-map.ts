/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { Facility } from '@/lib/map/facilities';

export function useFacilityMap(
  mapElRef: RefObject<HTMLDivElement | null>,
  facilities: Facility[]
) {
  const mapRef = useRef<any>(null);
  const markersByFacilityIdRef = useRef<Record<number, any>>({});
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const initMap = () => {
      if (!mapElRef.current) return;
      const L = (window as any).L;
      if (!L || !L.markerClusterGroup) return;

      if ((mapElRef.current as any)._leaflet_id) return;

      const map = L.map(mapElRef.current, {
        center: [43.65, -79.85],
        zoom: 9,
        zoomControl: true,
      });

      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      const markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 15,
        maxClusterRadius: 60,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          const col = count > 50 ? '#EF4444' : count > 20 ? '#F59E0B' : '#2563eb';
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
            className: '',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });
        },
      });

      facilities.forEach((f) => {
        const isUrgent = f.status === 'urgent';
        const isHospital = f.type === 'hospital';
        const col = isUrgent ? '#EF4444' : isHospital ? '#2563eb' : '#475569';
        const icon = L.divIcon({
          html: `<div style="
            background:${col};color:white;
            border:2.5px solid white;border-radius:50%;
            width:14px;height:14px;
            box-shadow:0 1px 4px rgba(0,0,0,0.3);
          "></div>`,
          className: '',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const statusBadge = isUrgent
          ? `<span style="display:inline-block;background:#FEE2E2;color:#DC2626;border:1px solid #FECACA;border-radius:999px;padding:1px 8px;font-size:11px;font-weight:700;">Urgent</span>`
          : `<span style="display:inline-block;background:#EFF6FF;color:#1D4ED8;border:1px solid #BFDBFE;border-radius:999px;padding:1px 8px;font-size:11px;font-weight:700;">Live</span>`;

        const popup = `
          <div style="font-family:Inter,sans-serif;min-width:200px;padding:4px 2px;">
            <h4 style="margin:0 0 6px;font-size:14px;font-weight:700;color:#0F172A;">${f.name}</h4>
            ${statusBadge}
            <p style="margin:8px 0 12px;font-size:12px;color:#6b7280;">
              ${f.type === 'hospital' ? '🏥' : '🩺'} ${f.type.charAt(0).toUpperCase() + f.type.slice(1)}
            </p>
            <a href="/signup" style="
              display:block;text-align:center;background:#2563eb;color:white;
              border-radius:8px;padding:8px 0;font-size:13px;font-weight:700;
              text-decoration:none;
            ">View Availability →</a>
          </div>`;

        const marker = L.marker([f.lat, f.lng], { icon })
          .bindPopup(popup, { maxWidth: 260 })
          .addTo(markers);

        markersByFacilityIdRef.current[f.id] = marker;
      });

      map.addLayer(markers);
      setMapReady(true);
    };

    const loadScripts = () => {
      const leafletCss = document.createElement('link');
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCss);

      const clusterCss = document.createElement('link');
      clusterCss.rel = 'stylesheet';
      clusterCss.href =
        'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
      document.head.appendChild(clusterCss);

      const leafletJs = document.createElement('script');
      leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletJs.onload = () => {
        const clusterJs = document.createElement('script');
        clusterJs.src =
          'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';
        clusterJs.onload = initMap;
        document.head.appendChild(clusterJs);
      };
      document.head.appendChild(leafletJs);
    };

    if ((window as any).L?.markerClusterGroup) {
      initMap();
    } else {
      loadScripts();
    }
  }, [mapElRef, facilities]);

  return { mapRef, markersByFacilityIdRef, mapReady };
}
