'use client';

import { FacilityMapContent } from '@/components/facility-map/FacilityMapContent';

export default function DashboardFacilityMapPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <FacilityMapContent variant="dashboard" />
    </div>
  );
}
