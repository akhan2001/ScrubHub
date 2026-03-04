import { getPublishedListings } from '@/server/services/listings.service';
import { AppPublicShell } from '@/components/layout/app-public-shell';
import { ListingsMarketplace } from '@/components/listings/ListingsMarketplace';

export default async function ListingsPage() {
  const listings = await getPublishedListings();

  return (
    <AppPublicShell>
      <ListingsMarketplace listings={listings} />
    </AppPublicShell>
  );
}
