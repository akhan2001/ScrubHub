'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertTriangle, Clock, Building2 } from 'lucide-react';
import { ScrubHubNav, MiaFab } from '@/components/www/ScrubHubNav';
import { MarketingFooter } from '@/components/www/MarketingFooter';
import { getAppLoginUrl, getAppSignupUrl } from '@/lib/app-url';

const STAFFING = [
  {
    id: 1,
    urgent: true,
    title: 'Emergency Physician',
    facility: 'Newmarket Southlake Regional Medical Centre',
    city: 'Newmarket, ON',
    type: 'LOCUM',
    shift: '12hr Nights',
    tags: ['Trauma', 'ER Cert Required', 'ACLS Required'],
    rate: '$280/hr',
    rateLabel: 'Locum Rate',
    startDate: 'Immediate',
  },
  {
    id: 2,
    urgent: true,
    title: 'Registered Nurse — ICU',
    facility: 'Trillium Health Partners — Credit Valley',
    city: 'Mississauga, ON',
    type: 'CONTRACT',
    shift: '12hr Days/Nights',
    tags: ['ICU', 'Critical Care', 'BCLS'],
    rate: '$52/hr',
    rateLabel: 'Contract Rate',
    startDate: 'Mar 10, 2026',
  },
  {
    id: 3,
    urgent: false,
    title: 'Family Physician',
    facility: 'Guelph Community Health Centre',
    city: 'Guelph, ON',
    type: 'FULL-TIME',
    shift: 'Mon–Fri Days',
    tags: ['Primary Care', 'CPSO Required', 'Bilingual Asset'],
    rate: '$450K+',
    rateLabel: 'Annual FFS',
    startDate: 'Apr 1, 2026',
  },
  {
    id: 4,
    urgent: true,
    title: 'Respiratory Therapist',
    facility: 'Grand River Hospital',
    city: 'Kitchener, ON',
    type: 'CONTRACT',
    shift: '8hr Rotating',
    tags: ['Vent Management', 'Critical Care', 'RRT Required'],
    rate: '$48/hr',
    rateLabel: 'Contract Rate',
    startDate: 'Immediate',
  },
  {
    id: 5,
    urgent: false,
    title: 'Nurse Practitioner',
    facility: 'Brampton Civic Hospital',
    city: 'Brampton, ON',
    type: 'PERMANENT',
    shift: 'Flexible',
    tags: ['NP-PHC', 'Primary Care', 'CRNBC'],
    rate: '$130K',
    rateLabel: 'Annual Salary',
    startDate: 'Flexible',
  },
  {
    id: 6,
    urgent: false,
    title: 'Physiotherapist',
    facility: 'Waterloo Rehabilitation Centre',
    city: 'Waterloo, ON',
    type: 'PART-TIME',
    shift: 'Mornings',
    tags: ['Orthopedic', 'Sports Rehab', 'CPO Required'],
    rate: '$45/hr',
    rateLabel: 'Hourly Rate',
    startDate: 'Mar 15, 2026',
  },
  {
    id: 7,
    urgent: true,
    title: 'Hospitalist Physician',
    facility: 'Rouge Valley Centenary Hospital',
    city: 'Toronto, ON',
    type: 'LOCUM',
    shift: '24hr On-Call',
    tags: ['Internal Medicine', 'CCFP Required', 'ACLS'],
    rate: '$240/hr',
    rateLabel: 'Locum Rate',
    startDate: 'Immediate',
  },
  {
    id: 8,
    urgent: false,
    title: 'Occupational Therapist',
    facility: "St. Mary's General Hospital",
    city: 'Kitchener, ON',
    type: 'FULL-TIME',
    shift: 'Mon–Fri',
    tags: ['Acute Care', 'Mental Health', 'CAOT Required'],
    rate: '$42/hr',
    rateLabel: 'Salary Band',
    startDate: 'Mar 20, 2026',
  },
];

const FILTERS = [
  'All Positions',
  'Urgent',
  'Locum',
  'Contract',
  'Full-Time',
  'Physician',
  'Nursing',
  'Allied Health',
];

export default function StaffingPage() {
  const [active, setActive] = useState('All Positions');

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
      <ScrubHubNav activePage="Staffing" />

      <main className="flex-1 mx-auto max-w-[88rem] w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2">Open Staffing Positions</h1>
          <p className="text-[#4a5568] text-base">
            Locum, contract, and permanent positions across hospitals and clinics in the 401 Corridor. Updated daily —
            apply directly through ScrubHub.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-all duration-150 ${
                active === f
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {STAFFING.map((j) => (
            <div
              key={j.id}
              className={`rounded-2xl border bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,31,63,0.06)] hover:shadow-[0_8px_24px_rgba(29,111,216,0.13)] hover:-translate-y-1 transition-all duration-200 ${
                j.urgent ? 'border-red-200' : 'border-[#d0d9e8]'
              }`}
            >
              <div
                className={`px-4 py-3 border-b ${j.urgent ? 'bg-red-50 border-red-100' : 'bg-[#f8fafd] border-[#eef2f7]'}`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  {j.urgent && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider">
                      <AlertTriangle className="size-2.5" /> URGENT
                    </span>
                  )}
                  <span
                    className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                      j.type === 'LOCUM'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : j.type === 'CONTRACT'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-primary/10 text-primary border border-primary/30'
                    }`}
                  >
                    {j.type}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#0F172A] text-sm mb-1">{j.title}</h3>
                <div className="flex items-start gap-1 mb-1">
                  <Building2 className="size-3 text-[#6b7280] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#6b7280] leading-snug">{j.facility}</p>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Clock className="size-3 text-[#6b7280]" />
                  <p className="text-xs text-[#6b7280]">
                    {j.shift} · {j.city}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {j.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#d0d9e8] bg-[#f8fafd] px-2 py-0.5 text-[0.65rem] text-[#374151] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-extrabold text-primary leading-none">{j.rate}</p>
                    <p className="text-[0.65rem] text-[#6b7280] mt-0.5">{j.rateLabel}</p>
                  </div>
                  <Link
                    href={getAppSignupUrl()}
                    className="inline-flex items-center rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-xs font-bold text-primary-foreground transition-all"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-[#d0d9e8] bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">Need to post a position for your facility?</h2>
          <p className="text-[#4a5568] mb-6 max-w-md mx-auto">
            Create an institution account to post staffing needs and reach verified, credentialed healthcare
            professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={getAppSignupUrl()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3.5 transition-all shadow-md"
            >
              Post a Role
            </Link>
            <Link
              href={getAppLoginUrl()}
              className="inline-flex items-center gap-2 rounded-xl border border-border text-muted-foreground font-semibold px-8 py-3.5 hover:border-primary/50 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <MarketingFooter />

      <MiaFab />
    </div>
  );
}
