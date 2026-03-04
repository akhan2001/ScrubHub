import type { Listing } from '@/types/database';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RequestBookingForm } from '@/components/bookings/request-booking-form';

type ListingDetailProps = {
  listing: Pick<Listing, 'id' | 'title' | 'description' | 'address' | 'price_cents' | 'status' | 'created_at'>;
  canRequestBooking?: boolean;
};

export function ListingDetail({ listing, canRequestBooking = false }: ListingDetailProps) {
  const price =
    listing.price_cents != null
      ? `$${(listing.price_cents / 100).toFixed(2)}`
      : null;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-foreground">{listing.title}</h1>
          <Badge variant="secondary" className="capitalize shrink-0">
            {listing.status}
          </Badge>
        </div>
        {listing.address && (
          <p className="text-muted-foreground">{listing.address}</p>
        )}
        {price && (
          <p className="text-lg font-semibold text-primary">{price}</p>
        )}
      </CardHeader>
      {listing.description && (
        <CardContent>
          <p className="text-foreground whitespace-pre-wrap">{listing.description}</p>
          {canRequestBooking && <RequestBookingForm listingId={listing.id} />}
        </CardContent>
      )}
      {!listing.description && canRequestBooking && (
        <CardContent>
          <RequestBookingForm listingId={listing.id} />
        </CardContent>
      )}
    </Card>
  );
}
