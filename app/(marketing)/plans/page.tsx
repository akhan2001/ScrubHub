'use client';

import Link from 'next/link';
import { CheckCircle, X, Zap, Building2, Crown, MessageSquare, Shield, BarChart3 } from 'lucide-react';
import { ScrubHubNav, MiaFab } from '@/components/www/ScrubHubNav';
import { MarketingFooter } from '@/components/www/MarketingFooter';

const FEATURES = [
  { label: 'Browse verified listings', pro: true, ent: true },
  { label: 'Instant booking (24/7)', pro: true, ent: true },
  { label: 'Practitioner-verified units only', pro: true, ent: true },
  { label: 'Interactive facility map access', pro: true, ent: true },
  { label: 'Proximity map per listing', pro: true, ent: true },
  { label: 'Direct hospital-proximity filter', pro: true, ent: true },
  { label: 'LIAISON concierge (AI assistant)', pro: true, ent: true },
  { label: 'Saved searches & alerts', pro: true, ent: true },
  { label: 'Staffing board access', pro: true, ent: true },
  { label: 'Priority LIAISON queue', pro: false, ent: true },
  { label: 'Multi-seat / team accounts', pro: false, ent: true },
  { label: 'Bulk housing booking (locum groups)', pro: false, ent: true },
  { label: 'Dedicated account manager', pro: false, ent: true },
  { label: 'Custom onboarding & SLA', pro: false, ent: true },
  { label: 'Usage analytics & reporting', pro: false, ent: true },
  { label: 'API access for scheduling systems', pro: false, ent: true },
  { label: 'Branded listing pages', pro: false, ent: true },
  { label: 'Volume staffing posting (unlimited)', pro: false, ent: true },
];

const TRUST = [
  { icon: Shield, label: 'PIPEDA Compliant', sub: 'All data is stored on Canadian soil.' },
  { icon: Zap, label: '24/7 Availability', sub: 'Book any listing at 2 AM — we never close.' },
  { icon: BarChart3, label: 'Live Inventory', sub: 'Real-time availability across the corridor.' },
  { icon: MessageSquare, label: 'LIAISON Concierge', sub: 'A clinical-grade AI assistant on every plan.' },
];

export default function PlansPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: '#f0f4fa',
        backgroundImage:
          'linear-gradient(rgba(0,31,63,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,31,63,0.04) 1px,transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <ScrubHubNav activePage="Membership Plans" />

      <main className="flex-1 mx-auto max-w-[88rem] w-full px-6 py-16">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-primary mb-4">
            Transparent Pricing
          </span>
          <h1 className="text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4">
            Simple, honest plans.
            <br />
            <span className="text-primary">No hidden fees.</span>
          </h1>
          <p className="text-[#4a5568] text-lg max-w-xl mx-auto">
            Whether you&apos;re a solo practitioner or a regional health network — ScrubHub has a plan that fits.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 max-w-4xl mx-auto mb-20">
          <div className="relative flex flex-col rounded-2xl border border-[#d0d9e8] bg-white p-8 shadow-[0_4px_20px_rgba(0,31,63,0.07)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#eff6ff]">
                <Crown className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Professional</p>
                <p className="text-sm text-[#6b7280]">For individual practitioners</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-extrabold text-[#0F172A]">$149</span>
                <span className="text-[#6b7280] mb-1.5 text-sm">/month</span>
              </div>
              <p className="text-xs text-[#6b7280] mt-1">Billed monthly. Cancel anytime. No contracts.</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {FEATURES.filter((f) => f.pro).map((f) => (
                <li key={f.label} className="flex items-start gap-2.5 text-sm text-[#374151]">
                  <CheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
                  {f.label}
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="block text-center rounded-xl border-2 border-primary bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 transition-all shadow-md hover:shadow-lg"
            >
              Get Started Free →
            </Link>
            <p className="text-xs text-center text-[#6b7280] mt-3">14-day free trial · No credit card required</p>
          </div>

          <div className="relative flex flex-col rounded-2xl border-2 border-[#0F172A] bg-[#0F172A] p-8 shadow-[0_4px_32px_rgba(0,31,63,0.22)]">
            <div className="absolute -top-3.5 left-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow">
                Most Chosen by Hospitals
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                <Building2 className="size-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Enterprise</p>
                <p className="text-sm text-white/60">For hospitals & health networks</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-extrabold text-white">Custom</span>
              </div>
              <p className="text-xs text-white/50 mt-1">Volume pricing · Dedicated SLA · Annual contract</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {FEATURES.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5 text-sm text-white/80">
                  <CheckCircle className="size-4 text-blue-300 shrink-0 mt-0.5" />
                  {f.label}
                </li>
              ))}
            </ul>

            <Link
              href="mailto:enterprise@scrubhub.ca"
              className="block text-center rounded-xl border-2 border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 transition-all"
            >
              Book a Demo →
            </Link>
            <p className="text-xs text-center text-white/40 mt-3">Usually responds within 1 business day</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl font-extrabold text-foreground text-center mb-8">Full Feature Comparison</h2>
          <div className="rounded-2xl border border-[#d0d9e8] bg-white overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-[#f8fafd] border-b border-[#d0d9e8]">
              <div className="px-6 py-4 text-sm font-bold text-foreground">Feature</div>
              <div className="px-6 py-4 text-sm font-bold text-primary text-center">Professional</div>
              <div className="px-6 py-4 text-sm font-bold text-foreground text-center">Enterprise</div>
            </div>
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className={`grid grid-cols-3 border-b border-[#eef2f7] last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafcff]'}`}
              >
                <div className="px-6 py-3.5 text-sm text-[#374151]">{f.label}</div>
                <div className="px-6 py-3.5 flex justify-center items-center">
                  {f.pro ? (
                    <CheckCircle className="size-4 text-primary" />
                  ) : (
                    <X className="size-4 text-muted-foreground/50" />
                  )}
                </div>
                <div className="px-6 py-3.5 flex justify-center items-center">
                  <CheckCircle className="size-4 text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-xl border border-[#d0d9e8] bg-white p-5 text-center shadow-sm">
              <div className="flex justify-center mb-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#eff6ff]">
                  <Icon className="size-5 text-primary" />
                </div>
              </div>
              <p className="font-bold text-sm text-foreground mb-1">{label}</p>
              <p className="text-xs text-[#6b7280]">{sub}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-[#0F172A] px-10 py-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Meet LIAISON</p>
            <h2 className="text-3xl font-extrabold text-white mb-4">Not sure which plan is right for you?</h2>
            <p className="text-white/60 max-w-lg mx-auto mb-8 text-base">
              LIAISON is our AI concierge — available on every plan. It bridges the gap between your facility needs and
              available resources, 24/7, like a personal clinical coordinator.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3.5 transition-all shadow-md"
              >
                Start Free Trial
              </Link>
              <Link
                href="mailto:enterprise@scrubhub.ca"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 transition-all"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />

      <MiaFab />
    </div>
  );
}
