import Link from 'next/link';
import { getPublishedListings } from '@/server/services/listings.service';
import { ListingCard } from '@/components/listings/ListingCard';

export default async function ListingsPage() {
  const listings = await getPublishedListings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Listings</h1>
      {!listings.length ? (
        <p className="text-muted-foreground">No published listings yet.</p>
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
  );
}
