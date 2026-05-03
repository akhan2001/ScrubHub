'use client';

import { Bed, Bath, Heart, Square } from 'lucide-react';
import type { ListingWithCoordinates } from '@/lib/map/mock-coordinates';

type FacilityMapListPaneProps = {
  listings: ListingWithCoordinates[];
  selectedId?: string | null;
  onSelect: (listing: ListingWithCoordinates) => void;
};

const fmtPrice = (cents?: number | null) =>
  cents != null ? `$${Math.round(cents / 100).toLocaleString()}` : '—';

export function FacilityMapListPane({
  listings,
  selectedId,
  onSelect,
}: FacilityMapListPaneProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[#E5DFD2] px-6 py-3.5">
        <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-[#6B7585] uppercase">
          {listings.length} stays · 401 Corridor
        </span>
        <span className="font-mono text-[11px] tracking-[0.14em] text-[#6B7585] uppercase">
          Sorted by relevance
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {listings.length === 0 ? (
          <div className="grid h-full place-items-center text-center">
            <div>
              <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-[#6B7585] uppercase">
                No stays match this filter
              </p>
              <p className="mt-2 max-w-[36ch] text-[13px] text-[#3A4759]">
                Try clearing a hospital chip or widening the price band above.
              </p>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-x-5 gap-y-7 xl:grid-cols-2">
            {listings.map((l) => {
              const active = selectedId === l.id;
              const cover = l.images?.[0];
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(l)}
                    className={`group flex w-full flex-col gap-3 rounded-[18px] p-2 text-left transition ${
                      active
                        ? 'bg-white shadow-[0_8px_24px_rgba(14,26,43,0.08)]'
                        : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[#EFE9DD]">
                      {cover ? (
                        <img
                          src={cover}
                          alt=""
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 grid place-items-center font-mono text-[10px] tracking-[0.14em] text-[#6B7585] uppercase"
                          style={{
                            background:
                              'repeating-linear-gradient(135deg,#F0EBDF 0 12px,#EFE9DD 12px 24px)',
                          }}
                        >
                          <span className="rounded bg-white/70 px-2.5 py-1">
                            interior · {l.title ?? 'Listing'}
                          </span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 rounded bg-white px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-[#0E1A2B] uppercase">
                        Verified
                      </span>
                      <span
                        className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/95 text-[#0E1A2B]"
                        aria-hidden
                      >
                        <Heart className="size-[15px]" />
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3 px-1">
                      <h3 className="m-0 text-[15px] font-semibold tracking-[-0.01em] text-[#0E1A2B]">
                        {l.title ?? 'Untitled stay'}
                      </h3>
                      <span className="text-[15px] font-semibold tracking-[-0.02em] whitespace-nowrap text-[#0E1A2B]">
                        {fmtPrice(l.price_cents)}
                        <small className="text-[12px] font-normal text-[#6B7585]">/mo</small>
                      </span>
                    </div>

                    {l.address && (
                      <p className="m-0 px-1 text-[12px] leading-[1.45] text-[#6B7585]">
                        {l.address}
                      </p>
                    )}

                    {(l.bedrooms != null ||
                      l.bathrooms != null ||
                      l.square_footage != null) && (
                      <div className="flex flex-wrap gap-3.5 px-1 text-[12px] text-[#3A4759]">
                        {l.bedrooms != null && (
                          <span className="inline-flex items-center gap-1">
                            <Bed className="size-3.5 opacity-65" />
                            {l.bedrooms} bed
                          </span>
                        )}
                        {l.bathrooms != null && (
                          <span className="inline-flex items-center gap-1">
                            <Bath className="size-3.5 opacity-65" />
                            {l.bathrooms} bath
                          </span>
                        )}
                        {l.square_footage != null && (
                          <span className="inline-flex items-center gap-1">
                            <Square className="size-3.5 opacity-65" />
                            {l.square_footage} sqft
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
