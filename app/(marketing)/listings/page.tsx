/* =============================================================
   app/(marketing)/listings/page.tsx — magazine editorial grid
   New route. Same data source as /facility-map.
   ============================================================= */
import Link from 'next/link';
import type { Metadata } from 'next';
import { Heart, Bed, Bath, Square, LayoutGrid, Map as MapIcon, ArrowRight } from 'lucide-react';
import { getPublishedListings } from '@/server/services/listings.service';
import { MARKETING_SITE_URL } from '@/lib/marketing-site';

export const metadata: Metadata = {
  title: 'Stays — 401 Corridor',
  description: 'Furnished housing within walking distance of Ontario hospitals. Curated weekly.',
  openGraph: {
    url: `${MARKETING_SITE_URL}/listings`,
    title: 'Stays | ScrubHub',
    description: 'Furnished housing near every hospital on the 401 Corridor.',
  },
};

const HOSPITAL_CHIPS = [
  { label: 'All hospitals', count: null, active: true },
  { label: 'Toronto General', count: 42 },
  { label: 'Mt Sinai',        count: 28 },
  { label: 'Trillium Health', count: 19 },
  { label: 'Sunnybrook',      count: 23 },
];

export default async function ListingsPage() {
  const all = (await getPublishedListings().catch(() => [])).slice(0, 12);
  const hero = all[0];
  const sides = all.slice(1, 3);
  const grid  = all.slice(3, 12);

  const fmtPrice = (cents?: number | null) =>
    cents != null ? `$${Math.round(cents / 100).toLocaleString()}` : '—';

  return (
    <div className="flex-1 bg-[#F7F4EE] text-[#0E1A2B]">
      {/* Editorial header */}
      <section className="mx-auto max-w-[1480px] px-8 pt-9 pb-7">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585] font-medium mb-3.5">
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#B8472E]" />
            {all.length} stays · 401 Corridor · Updated daily
          </span>
        </div>
        <div className="flex items-end justify-between gap-8 flex-wrap">
          <h1 className="m-0 font-medium tracking-[-0.04em] leading-[0.96]" style={{ fontSize: 'clamp(40px, 5.4vw, 76px)' }}>
            Stays this rotation,<br />
            <span className="italic font-normal text-[#B8472E]" style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: '1.02em' }}>
              curated.
            </span>
          </h1>
          <p className="max-w-[380px] text-[15px] leading-[1.55] text-[#3A4759] m-0">
            Every unit walks to a hospital, every host meets the ScrubHub housing protocol.
            No broker fees. No 12-month lease.
          </p>
        </div>
      </section>

      {/* Sticky filter rail */}
      <div className="sticky top-[72px] z-30 bg-[#F7F4EE] border-y border-[#E5DFD2] py-3.5">
        <div className="mx-auto max-w-[1480px] px-8 flex items-center gap-2.5 flex-wrap">
          {HOSPITAL_CHIPS.map((c) => (
            <button
              key={c.label}
              className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-full border text-[13px] font-medium transition ${
                c.active
                  ? 'bg-[#0E1A2B] text-white border-[#0E1A2B]'
                  : 'bg-transparent text-[#3A4759] border-[#E5DFD2] hover:border-[#0E1A2B] hover:text-[#0E1A2B]'
              }`}
            >
              {c.label}
              {c.count != null && (
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                  c.active ? 'bg-white/20 text-white' : 'bg-[#EFE9DD] text-[#6B7585]'
                }`}>{c.count}</span>
              )}
            </button>
          ))}
          <span className="w-px h-5 bg-[#E5DFD2] mx-1" />
          <button className="h-9 px-3.5 rounded-full border border-[#E5DFD2] text-[13px] font-medium text-[#3A4759] hover:border-[#0E1A2B] hover:text-[#0E1A2B] transition">≤ 10 min walk</button>
          <button className="h-9 px-3.5 rounded-full border border-[#E5DFD2] text-[13px] font-medium text-[#3A4759] hover:border-[#0E1A2B] hover:text-[#0E1A2B] transition">$2k–3k</button>
          <button className="h-9 px-3.5 rounded-full border border-[#E5DFD2] text-[13px] font-medium text-[#3A4759] hover:border-[#0E1A2B] hover:text-[#0E1A2B] transition">Furnished</button>
          <button className="h-9 px-3.5 rounded-full border border-[#E5DFD2] text-[13px] font-medium text-[#3A4759] hover:border-[#0E1A2B] hover:text-[#0E1A2B] transition">Pet OK</button>

          <div className="ml-auto inline-flex bg-[#EFE9DD] rounded-full p-[3px]">
            <button className="h-[30px] px-3.5 rounded-full text-[12px] font-semibold text-[#0E1A2B] bg-white shadow-sm inline-flex items-center gap-1.5">
              <LayoutGrid className="size-3.5" /> Grid
            </button>
            <Link href="/facility-map" className="h-[30px] px-3.5 rounded-full text-[12px] font-semibold text-[#6B7585] hover:text-[#0E1A2B] inline-flex items-center gap-1.5">
              <MapIcon className="size-3.5" /> Map
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1480px] px-8 pt-9">
        {/* Featured spread: hero + 2 side cards */}
        {hero && (
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 mb-12">
            <Link href={`/facility-map?listing=${hero.id}`} className="relative block rounded-3xl overflow-hidden bg-gradient-to-br from-[#0E1A2B] to-[#1a2a3f]" style={{ aspectRatio: '5/4', minHeight: 480 }}>
              {hero.images?.[0] && (
                <img src={hero.images[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/65" />
              <div className="absolute top-6 left-6 right-6 flex items-start justify-between text-white z-10">
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-85">Fig. 01 — Editor&rsquo;s pick</span>
                <button className="size-9 rounded-full bg-white/95 grid place-items-center text-[#0E1A2B]"><Heart className="size-4" /></button>
              </div>
              <div className="absolute left-6 right-6 bottom-6 text-white z-10">
                <span className="inline-block bg-white text-[#0E1A2B] font-mono text-[10px] tracking-[0.14em] uppercase font-semibold px-2.5 py-1 rounded mb-3.5">Editor&rsquo;s pick</span>
                <h2 className="m-0 text-[34px] font-medium tracking-[-0.025em] leading-[1.05]">{hero.title}</h2>
                <div className="mt-2 flex items-center gap-3.5 text-[13px] opacity-85">
                  <span>{hero.address}</span>
                  <span className="text-[24px] font-semibold tracking-[-0.02em]">{fmtPrice(hero.price_cents)}/mo</span>
                </div>
              </div>
            </Link>

            <div className="grid grid-rows-2 gap-6">
              {sides.map((s) => (
                <Link key={s.id} href={`/facility-map?listing=${s.id}`} className="relative block rounded-2xl overflow-hidden" style={{ background: 'repeating-linear-gradient(135deg,#F0EBDF 0 12px,#EFE9DD 12px 24px)' }}>
                  <span className="absolute top-4 left-4 bg-white text-[#0E1A2B] font-mono text-[9px] tracking-[0.14em] uppercase font-semibold px-2.5 py-1 rounded">Verified</span>
                  <div className="absolute left-5 right-5 bottom-5 flex justify-between items-end gap-3">
                    <div>
                      <h3 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">{s.title}</h3>
                      <p className="m-0 text-[12px] text-[#6B7585] mt-0.5">{s.address}</p>
                    </div>
                    <div className="text-[18px] font-semibold tracking-[-0.02em]">{fmtPrice(s.price_cents)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section rule */}
        <div className="flex items-center gap-4 mb-7 mt-12">
          <h2 className="m-0 font-medium tracking-[-0.03em] leading-none" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>All stays</h2>
          <span className="flex-1 h-px bg-[#E5DFD2]" />
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585]">{all.length} results</span>
        </div>

        {/* Mixed grid: occasional wide card for editorial rhythm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {grid.map((s, i) => {
            const wide = i === 2 || i === 5;
            return (
              <Link
                key={s.id}
                href={`/facility-map?listing=${s.id}`}
                className={`group flex flex-col gap-3.5 ${wide ? 'lg:col-span-2' : ''}`}
              >
                <div className={`relative rounded-[18px] overflow-hidden bg-[#EFE9DD] transition group-hover:-translate-y-1 ${wide ? 'aspect-[8/5]' : 'aspect-[4/5]'}`}>
                  {s.images?.[0] ? (
                    <img src={s.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center font-mono text-[10px] tracking-[0.14em] uppercase text-[#6B7585]"
                      style={{ background: 'repeating-linear-gradient(135deg,#F0EBDF 0 12px,#EFE9DD 12px 24px)' }}>
                      <span className="bg-white/70 px-2.5 py-1 rounded">interior · {s.title}</span>
                    </div>
                  )}
                  <span className="absolute top-3.5 left-3.5 bg-white text-[#0E1A2B] font-mono text-[10px] tracking-[0.14em] uppercase font-semibold px-2.5 py-1 rounded">New</span>
                  <button className="absolute top-3.5 right-3.5 size-9 rounded-full bg-white/95 grid place-items-center text-[#0E1A2B] hover:scale-110 transition"><Heart className="size-[15px]" /></button>
                </div>
                <div className="flex justify-between items-start gap-3">
                  <h3 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">{s.title}</h3>
                  <span className="text-[17px] font-semibold tracking-[-0.02em] whitespace-nowrap">
                    {fmtPrice(s.price_cents)}
                    <small className="text-[12px] font-normal text-[#6B7585]">/mo</small>
                  </span>
                </div>
                <p className="m-0 text-[13px] text-[#6B7585] leading-[1.45]">{s.address}</p>
                <div className="flex gap-3.5 text-[12px] text-[#3A4759]">
                  {s.bedrooms != null && <span className="inline-flex items-center gap-1"><Bed className="size-3.5 opacity-65" />{s.bedrooms} bed</span>}
                  {s.bathrooms != null && <span className="inline-flex items-center gap-1"><Bath className="size-3.5 opacity-65" />{s.bathrooms} bath</span>}
                  {s.square_footage != null && <span className="inline-flex items-center gap-1"><Square className="size-3.5 opacity-65" />{s.square_footage} sqft</span>}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 pt-9 border-t border-[#E5DFD2] flex justify-between items-center gap-4 flex-wrap pb-20">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585]">
            Showing {Math.min(12, all.length)} of {all.length} stays
          </span>
          <button className="inline-flex items-center gap-2 h-[46px] px-6 rounded-full border border-[#0E1A2B] text-[14px] font-semibold hover:bg-[#0E1A2B] hover:text-white transition">
            Load more <ArrowRight className="size-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
