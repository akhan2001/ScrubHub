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
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="pt-6">
          <h2 className="font-semibold text-lg text-foreground">{listing.title}</h2>
          {listing.address && (
            <p className="text-sm text-muted-foreground mt-1">{listing.address}</p>
          )}
          {listing.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {listing.description}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between">
            {price && (
              <span className="text-sm font-semibold text-primary">{price}</span>
            )}
            <Badge variant="secondary" className="capitalize">
              {listing.status}
            </Badge>
          </div>
        </CardContent>
    </Card>
  );
}
