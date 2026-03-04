import type { Listing } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ListingCardProps = {
  listing: Pick<Listing, 'id' | 'title' | 'description' | 'address' | 'price_cents' | 'status' | 'created_at'>;
};

export function ListingCard({ listing }: ListingCardProps) {
  const price =
    listing.price_cents != null
      ? `$${(listing.price_cents / 100).toFixed(2)}`
      : null;

  return (
    <Card className="overflow-hidden border-border/90 bg-card/95 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold text-foreground">{listing.title}</h2>
        {listing.address && (
          <p className="mt-1 text-sm text-muted-foreground">{listing.address}</p>
        )}
        {listing.description && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {listing.description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          {price && <span className="text-base font-semibold text-primary">{price}</span>}
          <Badge variant={listing.status === 'published' ? 'default' : 'secondary'} className="capitalize">
            {listing.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
