import type { Listing } from '@/types/database';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Ruler } from 'lucide-react';
import { ApplyButton, type ProfileCompleteness } from '@/components/listings/apply-button';

type ListingDetailProps = {
  listing: Listing;
  canRequestBooking?: boolean;
  completeness?: ProfileCompleteness;
  autoOpenApply?: boolean;
};

export function ListingDetail({
  listing,
  canRequestBooking = false,
  completeness,
  autoOpenApply,
}: ListingDetailProps) {
  const price =
    listing.price_cents != null
      ? `$${Math.round(listing.price_cents / 100).toLocaleString()}`
      : null;

  const coverImage = listing.images?.[0];

  return (
    <Card>
      {coverImage && (
        <div className="aspect-[16/9] overflow-hidden rounded-t-xl">
          <img src={coverImage} alt={listing.title} className="h-full w-full object-cover" />
        </div>
      )}
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-foreground">{listing.title}</h1>
          <Badge variant="secondary" className="capitalize shrink-0">
            {listing.status}
          </Badge>
        </div>
        {listing.address && (
          <p className="text-muted-foreground">{listing.address}</p>
        )}
        <div className="flex items-center gap-4">
          {price && (
            <p className="text-xl font-semibold text-primary">
              {price}<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
          )}
          {listing.deposit_amount_cents != null && (
            <p className="text-sm text-muted-foreground">
              Deposit: ${Math.round(listing.deposit_amount_cents / 100).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {listing.bedrooms != null && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-4" /> {listing.bedrooms} bed
            </span>
          )}
          {listing.bathrooms != null && (
            <span className="inline-flex items-center gap-1">
              <Bath className="size-4" /> {listing.bathrooms} bath
            </span>
          )}
          {listing.square_footage != null && (
            <span className="inline-flex items-center gap-1">
              <Ruler className="size-4" /> {listing.square_footage} sqft
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {listing.is_furnished && <Badge variant="outline">Furnished</Badge>}
          {listing.are_pets_allowed && <Badge variant="outline">Pets OK</Badge>}
          {listing.lease_terms?.map((term) => (
            <Badge key={term} variant="outline">{term}</Badge>
          ))}
          {(listing.amenities as string[] | null)?.map((amenity) => (
            <Badge key={amenity} variant="secondary">{amenity}</Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {listing.description && (
          <p className="text-foreground whitespace-pre-wrap">{listing.description}</p>
        )}

        {listing.images && listing.images.length > 1 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {listing.images.slice(1).map((url, i) => (
              <div key={url} className="aspect-[4/3] overflow-hidden rounded-lg">
                <img src={url} alt={`Photo ${i + 2}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {canRequestBooking && completeness && (
          <div className="pt-4">
            <ApplyButton listingId={listing.id} completeness={completeness} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
