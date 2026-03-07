'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Clock,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { getAppSignupUrl } from '@/lib/app-url';

const PLATFORM_STATS = [
  { value: 284, label: 'Active Rentals', trend: '+12% this month', urgent: false },
  { value: 47, label: 'Clinical Suites', trend: '+8% this month', urgent: false },
  { value: 1247, label: 'Staff Placed', trend: '+31% this year', urgent: false },
  { value: 12, label: 'Urgent Openings', trend: 'Needs Filling', urgent: true },
];

const NEW_ACTIVITY = [
  { title: 'Staffing Gap', hospital: 'Rouge Valley ER', time: 'Tonight, 11:00 PM', status: 'CRITICAL', icon: Clock },
  { title: 'Capacity Alert', hospital: 'Grand River ER', time: 'Ongoing', status: 'WARNING', icon: AlertTriangle },
  { title: 'Booking Request', hospital: 'Trillium Health', time: 'Tomorrow, 7:00 AM', status: 'PENDING', icon: Calendar },
];

const EDITORIAL_CARDS = [
  {
    title: 'Practitioner Housing',
    description:
      'Bright, minimalist residential spaces near top healthcare facilities. Fully furnished for seamless transient staffing.',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    href: '/housing',
  },
  {
    title: 'Clinical Suites',
    description:
      'Modern, glass-walled medical offices with luxury finishings. Book by the half-day or week with zero overhead.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    href: '/housing',
  },
  {
    title: 'The Staffing Protocol',
    description:
      'High-caliber contract placing. Connect credentialed professionals directly to critical care hubs in real-time.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
    href: '/staffing',
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OK: 'bg-primary/10 text-primary border-primary/30',
    PENDING: 'bg-slate-100 text-slate-600 border-slate-200',
    WARNING: 'bg-amber-50 text-amber-700 border-amber-200',
    CRITICAL: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-bold tracking-widest uppercase ${styles[status] ?? ''}`}
    >
      {status}
    </span>
  );
}

function AnimCounter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <span>{val.toLocaleString()}</span>;
}

function LiaisonConcierge() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-5 py-3 shadow-lg hover:scale-105 transition-all duration-300 border border-white/10"
      >
        <span className="relative flex size-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
        </span>
        <span className="font-semibold text-sm tracking-wide">LIAISON Support</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[340px] rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,31,63,0.15)] border border-[#e0e0e0] overflow-hidden flex flex-col reveal-on-scroll reveal-active">
      <div className="bg-primary text-primary-foreground px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="font-bold tracking-widest text-xs uppercase">LIAISON</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </div>
      <div className="p-5 bg-[#FAFAFA] min-h-[120px] flex flex-col gap-3">
        <div className="bg-white border border-[#e0e0e0] rounded-xl rounded-tl-sm p-4 text-sm text-[#374151] shadow-sm">
          Welcome back. How can I assist with your deployment or listing today?
        </div>
      </div>
      <div className="p-3 bg-white border-t border-[#e0e0e0]">
        <div className="h-10 w-full rounded-lg bg-[#f0f4fa] flex items-center px-4 text-[#a0a0a0] text-sm">
          Type a message...
        </div>
      </div>
    </div>
  );
}

export function LandingClient({ user }: { user: User | null }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('reveal-active');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-blobs font-sans text-foreground">
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-[88rem] px-6 pt-24 pb-20 reveal-on-scroll">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-1.5 mb-8 shadow-sm backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                <span className="text-xs font-bold tracking-wide text-[#374151] uppercase">401 Healthcare Corridor</span>
              </div>

              <h1 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] text-foreground leading-[1.05] mb-8 font-sans">
                Your Practice,<br />
                <span className="italic text-primary">Optimized.</span>
              </h1>

              <p className="text-lg text-[#4a4a4a] leading-relaxed max-w-lg mb-10">
                The premium network for credentialed healthcare staffing, bespoke clinical suites, and verified
                practitioner housing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={getAppSignupUrl()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold px-8 py-4 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Join the Network
                </Link>
                <Link
                  href="/housing"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white/50 backdrop-blur-md text-foreground text-base font-bold px-8 py-4 transition-all duration-300 hover:bg-white hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
                >
                  Explore Portfolios
                </Link>
              </div>
            </div>

            <div className="space-y-6 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-xl border border-[#e0e0e0] rounded-2xl p-6 shadow-lg">
                  <p className="text-4xl font-sans text-foreground mb-1">
                    <AnimCounter target={PLATFORM_STATS[0].value} />
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#707070]">Active Rentals</p>
                </div>
                <div className="bg-primary rounded-2xl p-6 shadow-xl text-primary-foreground">
                  <p className="text-4xl font-sans mb-1">
                    <AnimCounter target={PLATFORM_STATS[2].value} />
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80">Staff Placed YoY</p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl border border-[#e0e0e0] rounded-2xl shadow-xl overflow-hidden p-2">
                <div className="px-4 py-3 border-b border-[#f0f0f0] flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm tracking-widest uppercase text-[#001F3F]">Critical Needs</h3>
                  <span className="text-xs text-[#707070] font-medium">Live Feed</span>
                </div>
                <div className="space-y-2">
                  {NEW_ACTIVITY.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#f8f9fa] transition-colors border border-transparent hover:border-[#e0e0e0] cursor-pointer group"
                    >
                      <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm border border-[#e0e0e0] shrink-0 text-[#001F3F] group-hover:scale-110 transition-transform">
                        <item.icon className="size-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-sm font-bold text-foreground">{item.title}</p>
                          <StatusBadge status={item.status} />
                        </div>
                        <p className="text-xs text-[#707070] font-medium">
                          {item.hospital} · {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Cards */}
        <section className="py-24 bg-white border-y border-[#e0e0e0] reveal-on-scroll">
          <div className="mx-auto max-w-[88rem] px-6">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-sans text-foreground mb-4">A Curated Ecosystem</h2>
              <p className="text-lg text-[#707070]">
                Exclusive residential and commercial real estate tailored specifically for the medical community.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {EDITORIAL_CARDS.map((card) => (
                <Link href={card.href} key={card.title} className="group flex flex-col items-center">
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md mb-6 relative hover:shadow-[0_20px_40px_rgba(0,31,63,0.15)] hover:scale-[1.02] transition-all duration-500 border border-[#e0e0e0]">
                    <div className="absolute inset-0 bg-[#f0f0f0]">
                      <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-center text-[#4a4a4a] text-sm leading-relaxed px-4">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Map Frame */}
        <section className="py-24 reveal-on-scroll">
          <div className="mx-auto max-w-[88rem] px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-sans text-foreground mb-6">Hyperlocal Intelligence.</h2>
                <p className="text-lg text-[#4a4a4a] leading-relaxed mb-8">
                  The Med-Map™ infrastructure visualizes over 500 clinical hubs across the GTA corridor. Pinpoint
                  proximity to hospitals, specialized clinics, and transit links with absolute precision.
                </p>
                <div className="flex flex-col gap-4 mb-10">
                  {['Filter by Hospital Network', 'Transit Overlay Routing', 'Live Open-Bed Analytics'].map((t) => (
                    <div key={t} className="flex items-center gap-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CheckCircle className="size-3" />
                      </div>
                      <span className="font-semibold text-[#374151]">{t}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/facility-map"
                  className="inline-flex items-center gap-2 text-foreground font-bold text-lg hover:gap-3 transition-all"
                >
                  Open Med-Map <ArrowRight className="size-5" />
                </Link>
              </div>

              <div className="relative pt-6 pl-4">
                <div className="absolute top-0 left-0 font-sans text-muted-foreground text-sm italic">Fig. 1 — Map View</div>
                <div className="w-full aspect-[4/3] rounded-2xl border border-[#c8c8c8] shadow-[0_30px_60px_rgba(0,31,63,0.12)] bg-white p-2 hover:scale-[1.01] transition-transform duration-500 overflow-hidden relative">
                  <div className="absolute inset-2 rounded-xl bg-[#f0f4fa] border border-[#e0e0e0] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                      alt="Map View of the Corridor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LiaisonConcierge />
    </div>
  );
}
