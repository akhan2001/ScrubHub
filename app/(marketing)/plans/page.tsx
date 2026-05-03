/* =============================================================
   app/(marketing)/plans/page.tsx — warm residential redesign
   ============================================================= */
'use client';

import Link from 'next/link';
import { Zap, MessageSquare, Shield, BarChart3, ArrowRight, Check } from 'lucide-react';
import { ROLES } from '@/lib/roles';

const TRUST = [
  { icon: Shield,        label: 'PIPEDA Compliant', sub: 'All data stored on Canadian soil.' },
  { icon: Zap,           label: '24/7 Availability', sub: 'Book any listing at 2 AM — we never close.' },
  { icon: BarChart3,     label: 'Live Inventory',    sub: 'Real-time availability across the corridor.' },
  { icon: MessageSquare, label: 'LIAISON Concierge', sub: 'AI assistant on every plan.' },
];

export default function PlansPage() {
  return (
    <div className="flex-1 bg-[#F7F4EE] text-[#0E1A2B]">
      {/* Hero */}
      <section className="border-b border-[#E5DFD2]">
        <div className="mx-auto max-w-[1320px] px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-6 font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585]">
            <span className="size-1.5 rounded-full bg-[#B8472E]" />
            Transparent pricing
          </div>
          <h1 className="m-0 font-medium tracking-[-0.04em] leading-[0.96] mx-auto max-w-[16ch]" style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}>
            Honest plans.<br />
            <span className="italic font-normal text-[#0E1A2B]" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
              No hidden fees.
            </span>
          </h1>
          <p className="text-[#3A4759] text-lg max-w-[560px] mx-auto mt-6 leading-[1.5]">
            Whether you&apos;re a solo practitioner or a regional health network — ScrubHub has a plan that fits the shift.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-[#EFE9DD] border-b border-[#E5DFD2]">
        <div className="mx-auto max-w-[1320px] px-8 py-20">
          <div className="grid gap-px bg-[#E5DFD2] border border-[#E5DFD2] rounded-3xl overflow-hidden sm:grid-cols-3 max-w-5xl mx-auto">
            {ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <Link
                  key={role.id}
                  href={role.id === 'enterprise' ? 'mailto:enterprise@scrubhub.ca' : `/signup?role=${role.id}`}
                  className="group bg-[#F7F4EE] p-8 flex flex-col gap-4 min-h-[320px] transition hover:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="size-11 rounded-xl bg-white border border-[#E5DFD2] grid place-items-center">
                      <Icon className="size-5 text-[#0E1A2B]" />
                    </div>
                    <ArrowRight className="size-4 text-[#6B7585] transition group-hover:translate-x-1 group-hover:text-[#0E1A2B]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.015em] m-0">{role.title}</h2>
                    <p className="text-[14px] leading-[1.55] text-[#3A4759] mt-2 m-0">{role.description}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#E5DFD2]">
                    <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6B7585]">Pricing</span>
                    <div className="text-[15px] font-semibold mt-1">{role.pricing}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-b border-[#E5DFD2]">
        <div className="mx-auto max-w-[1320px] px-8 py-20">
          <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585] font-medium text-center mb-3">
            Built for clinical work
          </div>
          <h2 className="m-0 text-center font-medium tracking-[-0.04em] leading-[0.96]" style={{ fontSize: 'clamp(34px, 4vw, 52px)' }}>
            Every plan, the same <span className="italic font-normal text-[#B8472E]" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>standards.</span>
          </h2>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="rounded-2xl border border-[#E5DFD2] bg-white p-6">
                <div className="flex items-center justify-center size-10 rounded-xl bg-[#EFE9DD] mb-4">
                  <Icon className="size-5 text-[#0E1A2B]" />
                </div>
                <p className="font-semibold text-[15px] m-0 mb-1.5 tracking-[-0.01em]">{label}</p>
                <p className="text-[13px] text-[#6B7585] m-0 leading-[1.5]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIAISON CTA */}
      <section className="bg-[#0E1A2B] text-white">
        <div className="mx-auto max-w-[1320px] px-8 py-20">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center max-w-5xl mx-auto">
            <div>
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-70 mb-4">Meet LIAISON</div>
              <h2 className="m-0 font-medium tracking-[-0.04em] leading-[0.96]" style={{ fontSize: 'clamp(34px, 4vw, 52px)' }}>
                Not sure which plan?<br />
                <span className="italic font-normal" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                  We&rsquo;ll match you.
                </span>
              </h2>
              <p className="text-[17px] opacity-75 leading-[1.5] mt-4 max-w-[520px]">
                LIAISON is our AI concierge — available on every plan. It bridges your facility needs with available
                resources, 24/7, like a personal clinical coordinator.
              </p>
              <div className="flex gap-3 mt-7 flex-wrap">
                <Link href="/signup" className="inline-flex items-center gap-2 h-13 px-7 rounded-full bg-[#F7F4EE] text-[#0E1A2B] font-semibold transition hover:-translate-y-0.5" style={{ height: 52 }}>
                  Start free trial <ArrowRight className="size-4" />
                </Link>
                <Link href="mailto:enterprise@scrubhub.ca" className="inline-flex items-center h-13 px-7 rounded-full border border-white/30 text-white font-semibold hover:border-white/60 transition" style={{ height: 52 }}>
                  Talk to sales
                </Link>
              </div>
            </div>
            <ul className="space-y-3 m-0 p-0 list-none">
              {[
                'Match your facility against 1,247 practitioners',
                'Pre-screen for license, region, and specialty',
                'Live inventory of furnished housing nearby',
                'PIPEDA-compliant — Canadian-soil data',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-[15px] opacity-90">
                  <span className="mt-0.5 size-5 rounded-full bg-white/15 grid place-items-center shrink-0">
                    <Check className="size-3" />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
