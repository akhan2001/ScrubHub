'use client';

import { useRouter } from 'next/navigation';
import { ListingForm } from '@/components/listings/CreateListingForm';
import type { Listing } from '@/types/database';

export function ListingEditWrapper({ listing }: { listing: Listing }) {
  const router = useRouter();

  return (
    <ListingForm
      initialData={listing}
      onCancel={() => router.push(`/dashboard/landlord/listings/${listing.id}`)}
      onSuccess={() => router.push(`/dashboard/landlord/listings/${listing.id}`)}
    />
  );
}
