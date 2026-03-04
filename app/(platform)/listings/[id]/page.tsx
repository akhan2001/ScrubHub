import { notFound } from 'next/navigation';
import { getPublishedListing } from '@/server/services/listings.service';
import { ListingDetail } from '@/components/listings/ListingDetail';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile, getFullProfileData } from '@/server/services/profiles.service';
import { AppPublicShell } from '@/components/layout/app-public-shell';
import type { ProfileCompleteness } from '@/components/listings/apply-button';

export default async function ListingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ apply?: string }>;
}) {
  const { id } = await params;
  const { apply } = await searchParams;
  const listing = await getPublishedListing(id);
  const authUser = await getAuthUser();
  const profile = authUser ? await getProfile(authUser.id) : null;

  if (!listing) notFound();

  let completeness: ProfileCompleteness | undefined;
  const isTenant = profile?.role === 'tenant';

  if (isTenant && authUser) {
    const fullData = await getFullProfileData(authUser.id);
    const wp = fullData.workerProfile;
    completeness = {
      hasPaymentMethod: false,
      hasBackgroundConsent: !!wp?.background_check_consent,
      hasIdDocument: !!wp?.id_document_url,
    };
  }

  return (
    <AppPublicShell>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ListingDetail
          listing={listing}
          canRequestBooking={isTenant}
          completeness={completeness}
          autoOpenApply={apply === 'true'}
        />
      </div>
    </AppPublicShell>
  );
}
