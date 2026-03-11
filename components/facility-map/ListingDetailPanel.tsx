'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  X,
  BedDouble,
  Bath,
  Ruler,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { ListingWithCoordinates } from '@/lib/map/mock-coordinates';
import { FACILITIES } from '@/lib/map/facilities';
import { Badge } from '@/components/ui/badge';
import { FacilityMapListingApply } from '@/components/facility-map/FacilityMapListingApply';
import { cn } from '@/lib/utils';

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatPrice(cents: number | null) {
  if (!cents) return 'Price on request';
  return `$${Math.round(cents / 100)}/mo`;
}

const facilityTypeLabel = (type: string) =>
  type === 'hospital' ? 'Hospital' : 'Clinic';

type NearbyFacility = { id: number; name: string; type: string; dist: number };

function ListingDetailContent({
  listing,
  nearby,
  ctaSlot,
}: {
  listing: ListingWithCoordinates;
  nearby: NearbyFacility[];
  ctaSlot?: React.ReactNode;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = listing.images ?? [];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    setImageIndex(0);
  }, [listing.id]);

  const hasStats =
    listing.bedrooms != null ||
    listing.bathrooms != null ||
    listing.square_footage != null;

  const hasTags =
    listing.is_furnished ||
    listing.are_pets_allowed ||
    (listing.lease_terms?.length ?? 0) > 0;

  return (
    <div className="flex flex-col">
      {/* Images */}
      {images.length > 0 ? (
        <div className="relative aspect-[16/9] shrink-0 bg-muted">
          <img
            src={images[imageIndex]}
            alt={`${listing.title ?? 'Listing'} — photo ${imageIndex + 1}`}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
          {formatPrice(listing.price_cents) !== 'Price on request' && (
            <div className="absolute bottom-3 left-4">
              <p className="text-xl font-bold text-white drop-shadow-md">
                {formatPrice(listing.price_cents)}
              </p>
            </div>
          )}
          {hasMultipleImages && (
            <>
              <div className="absolute bottom-3 right-4 rounded-full bg-black/50 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                {imageIndex + 1} / {images.length}
              </div>
              <button
                type="button"
                onClick={() =>
                  setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))
                }
                className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition-colors hover:bg-white"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))
                }
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition-colors hover:bg-white"
                aria-label="Next photo"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="flex aspect-[16/9] shrink-0 items-center justify-center bg-muted">
          <p className="text-sm text-muted-foreground">No photos</p>
        </div>
      )}

      <div className="flex flex-col p-4">
        {/* Title, address, price (when no images or price overlay) */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold text-foreground">
              {listing.title ?? 'Listing'}
            </h2>
            <Badge variant="secondary" className="shrink-0 capitalize">
              {listing.status}
            </Badge>
          </div>
          <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {listing.address ?? 'Address pending'}
          </p>
          {(!images.length || formatPrice(listing.price_cents) === 'Price on request') && (
            <p className="text-base font-semibold text-primary">
              {formatPrice(listing.price_cents)}
            </p>
          )}
        </div>

        {/* Key stats */}
        {hasStats && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {listing.bedrooms != null && (
              <StatPill
                icon={BedDouble}
                value={String(listing.bedrooms)}
                label="Beds"
              />
            )}
            {listing.bathrooms != null && (
              <StatPill
                icon={Bath}
                value={String(listing.bathrooms)}
                label="Baths"
              />
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
          <div className="mt-4 flex flex-wrap gap-2">
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
          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              About this property
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {listing.description}
            </p>
          </div>
        )}

        {/* Image thumbnails */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
            {images.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setImageIndex(i)}
                className={cn(
                  'shrink-0 overflow-hidden rounded-md border-2 transition-all',
                  i === imageIndex
                    ? 'border-primary shadow-sm'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${i + 1}`}
                  className="size-14 object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Nearby practices */}
        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Nearby practices
          </p>
          <p className="mb-3 text-xs text-muted-foreground">
            Sorted by distance
          </p>
          <ul className="space-y-2">
            {nearby.map((f, i) => (
              <li
                key={f.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50"
              >
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                    f.type === 'hospital' ? 'bg-primary' : 'bg-slate-600'
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {f.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {facilityTypeLabel(f.type)} ·{' '}
                    <span className="font-semibold text-primary">
                      {f.dist.toFixed(1)} km
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="mt-6 space-y-2 border-t border-border pt-4">
          {ctaSlot ?? (
            <>
              <Link
                href={`/facility-map?listing=${listing.id}`}
                className="block rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                View Listing
              </Link>
              <Link
                href="/signup"
                className="block rounded-xl border border-primary px-4 py-3 text-center text-sm font-bold text-primary transition-colors hover:bg-primary/5"
              >
                Sign Up to Apply
              </Link>
            </>
          )}
        </div>
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
    <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5">
      <Icon className="size-4 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-none text-foreground">
          {value}
        </p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

interface ListingDetailPanelProps {
  listing: ListingWithCoordinates | null;
  onClose: () => void;
  className?: string;
  /** When "sheet", hides header and close button (sheet provides its own) */
  variant?: 'panel' | 'sheet';
  /** When true, shows auth-aware apply flow instead of View Listing / Sign Up (for tenants) */
  showApplyFlow?: boolean;
  /** Path to redirect to after login (for FacilityMapListingApply) */
  redirectPath?: string;
}

export function ListingDetailPanel({
  listing,
  onClose,
  className,
  variant = 'panel',
  showApplyFlow = false,
  redirectPath = '/dashboard/listings',
}: ListingDetailPanelProps) {
  const nearby = listing
    ? FACILITIES.map((f) => ({
        ...f,
        dist: haversineKm(listing.latitude, listing.longitude, f.lat, f.lng),
      }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 8)
    : [];

  const isSheet = variant === 'sheet';

  return (
    <section
      className={cn(
        'flex h-full flex-col overflow-hidden',
        !isSheet && 'rounded-r-2xl border-l border-border bg-card',
        className
      )}
    >
      {!isSheet && (
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Listing details
          </p>
          {listing && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close listing"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {listing ? (
          <ListingDetailContent
            listing={listing}
            nearby={nearby}
            ctaSlot={
              showApplyFlow ? (
                <FacilityMapListingApply
                  listingId={listing.id}
                  redirectPath={redirectPath}
                />
              ) : undefined
            }
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <MapPin className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Click a listing pin or search to view details
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Select a property on the map to see its address, price, and nearby
              healthcare facilities.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
