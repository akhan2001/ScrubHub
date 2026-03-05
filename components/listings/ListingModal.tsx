'use client';

import { useEffect, useState } from 'react';
import {
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Listing } from '@/types/database';

export type ListingModalData = Pick<
  Listing,
  | 'id'
  | 'title'
  | 'description'
  | 'address'
  | 'price_cents'
  | 'bedrooms'
  | 'bathrooms'
  | 'square_footage'
  | 'is_furnished'
  | 'are_pets_allowed'
  | 'images'
  | 'lease_terms'
>;

type ListingModalProps = {
  listing: ListingModalData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ListingModal({ listing, open, onOpenChange }: ListingModalProps) {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [listing?.id]);

  if (!listing) return null;

  const images = listing.images ?? [];
  const hasMultipleImages = images.length > 1;
  const price =
    listing.price_cents != null
      ? `$${Math.round(listing.price_cents / 100).toLocaleString()}`
      : null;

  const hasStats =
    listing.bedrooms != null ||
    listing.bathrooms != null ||
    listing.square_footage != null;

  const hasTags =
    listing.is_furnished ||
    listing.are_pets_allowed ||
    (listing.lease_terms?.length ?? 0) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-2xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{listing.title}</DialogTitle>

        <DialogClose className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="max-h-[85vh] overflow-y-auto">
          {/* Image carousel */}
          {images.length > 0 ? (
            <div className="relative aspect-[16/9] bg-muted">
              <img
                src={images[imageIndex]}
                alt={`${listing.title} — photo ${imageIndex + 1}`}
                className="h-full w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

              {price && (
                <div className="absolute bottom-3 left-4">
                  <p className="text-2xl font-bold text-white drop-shadow-md">
                    {price}
                    <span className="text-sm font-normal opacity-80">/mo</span>
                  </p>
                </div>
              )}

              {hasMultipleImages && (
                <div className="absolute bottom-3 right-4 rounded-full bg-black/50 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  {imageIndex + 1} / {images.length}
                </div>
              )}

              {hasMultipleImages && (
                <>
                  <button
                    onClick={() =>
                      setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))
                    }
                    className="absolute left-2.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition-colors hover:bg-white"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={() =>
                      setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))
                    }
                    className="absolute right-2.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition-colors hover:bg-white"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center bg-muted">
              <p className="text-sm text-muted-foreground">No photos</p>
            </div>
          )}

          {/* Content body */}
          <div className="space-y-4 px-5 pb-5 pt-4">
            {/* Title + address */}
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {listing.title}
              </h2>
              {listing.address && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  {listing.address}
                </p>
              )}
            </div>

            {/* Price (shown below title when no images) */}
            {!images.length && price && (
              <p className="text-2xl font-bold text-foreground">
                {price}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
            )}

            {/* Key stats */}
            {hasStats && (
              <div className="grid grid-cols-3 gap-2">
                {listing.bedrooms != null && (
                  <StatPill icon={BedDouble} value={`${listing.bedrooms}`} label="Beds" />
                )}
                {listing.bathrooms != null && (
                  <StatPill icon={Bath} value={`${listing.bathrooms}`} label="Baths" />
                )}
                {listing.square_footage != null && (
                  <StatPill
                    icon={Ruler}
                    value={listing.square_footage.toLocaleString()}
                    label="Sq ft"
                  />
                )}
              </div>
            )}

            {/* Tags */}
            {hasTags && (
              <div className="flex flex-wrap gap-2">
                {listing.is_furnished && (
                  <Badge variant="outline" className="rounded-full">
                    Furnished
                  </Badge>
                )}
                {listing.are_pets_allowed && (
                  <Badge variant="outline" className="rounded-full">
                    Pets OK
                  </Badge>
                )}
                {listing.lease_terms?.map((term) => (
                  <Badge key={term} variant="outline" className="rounded-full">
                    {term}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <>
                <Separator />
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    About this property
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 line-clamp-6">
                    {listing.description}
                  </p>
                </div>
              </>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <>
                <Separator />
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {images.map((url, i) => (
                    <button
                      key={url}
                      onClick={() => setImageIndex(i)}
                      className={`shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                        i === imageIndex
                          ? 'border-primary shadow-sm'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${i + 1}`}
                        className="size-14 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Status */}
            <Separator />
            <div className="flex items-center justify-center rounded-lg bg-muted/50 py-2.5">
              <p className="text-xs font-medium text-muted-foreground">
                Contact the landlord to apply for this property
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
    <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5">
      <Icon className="size-4 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-none text-foreground">{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
