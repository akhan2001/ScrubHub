import { notFound, redirect } from 'next/navigation';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import { fetchWorkerProfile } from '@/server/repositories/profiles.repository';
import { getPublishedListing } from '@/server/services/listings.service';
import { ApplicationPage } from '@/components/tenant/application-page';

type ApplyRouteProps = {
  params: Promise<{ listingId: string }>;
};

export default async function ApplyRoute({ params }: ApplyRouteProps) {
  const { listingId } = await params;

  const user = await getAuthUser();
  if (!user) {
    const target = `/dashboard/apply/${listingId}`;
    redirect(`/login?redirectTo=${encodeURIComponent(target)}`);
  }

  const profile = await getProfile(user.id);
  if (!profile) redirect('/login');
  if (profile.role !== 'tenant') {
    // Non-tenants can't apply; send them home with a hint.
    redirect('/dashboard');
  }

  const listing = await getPublishedListing(listingId);
  if (!listing) notFound();

  const workerProfile = await fetchWorkerProfile(user.id);

  return (
    <ApplicationPage
      listing={{
        id: listing.id,
        title: listing.title,
        address: listing.address,
        price_cents: listing.price_cents,
        bedrooms: listing.bedrooms ?? null,
        bathrooms: listing.bathrooms ?? null,
        square_footage: listing.square_footage ?? null,
        images: listing.images ?? null,
      }}
      profile={profile}
      workerProfile={workerProfile}
      profileGate={{
        hasBackgroundConsent: workerProfile?.background_check_consent ?? false,
        hasIdDocument: !!workerProfile?.id_document_url,
      }}
    />
  );
}
