import Link from "next/link";
import { BedDouble, Bath, Ruler } from "lucide-react";
import type { ListingWithCoordinates } from "@/lib/map/mock-coordinates";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ListingPreviewProps = {
  listing: ListingWithCoordinates;
};

function pseudoFacts(id: string) {
  const numeric = id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return {
    beds: (numeric % 3) + 1,
    baths: (numeric % 2) + 1,
    area: 540 + (numeric % 11) * 70,
  };
}

function formatPrice(cents: number | null) {
  if (!cents) return "Contact";
  return `$${(cents / 100).toLocaleString()}`;
}

export function ListingPreview({ listing }: ListingPreviewProps) {
  const facts = pseudoFacts(listing.id);

  return (
    <Card className="overflow-hidden border-border/80">
      <div className="relative aspect-[16/9] border-b border-border bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-black/5 dark:from-white/5 dark:to-black/35" />
        <Badge variant="secondary" className="absolute left-3 top-3 capitalize">
          {listing.status}
        </Badge>
      </div>
      <CardContent className="space-y-4 pt-5">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">{listing.title}</h2>
          <p className="text-sm text-muted-foreground">{listing.address ?? "Address pending"}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="size-3.5" /> {facts.beds} bed
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath className="size-3.5" /> {facts.baths} bath
          </span>
          <span className="inline-flex items-center gap-1">
            <Ruler className="size-3.5" /> {facts.area} sqft
          </span>
        </div>
        {listing.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{listing.description}</p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-foreground">{formatPrice(listing.price_cents)}</p>
          <Button asChild size="sm">
            <Link href={`/listings/${listing.id}`}>View details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
