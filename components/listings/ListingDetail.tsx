import type { Listing } from '@/types/database';

type ListingDetailProps = {
  listing: Pick<Listing, 'id' | 'title' | 'description' | 'address' | 'price_cents' | 'status' | 'created_at'>;
};

export function ListingDetail({ listing }: ListingDetailProps) {
  const price =
    listing.price_cents != null
      ? `$${(listing.price_cents / 100).toFixed(2)}`
      : null;

  return (
    <article>
      <h1 className="text-2xl font-semibold">{listing.title}</h1>
      {listing.address && (
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">{listing.address}</p>
      )}
      {price && (
        <p className="text-lg font-medium mt-2">{price}</p>
      )}
      {listing.description && (
        <div className="mt-4 prose dark:prose-invert max-w-none">
          <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
            {listing.description}
          </p>
        </div>
      )}
    </article>
  );
}
