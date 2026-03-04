import Link from 'next/link';
import { getPublishedListings } from '@/server/services/listings.service';
import { ListingCard } from '@/components/listings/ListingCard';
import { AppPublicShell } from '@/components/layout/app-public-shell';

export default async function ListingsPage() {
  const listings = await getPublishedListings();

  return (
    <AppPublicShell>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-2 text-foreground">Listings</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Browse currently published properties from verified landlords.
        </p>
        {!listings.length ? (
          <p className="text-muted-foreground rounded-md border border-border p-4">
            No published listings yet.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {listings.map((listing) => (
              <li key={listing.id}>
                <Link href={`/listings/${listing.id}`}>
                  <ListingCard listing={listing} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppPublicShell>
  );
}
