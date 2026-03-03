import { notFound } from 'next/navigation';
import { getPublishedListing } from '@/server/services/listings.service';
import { ListingDetail } from '@/components/listings/ListingDetail';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getPublishedListing(id);

  if (!listing) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ListingDetail listing={listing} />
    </div>
  );
}
