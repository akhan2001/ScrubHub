import { notFound, redirect } from 'next/navigation';
import { requireRole } from '@/server/guards/require-role';
import { getListingById } from '@/server/services/listings.service';
import { getLandlordBookingsWithProfiles } from '@/server/services/bookings.service';
import { getScreeningRuleForListing } from '@/server/services/screening-rules.service';
import { DashboardSection } from '@/components/dashboard/dashboard-section';
import { ListingDetailView } from '@/components/landlord/listing-detail-view';

export default async function LandlordListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireRole('landlord');
  const listing = await getListingById(id);

  if (!listing) notFound();
  if (listing.user_id !== user.id) redirect('/dashboard/landlord/listings');

  const [allBookings, screeningRule] = await Promise.all([
    getLandlordBookingsWithProfiles(user.id),
    getScreeningRuleForListing(id, user.id),
  ]);

  const bookings = allBookings.filter((b) => b.listing_id === id);

  return (
    <DashboardSection
      breadcrumb={[
        { label: 'Dashboard', href: '/dashboard/landlord' },
        { label: 'Listings', href: '/dashboard/landlord/listings' },
        { label: listing.title },
      ]}
      title={listing.title}
    >
      <ListingDetailView
        listing={listing}
        bookings={bookings}
        screeningRule={screeningRule}
      />
    </DashboardSection>
  );
}
