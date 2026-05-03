'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type FacilityMapMarketingHeaderProps = {
  facilityCount: number;
  searchSlot?: ReactNode;
};

export function FacilityMapMarketingHeader({
  facilityCount,
  searchSlot,
}: FacilityMapMarketingHeaderProps) {
  return (
    <section className="relative z-10 shrink-0 border-b border-[#E5DFD2] bg-[#EFE9DD]">
      <div className="mx-auto max-w-[1320px] px-8 pt-12 pb-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.18em] text-[#6B7585] uppercase"
        >
          <span className="size-1.5 rounded-full bg-[#1E5BBE]" aria-hidden />
          <Link href="/" className="transition-colors hover:text-[#0E1A2B]">
            Home
          </Link>
          <span className="opacity-50" aria-hidden>
            ·
          </span>
          <span className="text-[#0E1A2B]">Listings</span>
        </nav>

        <div className="grid items-end gap-10 lg:grid-cols-[1.6fr_1fr]">
          <h1
            className="m-0 leading-[0.96] font-medium tracking-[-0.04em] text-[#0E1A2B]"
            style={{ fontSize: 'clamp(40px, 5.6vw, 76px)' }}
          >
            Healthcare facilities,
            <br />
            <span
              className="font-normal text-[#1E5BBE] italic"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
            >
              mapped.
            </span>
          </h1>
          <p className="m-0 max-w-[460px] text-[17px] leading-[1.5] text-[#3A4759] lg:justify-self-end">
            {facilityCount}+ hospitals, clinics, and healthcare facilities across Ontario. Click
            any pin to view details and book a space.
          </p>
        </div>

        {searchSlot ? <div className="mt-8 max-w-[640px]">{searchSlot}</div> : null}
      </div>
    </section>
  );
}
