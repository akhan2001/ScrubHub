import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  Bed,
  Calendar,
  CheckCircle2,
  Heart,
  MapPin,
  Square,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublishedListing } from '@/server/services/listings.service';
import { MARKETING_SITE_URL } from '@/lib/marketing-site';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await getPublishedListing(id).catch(() => null);
  if (!listing) {
    return { title: 'Stay not found', robots: { index: false } };
  }
  const title = listing.title ?? 'Furnished stay on the 401 Corridor';
  return {
    title,
    description: listing.description ?? 'Furnished housing within walking distance of Ontario hospitals.',
    openGraph: {
      url: `${MARKETING_SITE_URL}/listings/${id}`,
      title: `${title} | ScrubHub`,
      description: listing.description ?? undefined,
      images: listing.images?.[0] ? [listing.images[0]] : undefined,
    },
  };
}

const fmtPrice = (cents: number | null) =>
  cents != null ? `$${Math.round(cents / 100).toLocaleString()}` : '—';

const fmtDate = (iso: string | null) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await getPublishedListing(id);
  if (!listing) notFound();

  const photos = (listing.images ?? []).filter(Boolean);
  const cover = photos[0];
  const gallery = photos.slice(1, 5);
  const availableFrom = fmtDate(listing.available_date);

  return (
    <div className="bg-[#F7F4EE] text-[#0E1A2B]">
      <div className="mx-auto max-w-[1320px] px-8 pt-9 pb-16">
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585] transition hover:text-[#0E1A2B]"
        >
          <ArrowLeft className="size-3.5" />
          All listings
        </Link>

        {/* Title row */}
        <header className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1
              className="m-0 font-medium leading-[0.96] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(34px, 4.6vw, 56px)' }}
            >
              {listing.title}
            </h1>
            {listing.address ? (
              <p className="mt-3 inline-flex items-center gap-1.5 text-[15px] text-[#3A4759]">
                <MapPin className="size-4 opacity-65" />
                {listing.address}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E5DFD2] px-4 text-[13px] font-semibold text-[#0E1A2B] transition hover:border-[#0E1A2B]"
          >
            <Heart className="size-3.5" />
            Save
          </button>
        </header>

        {/* Photo collage */}
        {cover ? (
          <div className="mt-7 grid grid-cols-1 gap-2.5 overflow-hidden rounded-3xl md:grid-cols-[2fr_1fr]">
            <div className="relative aspect-[5/4] overflow-hidden md:aspect-auto md:h-[480px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="" className="h-full w-full object-cover" />
            </div>
            {gallery.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {gallery.map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 4 - gallery.length) }).map((_, i) => (
                  <div
                    key={`ph-${i}`}
                    className="aspect-square"
                    style={{
                      background:
                        'repeating-linear-gradient(135deg,#F0EBDF 0 12px,#EFE9DD 12px 24px)',
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div
            className="mt-7 grid h-[420px] place-items-center rounded-3xl"
            style={{
              background:
                'repeating-linear-gradient(135deg,#F0EBDF 0 12px,#EFE9DD 12px 24px)',
            }}
          >
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585]">
              Interior photos coming soon
            </span>
          </div>
        )}

        {/* Body grid */}
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
          <article className="space-y-9">
            {/* At a glance */}
            <section>
              <h2 className="m-0 text-2xl font-medium tracking-[-0.02em] text-[#0E1A2B]">
                At a glance
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {listing.bedrooms != null ? (
                  <Stat icon={<Bed className="size-4" />} value={`${listing.bedrooms}`} label="Bedrooms" />
                ) : null}
                {listing.bathrooms != null ? (
                  <Stat icon={<Bath className="size-4" />} value={`${listing.bathrooms}`} label="Bathrooms" />
                ) : null}
                {listing.square_footage != null ? (
                  <Stat
                    icon={<Square className="size-4" />}
                    value={`${listing.square_footage}`}
                    label="Sq ft"
                  />
                ) : null}
                {availableFrom ? (
                  <Stat icon={<Calendar className="size-4" />} value={availableFrom} label="Available" />
                ) : null}
              </div>
            </section>

            {/* Description */}
            {listing.description ? (
              <section>
                <h2 className="m-0 text-2xl font-medium tracking-[-0.02em] text-[#0E1A2B]">
                  About this stay
                </h2>
                <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.65] text-[#3A4759]">
                  {listing.description}
                </p>
              </section>
            ) : null}

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 ? (
              <section>
                <h2 className="m-0 text-2xl font-medium tracking-[-0.02em] text-[#0E1A2B]">
                  Amenities
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {listing.amenities.map((a) => (
                    <li key={a} className="inline-flex items-center gap-2 text-[14px] text-[#3A4759]">
                      <CheckCircle2 className="size-4 text-[#1E5BBE]" />
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Quick facts */}
            <section>
              <h2 className="m-0 text-2xl font-medium tracking-[-0.02em] text-[#0E1A2B]">
                The fine print
              </h2>
              <dl className="mt-4 divide-y divide-[#E5DFD2] rounded-2xl border border-[#E5DFD2] bg-white">
                <Row label="Furnished" value={listing.is_furnished ? 'Yes' : 'No'} />
                <Row label="Pets allowed" value={listing.are_pets_allowed ? 'Yes' : 'No'} />
                {listing.lease_terms && listing.lease_terms.length > 0 ? (
                  <Row label="Lease options" value={listing.lease_terms.join(' · ')} />
                ) : null}
                {listing.deposit_amount_cents != null ? (
                  <Row label="Deposit" value={fmtPrice(listing.deposit_amount_cents)} />
                ) : null}
              </dl>
            </section>
          </article>

          {/* Apply rail */}
          <aside>
            <div className="sticky top-[88px] rounded-2xl border border-[#E5DFD2] bg-white p-5 shadow-[0_20px_50px_rgba(14,26,43,0.06)]">
              <p className="text-3xl font-semibold tracking-[-0.02em] text-[#0E1A2B]">
                {fmtPrice(listing.price_cents)}
                <span className="ml-1 text-sm font-normal text-[#6B7585]">/mo</span>
              </p>
              <p className="mt-1 text-[12px] text-[#6B7585]">
                Vetted host · No broker fees · 8–13 week lease available
              </p>
              <Button asChild className="mt-5 w-full" size="lg">
                <Link href={`/listings/${listing.id}/apply`}>
                  Apply for this stay
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Link
                href={`/facility-map?listing=${listing.id}`}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#E5DFD2] px-4 py-2.5 text-[13px] font-semibold text-[#0E1A2B] transition hover:border-[#0E1A2B]"
              >
                View on map
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E5DFD2] bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-[#3A4759]">
        <span className="text-[#6B7585]">{icon}</span>
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase">{label}</span>
      </div>
      <p className="m-0 mt-1 text-lg font-semibold tracking-[-0.01em] text-[#0E1A2B]">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-3 text-sm">
      <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#6B7585]">{label}</dt>
      <dd className="m-0 text-[14px] text-[#0E1A2B]">{value}</dd>
    </div>
  );
}
