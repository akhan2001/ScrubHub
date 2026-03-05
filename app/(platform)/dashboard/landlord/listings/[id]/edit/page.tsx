import { notFound, redirect } from 'next/navigation';
import { requireRole } from '@/server/guards/require-role';
import { getListingById } from '@/server/services/listings.service';
import { DashboardSection } from '@/components/dashboard/dashboard-section';
import { Card, CardContent } from '@/components/ui/card';
import { ListingEditWrapper } from './listing-edit-wrapper';

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireRole('landlord');
  const listing = await getListingById(id);

  if (!listing) notFound();
  if (listing.user_id !== user.id) redirect('/dashboard/landlord/listings');

  return (
    <DashboardSection
      breadcrumb={[
        { label: 'Dashboard', href: '/dashboard/landlord' },
        { label: 'Listings', href: '/dashboard/landlord/listings' },
        { label: listing.title, href: `/dashboard/landlord/listings/${id}` },
        { label: 'Edit' },
      ]}
      title={`Edit: ${listing.title}`}
    >
      <Card>
        <CardContent className="pt-6">
          <ListingEditWrapper listing={listing} />
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
