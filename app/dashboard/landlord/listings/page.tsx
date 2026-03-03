import { requireRole } from '@/server/guards/require-role';
import { getLandlordListings } from '@/server/services/listings.service';
import Link from 'next/link';

export default async function LandlordListingsPage() {
  const user = await requireRole('landlord');
  const listings = await getLandlordListings(user.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">My listings</h1>
        <Link
          href="/dashboard/landlord/listings/new"
          className="rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Create listing
        </Link>
      </div>
      {!listings.length ? (
        <p className="text-zinc-600 dark:text-zinc-400">No listings yet.</p>
      ) : (
        <ul className="space-y-2">
          {listings.map((listing) => (
            <li key={listing.id} className="flex items-center gap-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
              <Link href={`/listings/${listing.id}`} className="font-medium hover:underline">
                {listing.title}
              </Link>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">{listing.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
