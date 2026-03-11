'use client';

import { Suspense } from 'react';
import { FacilityMapContent } from '@/components/facility-map/FacilityMapContent';

function FacilityMapLoading() {
  return (
    <div className="flex min-h-[600px] items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  );
}

export default function FacilityMapPage() {
  return (
    <Suspense fallback={<FacilityMapLoading />}>
      <FacilityMapContent variant="marketing" />
    </Suspense>
  );
}
