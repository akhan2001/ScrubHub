'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { Facility } from '@/lib/map/facilities';
import { FACILITIES } from '@/lib/map/facilities';
import { useFacilityMap } from '@/hooks/use-facility-map';
import { FacilitySearch } from '@/components/facility-map/FacilitySearch';
import { FacilityMapLegend } from '@/components/facility-map/FacilityMapLegend';
import { FacilityMapCTA } from '@/components/facility-map/FacilityMapCTA';

export default function FacilityMapPage() {
  const mapElRef = useRef<HTMLDivElement>(null);
  const { mapRef, markersByFacilityIdRef, mapReady } = useFacilityMap(
    mapElRef,
    FACILITIES
  );

  const handleSearchSelect = (facility: Facility) => {
    mapRef.current?.flyTo([facility.lat, facility.lng], 15);
    markersByFacilityIdRef.current[facility.id]?.openPopup();
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Sub-header */}
      <div className="shrink-0 border-b border-[#d8e4f0] bg-white px-6 py-4 z-[500] relative">
        <p className="text-xs text-[#6b7280] mb-0.5">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          <span className="mx-1.5">›</span>
          Facility Map
        </p>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          401 Corridor — Live Facility Map
        </h1>
        <p className="text-sm text-[#6b7280] mb-4">
          {FACILITIES.length}+ hospitals, clinics, and healthcare facilities.
          Click any pin to view details and book a space.
        </p>
        <FacilitySearch
          facilities={FACILITIES}
          onSelect={handleSearchSelect}
          mapReady={mapReady}
        />
      </div>

      {/* Map fills available space */}
      <div className="flex-1 min-h-[400px] relative z-0">
        <div ref={mapElRef} className="absolute inset-0" />
        <FacilityMapLegend />
        <FacilityMapCTA />
      </div>
    </div>
  );
}
