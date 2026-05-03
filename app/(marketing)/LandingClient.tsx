'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import {
  Heart, Bed, Bath, Square, MapPin, ArrowRight, ArrowLeft,
  Calendar, BadgeCheck, Menu,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { getAppSignupUrl } from '@/lib/app-url';
import { HeroSearchCard } from '@/components/www/hero-search-card';

// =====================================================================
// ScrubHub — Marketing landing page
// Warm residential real-estate magazine feel:
//   - Off-white paper background (#F7F4EE)
//   - Primary / CTAs: clinical blue (--primary) vs ink headings (--ink)
//   - Editorial italic display moments via Instrument Serif (loaded below)
//   - Mono captions via system mono stack
// All sizing/spacing via Tailwind.  Tokens added inline so this drops in
// without touching globals.css; promote to globals.css when convenient.
// =====================================================================

// ----- Featured listings (replace with real data via props later) -----
const LISTINGS = [
  { id: 1, title: 'Maple Walk Studio',     address: 'Cabbagetown · 0.6 km to Sherbourne Hospital', price: 2840, beds: 1, baths: 1, sqft: 540, tag: 'New' },
  { id: 2, title: 'Riverside Loft 4B',     address: 'King West · 1.2 km to Toronto Western',       price: 3210, beds: 2, baths: 1, sqft: 720, tag: 'Verified' },
  { id: 3, title: 'The Beaches Suite',     address: 'Beaches · 0.9 km to Michael Garron',          price: 2640, beds: 1, baths: 1, sqft: 480, tag: 'Pet OK' },
  { id: 4, title: 'Lakeshore Pied-à-terre',address: 'Mimico · 1.4 km to Trillium Health',          price: 2990, beds: 1, baths: 1, sqft: 610, tag: 'Editor’s Pick' },
  { id: 5, title: 'Annex Townhouse',       address: 'The Annex · 0.4 km to Toronto General',       price: 3680, beds: 2, baths: 2, sqft: 880, tag: 'Locum' },
  { id: 6, title: 'Riverdale Garden',      address: 'Riverdale · 1.0 km to Bridgepoint Health',    price: 2510, beds: 1, baths: 1, sqft: 520, tag: 'New' },
];

const NEIGHBORHOODS = [
  { name: 'Downtown Core',       count: 84, label: 'Toronto General · Mt Sinai' },
  { name: 'Mississauga West',    count: 42, label: 'Trillium · Credit Valley' },
  { name: 'Scarborough',         count: 31, label: 'Sunnybrook · Rouge Valley' },
  { name: 'Kitchener–Waterloo',  count: 27, label: 'Grand River · St Mary’s' },
  { name: 'Hamilton',            count: 38, label: 'Juravinski · St Joseph’s' },
  { name: 'London ON',           count: 22, label: 'Victoria · University' },
];

// ----- Reusable bits -----
function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585] font-medium ${className}`}>
      {children}
    </div>
  );
}

// =====================================================================
// HERO
// =====================================================================
function HeroSearch() {
  return (
    <section className="pt-12 pb-16">
      <div className="mx-auto max-w-[1320px] px-8">
        {/* Headline */}
        <div className="max-w-[920px] mb-9">
          <Eyebrow className="mb-4">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#1E5BBE]" />
              Ontario · 401 Healthcare Corridor
            </span>
          </Eyebrow>
          <h1 className="m-0 font-medium tracking-[-0.04em] leading-[0.96] text-[#0E1A2B]" style={{ fontSize: 'clamp(44px, 7.6vw, 104px)' }}>
            Find your next post.<br />
            <span className="font-serif italic font-normal text-[#1E5BBE]" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
              Move in by Sunday.
            </span>
          </h1>
          <p className="max-w-[560px] mt-5 text-lg leading-snug text-[#3A4759]">
            Furnished homes, clinical suites, and locum roles within walking distance of Ontario’s top hospitals.
            Vetted hosts. No-broker fees. Move-in tonight.
          </p>
        </div>

        {/* Hero photo + overlap search */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0E1A2B] to-[#1a3a5c]" style={{ aspectRatio: '21/9', minHeight: 420, maxHeight: 560 }}>
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2200&q=85"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55 pointer-events-none" />
            <div className="absolute top-6 left-7 text-white" style={{ mixBlendMode: 'difference' }}>
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase opacity-85">
                Fig. 01 — Maple Walk, Cabbagetown
              </span>
            </div>
            <div className="absolute bottom-7 left-7 text-white">
              <p className="m-0 italic max-w-[520px] leading-[1.25] text-2xl" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                “Walked to my first shift in seven minutes.”
              </p>
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase mt-2.5 opacity-85">
                Priya N. — RN, Locum, 12-week placement
              </p>
            </div>
          </div>

          {/* Search bar — overlaps photo */}
          <HeroSearchCard />
        </div>

        {/* Trust strip */}
        <div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#E5DFD2]">
          {[
            ['1,247', 'Practitioners housed'],
            ['284',   'Active rentals tonight'],
            ['47',    'Hospitals served'],
            ['96%',   'Placed within 14 days'],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-medium tracking-[-0.04em] text-[#0E1A2B]" style={{ fontSize: 42 }}>{n}</div>
              <Eyebrow className="mt-2">{l}</Eyebrow>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// FEATURED LISTINGS CAROUSEL
// =====================================================================
function FeaturedStays() {
  const ref = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const toggle = (id: number) => setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 380, behavior: 'smooth' });

  return (
    <section className="pt-16 pb-20 border-t border-[#E5DFD2]">
      <div className="mx-auto max-w-[1320px] px-8">
        <div className="flex items-end justify-between mb-9 flex-wrap gap-5">
          <div>
            <Eyebrow className="mb-3.5">This week · 401 Corridor</Eyebrow>
            <h2 className="m-0 font-medium tracking-[-0.04em] leading-[0.96]" style={{ fontSize: 'clamp(36px, 4.6vw, 56px)' }}>
              Hand-picked stays<br />
              <span className="italic font-normal text-[#1E5BBE]" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                near every shift.
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll(-1)} className="size-11 rounded-full border border-[#E5DFD2] grid place-items-center hover:border-[#0E1A2B] transition">
              <ArrowLeft className="size-4.5" />
            </button>
            <button onClick={() => scroll(1)} className="size-11 rounded-full border border-[#E5DFD2] grid place-items-center hover:border-[#0E1A2B] transition">
              <ArrowRight className="size-4.5" />
            </button>
            <Link href="/facility-map" className="ml-2 inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[#E5DFD2] text-sm font-semibold hover:border-[#0E1A2B] transition">
              View all 284 stays <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div ref={ref}
          className="grid grid-flow-col auto-cols-[minmax(320px,1fr)] gap-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] snap-x snap-mandatory"
        >
          {LISTINGS.map(l => (
            <article key={l.id} className="snap-start flex flex-col gap-3.5 transition-transform duration-300 hover:-translate-y-1">
              <div className="relative rounded-2xl overflow-hidden bg-[#EFE9DD]" style={{ aspectRatio: '4/5' }}>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] tracking-[0.12em] uppercase text-[#6B7585]"
                  style={{ background: 'repeating-linear-gradient(135deg, #F0EBDF 0 12px, #EFE9DD 12px 24px)' }}
                >
                  <span className="px-2.5 py-1.5 bg-white/70 rounded-md">interior · {l.title}</span>
                </div>
                <span className="absolute top-3.5 left-3.5 bg-white text-[#0E1A2B] px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.14em] uppercase font-semibold">
                  {l.tag}
                </span>
                <button onClick={() => toggle(l.id)}
                  className={`absolute top-3 right-3 size-9 rounded-full bg-white/95 grid place-items-center transition hover:scale-110 ${saved.has(l.id) ? 'text-[#1E5BBE]' : 'text-[#0E1A2B]'}`}
                >
                  <Heart className="size-4" fill={saved.has(l.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="text-lg font-semibold m-0 tracking-[-0.015em]">{l.title}</h3>
                  <span className="text-lg font-semibold tracking-[-0.02em]">
                    ${l.price.toLocaleString()}
                    <span className="text-[13px] font-normal text-[#6B7585]">/mo</span>
                  </span>
                </div>
                <p className="mt-1 mb-3 text-sm text-[#6B7585]">{l.address}</p>
                <div className="flex gap-4.5 text-[13px] text-[#3A4759]">
                  <span className="inline-flex items-center gap-1.5"><Bed className="size-4" /> {l.beds} bed</span>
                  <span className="inline-flex items-center gap-1.5"><Bath className="size-4" /> {l.baths} bath</span>
                  <span className="inline-flex items-center gap-1.5"><Square className="size-4" /> {l.sqft} sqft</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// CORRIDOR SECTION (Med-Map preview)
// =====================================================================
function CorridorSection() {
  return (
    <section className="pt-20 pb-24 bg-[#EFE9DD]">
      <div className="mx-auto max-w-[1320px] px-8">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-16 items-center">
          <div>
            <Eyebrow className="mb-4">Med-Map™ · Live</Eyebrow>
            <h2 className="m-0 font-medium tracking-[-0.04em] leading-[0.96]" style={{ fontSize: 'clamp(36px, 4.6vw, 56px)' }}>
              Every hospital on<br />
              <span className="italic font-normal text-[#1E5BBE]" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                one corridor.
              </span>
            </h2>
            <p className="mt-5 max-w-[520px] text-lg leading-[1.55] text-[#3A4759]">
              From Windsor to Kingston, ScrubHub maps 500+ clinical hubs — with walk-times,
              transit overlays, and live availability for every furnished unit on the route.
            </p>

            <div className="flex flex-col gap-3.5 mt-7 mb-8">
              {[
                ['Walk-time to facility', 'Filter by minutes from any hospital entrance'],
                ['Transit overlay', 'GO Transit, TTC, MiWay layered on the map'],
                ['Verified inventory', 'Every host meets ScrubHub housing protocol'],
              ].map(([h, s]) => (
                <div key={h} className="flex gap-3.5 pb-3.5 border-b border-[#E5DFD2]">
                  <div className="size-8 rounded-full bg-white border border-[#E5DFD2] grid place-items-center shrink-0 text-[#0E1A2B]">
                    <BadgeCheck className="size-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[15px]">{h}</div>
                    <div className="text-sm text-[#6B7585] mt-0.5">{s}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/facility-map" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#0E1A2B] hover:bg-[#1a2a3f] text-white font-semibold transition">
              Open Med-Map <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E5DFD2] shadow-[0_30px_60px_rgba(14,26,43,0.10)]" style={{ aspectRatio: '4/3' }}>
            <img
              src="https://images.unsplash.com/photo-1697266901967-540144c797d1?w=1600&q=85&auto=format&fit=crop"
              alt="Cars parked in front of a residential home"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15 pointer-events-none" />
            <div className="absolute top-4 left-5 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase text-[#6B7585]">
              Fig. 02 · 401 Corridor
            </div>
            <div className="absolute bottom-4 right-5 inline-flex gap-3.5 items-center rounded-full bg-white/90 backdrop-blur px-3 py-1.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#0E1A2B]" />
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#3A4759]">Hospitals</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full border-2 border-[#1E5BBE]" />
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#3A4759]">Stays</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// HOW IT WORKS
// =====================================================================
function HowItWorks() {
  const steps: [string, string, string][] = [
    ['01', 'Search by hospital', 'Pick your facility and shift dates — we surface only listings within a 15-minute walk or transit hop.'],
    ['02', 'Verify, then book',  'Hosts are credentialed against the ScrubHub housing protocol. License upload, e-sign, deposit — all in one flow.'],
    ['03', 'Move in tonight',    'Lockbox or smart-lock access. Concierge LIAISON on standby for late shifts and last-minute swaps.'],
  ];
  return (
    <section className="pt-24 pb-24">
      <div className="mx-auto max-w-[1320px] px-8">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 mb-12 items-end">
          <div>
            <Eyebrow className="mb-4">How ScrubHub works</Eyebrow>
            <h2 className="m-0 font-medium tracking-[-0.04em] leading-[0.96]" style={{ fontSize: 'clamp(36px, 4.6vw, 56px)' }}>
              Three steps from<br />
              <span className="italic font-normal text-[#1E5BBE]" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                offer to occupancy.
              </span>
            </h2>
          </div>
          <p className="text-[17px] leading-[1.55] text-[#3A4759] max-w-[540px] m-0 lg:justify-self-end">
            We rebuilt the rental flow for the rhythm of clinical work — nights, swaps, and 13-week
            contracts that don’t fit a 12-month lease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E5DFD2] border border-[#E5DFD2] rounded-3xl overflow-hidden">
          {steps.map(([n, t, d]) => (
            <div key={n} className="bg-[#F7F4EE] p-9 flex flex-col gap-4 min-h-[280px]">
              <div className="font-mono text-xs tracking-[0.18em] text-[#6B7585]">{n}</div>
              <h3 className="m-0 italic font-normal text-[34px] leading-[1.05] tracking-[-0.01em] text-[#1E5BBE]" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>{t}</h3>
              <p className="m-0 text-[15px] leading-[1.6] text-[#3A4759]">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// NEIGHBORHOODS
// =====================================================================
function Neighborhoods() {
  return (
    <section className="pt-8 pb-24">
      <div className="mx-auto max-w-[1320px] px-8">
        <div className="flex items-end justify-between mb-7 flex-wrap gap-5">
          <div>
            <Eyebrow className="mb-3.5">By region</Eyebrow>
            <h2 className="m-0 font-medium tracking-[-0.04em] leading-[0.96]" style={{ fontSize: 'clamp(32px, 3.8vw, 44px)' }}>
              Where to land<br />
              <span className="italic font-normal text-[#1E5BBE]" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                this rotation.
              </span>
            </h2>
          </div>
          <Link href="/facility-map" className="text-sm font-semibold text-[#0E1A2B] inline-flex items-center gap-1.5 hover:gap-2 transition-all">
            All 18 regions <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {NEIGHBORHOODS.map(n => (
            <Link key={n.name} href="/facility-map" className="grid grid-cols-[1fr_auto] gap-4.5 items-center px-6 py-5 bg-white border border-[#E5DFD2] rounded-2xl no-underline text-[#0E1A2B] transition hover:border-[#0E1A2B] hover:-translate-y-0.5">
              <div>
                <div className="text-lg font-semibold tracking-[-0.01em]">{n.name}</div>
                <div className="text-[13px] text-[#6B7585] mt-1">{n.label}</div>
              </div>
              <div className="text-right">
                <div className="font-medium tracking-[-0.03em] text-2xl">{n.count}</div>
                <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#6B7585]">stays</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// HOSTS CTA
// =====================================================================
function HostsCTA() {
  return (
    <section className="py-16 bg-[#0E1A2B] text-white">
      <div className="mx-auto max-w-[1320px] px-8 grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
        <div>
          <div className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-70 mb-4">For hosts &amp; landlords</div>
          <h2 className="m-0 font-medium tracking-[-0.04em] leading-[0.96]" style={{ fontSize: 'clamp(34px, 4vw, 52px)' }}>
            Your unit, full of<br />
            <span className="italic font-normal text-[#F0DAB1]" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>verified nurses.</span>
          </h2>
          <p className="text-[17px] opacity-75 leading-[1.5] mt-4 max-w-[540px]">
            List once. ScrubHub matches you with credentialed practitioners on 8–13 week contracts,
            handles deposits, and pays out within 48 hours of move-in.
          </p>
          <div className="flex gap-3 mt-7 flex-wrap">
            <Link href={getAppSignupUrl()} className="inline-flex items-center gap-2 h-13 px-6 rounded-full bg-[#F7F4EE] text-[#0E1A2B] font-semibold transition hover:-translate-y-0.5" style={{ height: 52 }}>
              List a unit <ArrowRight className="size-4" />
            </Link>
            <button className="inline-flex items-center h-13 px-6 rounded-full border border-white/30 text-white font-semibold transition hover:border-white/60" style={{ height: 52 }}>
              Talk to LIAISON
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          {[
            ['$3,140', 'Avg. monthly payout'],
            ['11 days', 'Avg. time to first booking'],
            ['96%',     'Listing approval rate'],
            ['48 hrs',  'Payout after move-in'],
          ].map(([n, l]) => (
            <div key={l} className="px-5.5 py-5.5 rounded-2xl bg-white/8 border border-white/15" style={{ padding: '22px 22px' }}>
              <div className="font-medium tracking-[-0.03em] text-[32px]">{n}</div>
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase opacity-70 mt-1.5">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// LIAISON concierge bubble (kept from previous landing)
// =====================================================================
function LiaisonConcierge() {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 rounded-full bg-[#0E1A2B] text-white px-5 py-3 shadow-lg hover:scale-105 transition border border-white/10"
      >
        <span className="size-2 rounded-full bg-[#1E5BBE]" />
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase font-semibold">LIAISON</span>
      </button>
    );
  }
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[340px] rounded-2xl bg-white shadow-[0_24px_60px_rgba(14,26,43,0.22)] border border-[#E5DFD2] overflow-hidden">
      <div className="bg-[#0E1A2B] text-white px-5 py-3.5 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase font-semibold">LIAISON · Concierge</span>
        <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">×</button>
      </div>
      <div className="p-5 bg-[#F7F4EE]">
        <div className="bg-white border border-[#E5DFD2] rounded-xl p-3.5 text-sm text-[#3A4759]">
          Hi — looking for a stay near a specific hospital, or a locum role this rotation?
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// PAGE
// =====================================================================
export function LandingClient({ user }: { user: User | null }) {
  // Reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('reveal-active')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Load Instrument Serif on demand (no global font swap needed)
  useEffect(() => {
    if (document.getElementById('instrument-serif-link')) return;
    const link = document.createElement('link');
    link.id = 'instrument-serif-link';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#F7F4EE] text-[#0E1A2B] font-sans">
      <main className="flex-1">
        <HeroSearch />
        <FeaturedStays />
        <CorridorSection />
        <HowItWorks />
        <Neighborhoods />
        <HostsCTA />
      </main>
    </div>
  );
}
