import { getPublishedListings } from '@/server/services/listings.service';
import { ListingsMarketplace } from '@/components/listings/ListingsMarketplace';

export default async function DashboardListingsPage() {
  const listings = await getPublishedListings();

  return <ListingsMarketplace listings={listings} />;
}
