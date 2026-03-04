import { notFound } from 'next/navigation';
import { getPublishedListing } from '@/server/services/listings.service';
import { ListingDetail } from '@/components/listings/ListingDetail';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import { AppPublicShell } from '@/components/layout/app-public-shell';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getPublishedListing(id);
  const authUser = await getAuthUser();
  const profile = authUser ? await getProfile(authUser.id) : null;

  if (!listing) notFound();

  return (
    <AppPublicShell>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ListingDetail listing={listing} canRequestBooking={profile?.role === 'tenant'} />
      </div>
    </AppPublicShell>
  );
}
