/* =============================================================
   app/(marketing)/facility-map/layout.tsx — warm wrapper
   Drop-in replacement that keeps the existing FacilityMapContent
   but restyles the surrounding header, filters bar background,
   and CTA strip with the warm-residential palette.
   ============================================================= */
import type { Metadata } from 'next';
import { MARKETING_SITE_URL } from '@/lib/marketing-site';

export const metadata: Metadata = {
  title: 'Listings & facility map',
  description:
    'Furnished housing within walking distance of every hospital along the Ontario 401 Corridor.',
  openGraph: {
    url: `${MARKETING_SITE_URL}/facility-map`,
    title: 'Listings & facility map | ScrubHub',
    description: 'Find verified housing within walking distance of Ontario hospitals.',
  },
};

export default function FacilityMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col bg-[#F7F4EE] text-[#0E1A2B]">
      {/* Editorial sub-masthead — kept slim so the map gets full real estate below */}
      <section className="border-b border-[#E5DFD2] bg-[#EFE9DD]">
        <div className="mx-auto max-w-[1320px] px-8 pt-12 pb-10">
          <div className="flex items-center gap-2 mb-4 font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585]">
            <span className="size-1.5 rounded-full bg-[#B8472E]" />
            Med-Map™ · Live availability
          </div>
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10 items-end">
            <h1 className="m-0 font-medium tracking-[-0.04em] leading-[0.96]" style={{ fontSize: 'clamp(40px, 5.6vw, 76px)' }}>
              Find a stay within<br />
              <span className="italic font-normal text-primary" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                walking distance.
              </span>
            </h1>
            <p className="text-[17px] leading-[1.5] text-[#3A4759] m-0 max-w-[460px] lg:justify-self-end">
              Filter by hospital, walk-time, and shift dates. Every host is credentialed against the
              ScrubHub housing protocol.
            </p>
          </div>
        </div>
      </section>

      {/* The actual map page (FacilityMapContent) */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
