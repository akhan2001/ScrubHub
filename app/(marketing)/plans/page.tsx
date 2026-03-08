'use client';

import Link from 'next/link';
import { Zap, MessageSquare, Shield, BarChart3 } from 'lucide-react';
import { ROLES } from '@/lib/roles';
import { RoleCard } from '@/components/onboarding/role-card';

const TRUST = [
  { icon: Shield, label: 'PIPEDA Compliant', sub: 'All data is stored on Canadian soil.' },
  { icon: Zap, label: '24/7 Availability', sub: 'Book any listing at 2 AM — we never close.' },
  { icon: BarChart3, label: 'Live Inventory', sub: 'Real-time availability across the corridor.' },
  { icon: MessageSquare, label: 'LIAISON Concierge', sub: 'A clinical-grade AI assistant on every plan.' },
];

export default function PlansPage() {
  return (
    <div
      className="flex-1"
      style={{
        background: '#f0f4fa',
        backgroundImage:
          'linear-gradient(rgba(0,31,63,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,31,63,0.04) 1px,transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <main className="mx-auto max-w-[88rem] w-full px-6 py-16">
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

        <div className="grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto mb-20">
          {ROLES.map((role) => (
            <RoleCard
              key={role.id}
              as="link"
              role={role}
              href={role.id === 'enterprise' ? 'mailto:enterprise@scrubhub.ca' : `/signup?role=${role.id}`}
            />
          ))}
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
    </div>
  );
}
