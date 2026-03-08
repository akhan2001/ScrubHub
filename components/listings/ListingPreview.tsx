import { BedDouble, Bath, Ruler } from "lucide-react";
import type { ListingWithCoordinates } from "@/lib/map/mock-coordinates";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ListingPreviewProps = {
  listing: ListingWithCoordinates;
  onViewDetails?: () => void;
  /** When false, listing is a sample/mock and cannot be applied to */
  canApply?: boolean;
};

function formatPrice(cents: number | null) {
  if (!cents) return "Contact";
  return `$${(cents / 100).toLocaleString()}`;
}

export function ListingPreview({ listing, onViewDetails, canApply = true }: ListingPreviewProps) {
  const coverImage = listing.images?.[0];

  return (
    <Card className="overflow-hidden border-border/80">
      <div className="relative aspect-[16/9] border-b border-border bg-muted">
        {coverImage ? (
          <img src={coverImage} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-black/5" />
        )}
        <Badge
          variant={canApply ? "secondary" : "outline"}
          className="absolute left-3 top-3 capitalize"
        >
          {canApply ? listing.status : "Sample listing"}
        </Badge>
      </div>
      <CardContent className="space-y-4 pt-5">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">{listing.title}</h2>
          <p className="text-sm text-muted-foreground">{listing.address ?? "Address pending"}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {listing.bedrooms != null && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5" /> {listing.bedrooms} bed
            </span>
          )}
          {listing.bathrooms != null && (
            <span className="inline-flex items-center gap-1">
              <Bath className="size-3.5" /> {listing.bathrooms} bath
            </span>
          )}
          {listing.square_footage != null && (
            <span className="inline-flex items-center gap-1">
              <Ruler className="size-3.5" /> {listing.square_footage} sqft
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-foreground">
            {formatPrice(listing.price_cents)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
          </p>
          <Button size="sm" onClick={onViewDetails}>
            View details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
