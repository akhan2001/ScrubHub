import type { Listing } from '@/types/database';

type ListingCardProps = {
  listing: Pick<Listing, 'id' | 'title' | 'description' | 'address' | 'price_cents' | 'status' | 'created_at'>;
};

export function ListingCard({ listing }: ListingCardProps) {
  const price =
    listing.price_cents != null
      ? `$${(listing.price_cents / 100).toFixed(2)}`
      : null;

  return (
    <article className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
      <h2 className="font-semibold text-lg">{listing.title}</h2>
      {listing.address && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{listing.address}</p>
      )}
      {listing.description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">
          {listing.description}
        </p>
      )}
      {price && (
        <p className="text-sm font-medium mt-2">{price}</p>
      )}
    </article>
  );
}
