'use client';

import { useState } from 'react';
import {
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ApplyButton, type ProfileCompleteness } from '@/components/listings/apply-button';
import type { Listing } from '@/types/database';

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
}: ListingDetailProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = listing.images ?? [];
  const hasMultipleImages = images.length > 1;

  const price =
    listing.price_cents != null
      ? `$${Math.round(listing.price_cents / 100).toLocaleString()}`
      : null;
  const deposit =
    listing.deposit_amount_cents != null
      ? `$${Math.round(listing.deposit_amount_cents / 100).toLocaleString()}`
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg">
      {/* Hero image with carousel */}
      {images.length > 0 ? (
        <div className="relative aspect-[2/1] bg-muted sm:aspect-[16/7]">
          <img
            src={images[imageIndex]}
            alt={`${listing.title} — photo ${imageIndex + 1}`}
            className="h-full w-full object-cover"
          />

          {/* Gradient overlay for readability */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Price overlay */}
          {price && (
            <div className="absolute bottom-4 left-5">
              <p className="text-3xl font-bold text-white drop-shadow-md">
                {price}<span className="text-base font-normal opacity-80">/mo</span>
              </p>
            </div>
          )}

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 right-5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {imageIndex + 1} / {images.length}
            </div>
          )}

          {/* Nav arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={() => setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition-colors hover:bg-white"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition-colors hover:bg-white"
                aria-label="Next photo"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="flex aspect-[16/7] items-center justify-center bg-muted">
          <p className="text-sm text-muted-foreground">No photos</p>
        </div>
      )}

      {/* Content body */}
      <div className="p-5 sm:p-7">
        {/* Title + address */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {listing.title}
          </h1>
          {listing.address && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {listing.address}
              {listing.unit_number && <span>· {listing.unit_number}</span>}
            </p>
          )}
        </div>

        {/* Key stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {listing.bedrooms != null && (
            <StatPill icon={BedDouble} value={`${listing.bedrooms}`} label="Bedrooms" />
          )}
          {listing.bathrooms != null && (
            <StatPill icon={Bath} value={`${listing.bathrooms}`} label="Bathrooms" />
          )}
          {listing.square_footage != null && (
            <StatPill icon={Ruler} value={`${listing.square_footage}`} label="Sq ft" />
          )}
          {deposit && (
            <StatPill icon={DollarSign} value={deposit} label="Deposit" />
          )}
        </div>

        {/* Tags */}
        {(listing.is_furnished || listing.are_pets_allowed || listing.lease_terms?.length || listing.available_date) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {listing.is_furnished && <Badge variant="outline" className="rounded-full">Furnished</Badge>}
            {listing.are_pets_allowed && <Badge variant="outline" className="rounded-full">Pets OK</Badge>}
            {listing.lease_terms?.map((term) => (
              <Badge key={term} variant="outline" className="rounded-full">{term}</Badge>
            ))}
            {listing.available_date && (
              <Badge variant="outline" className="rounded-full">
                <Calendar className="mr-1 size-3" />
                Available {new Date(listing.available_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Badge>
            )}
          </div>
        )}

        {/* Amenities */}
        {(listing.amenities as string[] | null)?.length ? (
          <>
            <Separator className="my-5" />
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {(listing.amenities as string[]).map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center rounded-lg bg-muted/70 px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {/* Description */}
        {listing.description && (
          <>
            <Separator className="my-5" />
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">About this property</p>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>
          </>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <>
            <Separator className="my-5" />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((url, i) => (
                <button
                  key={url}
                  onClick={() => setImageIndex(i)}
                  className={`shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    i === imageIndex
                      ? 'border-primary shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${i + 1}`}
                    className="size-16 object-cover sm:h-16 sm:w-20"
                  />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Apply */}
        {canRequestBooking && completeness && (
          <>
            <Separator className="my-5" />
            <div className="rounded-xl border border-primary/10 bg-primary/[0.03] p-4">
              <ApplyButton listingId={listing.id} completeness={completeness} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatPill({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/40 px-3.5 py-2.5">
      <Icon className="size-4 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground leading-none">{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
