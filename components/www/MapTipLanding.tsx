'use client';

import Link from 'next/link';
import { getAppListingUrl } from '@/lib/app-url';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import type { Listing } from '@/types/database';

const MARKER_POSITIONS: { x: string; y: string }[] = [
  { x: '20%', y: '35%' },
  { x: '35%', y: '55%' },
  { x: '50%', y: '30%' },
  { x: '65%', y: '60%' },
  { x: '80%', y: '40%' },
];

type MapTipListing = Pick<
  Listing,
  'id' | 'title' | 'description' | 'address' | 'price_cents' | 'status'
>;

export function MapTipLanding({ listings }: { listings: MapTipListing[] }) {
  const displayListings = listings.slice(0, 5);

  return (
    <div className="relative w-full h-full min-h-0 overflow-hidden rounded-xl">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/scrubhub-map-background.png')" }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none"
        aria-hidden
      />
      {displayListings.map((listing, i) => {
        const pos = MARKER_POSITIONS[i] ?? MARKER_POSITIONS[0];
        const price =
          listing.price_cents != null
            ? `$${(listing.price_cents / 100).toLocaleString()}`
            : null;

        return (
          <HoverCard key={listing.id} openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <button
                type="button"
                className="absolute z-10 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-2 ring-background hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{ left: pos.x, top: pos.y }}
                aria-label={`View ${listing.title}`}
              />
            </HoverCardTrigger>
            <HoverCardContent
              align="center"
              side="top"
              className="w-80 p-0 overflow-hidden rounded-xl border border-border shadow-lg"
            >
              {/* Image placeholder - Brickwise-style card */}
              <div className="aspect-[16/10] bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-foreground text-background text-xs font-medium">
                  New
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-foreground">
                  {listing.title}
                </h3>
                {listing.address && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {listing.address}
                  </p>
                )}
                {listing.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {listing.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  {price && (
                    <span className="text-lg font-bold text-foreground">
                      {price}
                    </span>
                  )}
                  <Button asChild size="sm">
                    <Link href={getAppListingUrl(listing.id)}>
                      View Listing <span className="ml-1">→</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </div>
  );
}
